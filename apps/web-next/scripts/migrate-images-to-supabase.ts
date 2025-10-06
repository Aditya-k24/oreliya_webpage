#!/usr/bin/env tsx
/* eslint-disable no-console */

import { PrismaClient } from '../prisma/generated/client'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { supabaseAdmin } from '../src/lib/supabase'

const prisma = new PrismaClient()

async function migrateImagesToSupabase() {
  console.log('🔄 Starting image migration to Supabase...')
  
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    
    // Check if uploads directory exists
    try {
      const files = readdirSync(uploadsDir)
      console.log(`📁 Found ${files.length} files in uploads directory`)
      
      for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
          console.log(`📤 Migrating ${file}...`)
          
          const filePath = join(uploadsDir, file)
          const fileBuffer = readFileSync(filePath)
          
          // Upload to products folder in production bucket
          const { error } = await supabaseAdmin.storage
            .from('production')
            .upload(`products/migrated/${file}`, fileBuffer, {
              contentType: getContentType(file),
              cacheControl: '31536000',
              upsert: true
            })
          
          if (error) {
            console.error(`❌ Failed to upload ${file}:`, error.message)
          } else {
            console.log(`✅ Successfully uploaded ${file}`)
            
            // Get public URL
            const { data: urlData } = supabaseAdmin.storage
              .from('production')
              .getPublicUrl(`products/migrated/${file}`)
            
            console.log(`🔗 Public URL: ${urlData.publicUrl}`)
          }
        }
      }
      
    } catch (error) {
      console.log('📁 No uploads directory found, skipping file migration')
    }
    
    // Update product images in database
    console.log('🔄 Updating product images in database...')
    const products = await prisma.products.findMany({
      where: {
        images: { isEmpty: false }
      }
    })
    
    for (const product of products) {
      const updatedImages = product.images.map((imageUrl: string) => {
        // Convert local URLs to Supabase URLs
        if (imageUrl.startsWith('/uploads/')) {
          const filename = imageUrl.replace('/uploads/', '')
          return `https://your-project-ref.supabase.co/storage/v1/object/public/production/products/migrated/${filename}`
        }
        return imageUrl
      })
      
      await prisma.products.update({
        where: { id: product.id },
        data: { images: updatedImages }
      })
      
      console.log(`✅ Updated images for product: ${product.name}`)
    }
    
    console.log('🎉 Image migration completed!')
    
  } catch (error) {
    console.error('❌ Image migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    default:
      return 'image/jpeg'
  }
}

migrateImagesToSupabase()
  .catch((e) => {
    console.error('❌ Migration script failed:', e)
    process.exit(1)
  })
