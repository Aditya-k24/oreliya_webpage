import { NextRequest, NextResponse } from 'next/server';
import type { Request, Response, NextFunction } from 'express';

export interface NextJSRequest extends Request {
  nextRequest: NextRequest;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class NextJSResponse {
  private _status = 200;
  private _headers: Record<string, string> = {};
  private _body: unknown = null;
  private _sent = false;

  status(code: number): this {
    this._status = code;
    return this;
  }

  setHeader(name: string, value: string): this {
    this._headers[name] = value;
    return this;
  }

  json(data: unknown): this {
    if (this._sent) return this;
    this._body = data;
    this._sent = true;
    this.setHeader('Content-Type', 'application/json');
    return this;
  }

  send(data: unknown): this {
    if (this._sent) return this;
    this._body = data;
    this._sent = true;
    return this;
  }

  getResponse(): NextResponse {
    return NextResponse.json(this._body, {
      status: this._status,
      headers: this._headers,
    });
  }

  isSent(): boolean {
    return this._sent;
  }
}

export async function convertNextRequestToExpress(
  nextRequest: NextRequest,
  params?: Record<string, string>
): Promise<NextJSRequest> {
  const url = new URL(nextRequest.url);
  
  let body: unknown = null;
  const contentType = nextRequest.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    try {
      body = await nextRequest.json();
    } catch (e) {
      body = {};
    }
  }

  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const headers: Record<string, string> = {};
  nextRequest.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const req: NextJSRequest = {
    method: nextRequest.method,
    url: nextRequest.url,
    headers: headers,
    body: body,
    query: query,
    params: params || {},
    get: (name: string) => headers[name.toLowerCase()],
    header: (name: string) => headers[name.toLowerCase()],
    nextRequest,
  } as NextJSRequest;

  return req;
}

type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
type Handler = (req: Request, res: Response) => void | Promise<void>;

export function createNextRouteHandler(...middlewares: (Middleware | Handler)[]) {
  return async (
    nextRequest: NextRequest,
    context?: { params?: Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      const req = await convertNextRequestToExpress(nextRequest, context?.params);
      const res = new NextJSResponse();

      let currentIndex = 0;

      const next = async (error?: unknown): Promise<void> => {
        if (error) {
          throw error;
        }

        if (currentIndex >= middlewares.length) {
          return;
        }

        const middleware = middlewares[currentIndex++];
        
        if (middleware.length === 3) {
          await (middleware as Middleware)(req as Request, res as unknown as Response, next);
        } else {
          await (middleware as Handler)(req as Request, res as unknown as Response);
        }
      };

      await next();

      if (!res.isSent()) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }

      return res.getResponse();
    } catch (error: unknown) {
      console.error('API Error:', error);
      
      if (error && typeof error === 'object') {
        const err = error as { statusCode?: number; message?: string; name?: string };
        
        if (err.statusCode) {
          return NextResponse.json(
            { error: err.message || 'An error occurred' },
            { status: err.statusCode }
          );
        }

        if (err.name === 'UnauthorizedError') {
          return NextResponse.json(
            { error: err.message || 'Unauthorized' },
            { status: 401 }
          );
        }

        if (err.name === 'ForbiddenError') {
          return NextResponse.json(
            { error: err.message || 'Forbidden' },
            { status: 403 }
          );
        }

        if (err.name === 'NotFoundError') {
          return NextResponse.json(
            { error: err.message || 'Not found' },
            { status: 404 }
          );
        }

        if (err.name === 'BadRequestError' || err.name === 'ValidationError') {
          return NextResponse.json(
            { error: err.message || 'Bad request' },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 }
      );
    }
  };
}


