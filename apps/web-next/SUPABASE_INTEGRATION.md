# Supabase Integration

This project has been configured to use Supabase for database and file storage.

## Features

- **Database**: PostgreSQL via Supabase
- **File Storage**: Supabase Storage with organized buckets
- **Image Upload**: Automatic upload to appropriate buckets
- **Migration Scripts**: Easy migration from existing setup

## Storage Structure

```
Supabase Storage Bucket: production
├── products/          # Product images
│   ├── product-images/
│   └── category-images/
└── customize/         # Customization images
    ├── engraving-images/
    └── user-uploads/
```

## API Endpoints

### Image Upload
- `POST /api/upload` - Upload to products folder (default)
- `POST /api/upload/customize` - Upload to customize folder
- `POST /api/upload?folder=customize` - Upload to customize folder with subfolder support

### Parameters
- `image`: File to upload
- `folder`: 'products' or 'customize' (optional, defaults to 'products')

## React Components

### ImageUpload Component
```tsx
import { ImageUpload } from '@/components/ImageUpload'

<ImageUpload
  onUploadComplete={(result) => {
    console.log('Uploaded:', result.url)
  }}
  folder="products"
/>
```

### useImageUpload Hook
```tsx
import { useImageUpload } from '@/hooks/useImageUpload'

const { uploadImage, isUploading } = useImageUpload()

const handleUpload = async (file: File) => {
  const result = await uploadImage(file, { folder: 'products' })
  if (result.success) {
    console.log('Uploaded:', result.url)
  }
}
```

## Environment Variables

Required environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Commands

- `pnpm supabase:setup` - Initial setup and environment file creation
- `pnpm supabase:test` - Test database connection
- `pnpm supabase:migrate-images` - Migrate existing images to Supabase
- `pnpm db:push` - Push Prisma schema to Supabase
- `pnpm db:migrate:deploy` - Deploy migrations to Supabase

## Migration Steps

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down credentials

2. **Configure Environment**
   - Run `pnpm supabase:setup`
   - Update `.env.local` with your credentials

3. **Create Storage Bucket**
   - In Supabase dashboard, go to Storage
   - Create bucket: `production`
   - Set to public

4. **Migrate Database**
   - Run `pnpm db:push` to push schema
   - Or `pnpm db:migrate:deploy` for migrations

5. **Test Setup**
   - Run `pnpm supabase:test`
   - Test image uploads

6. **Migrate Existing Images** (if any)
   - Run `pnpm supabase:migrate-images`

## File Upload Flow

1. Client uploads file via `/api/upload`
2. Server validates file (size, type)
3. File uploaded to appropriate folder in `production` bucket
4. Public URL returned to client
5. Client can use URL immediately

## Security

- File validation on upload (size, type)
- Folder-based organization within single bucket
- Public URLs for easy access
- Service role key for server-side operations
- Anon key for client-side operations

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` in `.env.local`
   - Verify Supabase project is active

2. **Upload Failed**
   - Check `SUPABASE_SERVICE_ROLE_KEY`
   - Verify storage bucket exists and is public

3. **Images Not Loading**
   - Check bucket permissions
   - Verify public URLs are correct

### Debug Commands

```bash
# Test database connection
pnpm supabase:test

# Check Prisma connection
pnpm db:studio

# View Supabase logs
# Check Supabase dashboard > Logs
```
