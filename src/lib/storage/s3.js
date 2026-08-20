import 'server-only'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import crypto from 'crypto'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const getS3Client = () => {
  const endpoint = process.env.S3_ENDPOINT_URL?.trim()

  return new S3Client({
    region: process.env.S3_BUCKET_REGION,
    endpoint: endpoint || undefined,
    forcePathStyle: Boolean(endpoint),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  })
}

const getPublicImageUrl = (key) => {
  const publicBaseUrl = process.env.S3_PUBLIC_URL?.trim()
  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, '')}/${key}`
  }

  const endpoint = process.env.S3_ENDPOINT_URL?.trim()
  if (!endpoint) {
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${key}`
  }

  return `${endpoint.replace(/\/$/, '')}/${process.env.S3_BUCKET_NAME}/${key}`
}

export const uploadProductImage = async (file, itemId) => {
  if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) {
    throw new Error('Please choose an image file')
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error('Images must be JPG, PNG, WebP, or GIF files')
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Images must be 10 MB or smaller')
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const key = `auction/${itemId}-${crypto.randomUUID()}.${extension}`

  await getS3Client().send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    CacheControl: 'public, max-age=31536000, immutable'
  }))

  return getPublicImageUrl(key)
}
