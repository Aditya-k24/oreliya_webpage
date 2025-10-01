import type { IncomingMessage, ServerResponse } from 'http';
import app from '../src/index';

// Vercel serverless handler (TS)
export default function handler(
  req: IncomingMessage,
  res: ServerResponse
): void {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if ((req as any).method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  type NodeHandler = (req: IncomingMessage, res: ServerResponse) => void;
  const expressHandler = app as unknown as NodeHandler;
  expressHandler(req, res);
}
