/**
 * File Upload Utilities for Bags API
 *
 * Implements file upload handling per Bags principles:
 * https://docs.bags.fm/principles/file-uploads
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { BAGS_FILE_UPLOAD, BAGS_API_CONFIG } from '../constants/bags.js';
import { bagsApiFetch, withRetry } from './retry.js';

export interface FileUploadResult {
  url: string;
  ipfsHash?: string;
  filename: string;
  size: number;
  contentType: string;
  checksum: string;
}

export interface FileUploadOptions {
  validateFile?: boolean;
  generateChecksum?: boolean;
  retryOptions?: {
    maxAttempts?: number;
    initialDelay?: number;
  };
}

/**
 * Upload image file to Bags API
 */
export async function uploadImageFile(
  file: File | Buffer,
  apiKey: string,
  filename: string,
  options: FileUploadOptions = {}
): Promise<FileUploadResult> {
  const {
    validateFile = true,
    generateChecksum = true,
    retryOptions = {},
  } = options;

  let fileBuffer: Buffer;
  let fileSize: number;
  let contentType: string;

  // Handle File object vs Buffer
  if (file instanceof File) {
    fileBuffer = Buffer.from(await file.arrayBuffer());
    fileSize = file.size;
    contentType = file.type;
  } else {
    fileBuffer = file;
    fileSize = file.length;
    contentType = getContentTypeFromFilename(filename);
  }

  // Validate file if requested
  if (validateFile) {
    validateImageFileBuffer(fileBuffer, fileSize, contentType, filename);
  }

  // Generate checksum if requested
  const checksum = generateChecksum
    ? createHash('sha256').update(fileBuffer).digest('hex')
    : '';

  console.log(
    `📤 Uploading file: ${filename} (${fileSize} bytes, ${contentType})`
  );

  // Create form data for upload
  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: contentType });
  formData.append(BAGS_FILE_UPLOAD.FIELD_NAME, blob, filename);

  // Upload with retry logic
  // Upload endpoint can be configured via BAGS_UPLOAD_ENDPOINT environment variable
  // See: https://docs.bags.fm/principles/file-uploads for endpoint documentation
  const uploadEndpoint =
    process.env.BAGS_UPLOAD_ENDPOINT || `${BAGS_API_CONFIG.BASE_URL}/upload`;

  const uploadResponse = await withRetry(async () => {
    const response = await bagsApiFetch(uploadEndpoint, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        // Note: Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    return response.json();
  }, retryOptions);

  console.log(`✅ File uploaded successfully: ${uploadResponse.url}`);

  return {
    url: uploadResponse.url,
    ipfsHash: uploadResponse.ipfsHash,
    filename,
    size: fileSize,
    contentType,
    checksum,
  };
}

/**
 * Validate image file according to Bags constraints
 */
function validateImageFileBuffer(
  buffer: Buffer,
  size: number,
  contentType: string,
  filename: string
): void {
  // Check file size
  if (size > BAGS_FILE_UPLOAD.MAX_SIZE_BYTES) {
    throw new Error(
      `File too large: ${(size / (1024 * 1024)).toFixed(2)}MB. ` +
        `Maximum allowed: ${BAGS_FILE_UPLOAD.MAX_SIZE_MB}MB`
    );
  }

  // Check content type
  if (!BAGS_FILE_UPLOAD.SUPPORTED_TYPES.includes(contentType)) {
    throw new Error(
      `Unsupported file type: ${contentType}. ` +
        `Supported types: ${BAGS_FILE_UPLOAD.SUPPORTED_TYPES.join(', ')}`
    );
  }

  // Check file signature (magic bytes) for common image types
  if (buffer.length >= 4) {
    const signature = buffer.subarray(0, 4);

    if (!isValidImageSignature(signature, contentType)) {
      throw new Error(
        `File signature does not match content type ${contentType}. ` +
          `File may be corrupted or mislabeled.`
      );
    }
  }

  // Additional validation for filename
  if (!filename || filename.trim() === '') {
    throw new Error('Filename cannot be empty');
  }

  const ext = path.extname(filename).toLowerCase();
  const expectedExtensions: Record<string, string[]> = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
  };

  const validExts = expectedExtensions[contentType] || [];
  if (validExts.length > 0 && !validExts.includes(ext)) {
    console.warn(
      `⚠️ Filename extension ${ext} does not match content type ${contentType}. ` +
        `Expected: ${validExts.join(', ')}`
    );
  }
}

/**
 * Check if buffer has valid image file signature
 */
function isValidImageSignature(
  signature: Buffer,
  contentType: string
): boolean {
  const signatures: Record<string, Buffer[]> = {
    'image/png': [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
    'image/jpeg': [
      Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
      Buffer.from([0xff, 0xd8, 0xff, 0xe1]),
      Buffer.from([0xff, 0xd8, 0xff, 0xe2]),
      Buffer.from([0xff, 0xd8, 0xff, 0xe3]),
    ],
    'image/gif': [
      Buffer.from([0x47, 0x49, 0x46, 0x38]), // GIF8
    ],
    'image/webp': [Buffer.from([0x52, 0x49, 0x46, 0x46])], // RIFF (WebP)
  };

  const validSignatures = signatures[contentType] || [];
  return validSignatures.some((validSig) =>
    signature.subarray(0, validSig.length).equals(validSig)
  );
}

/**
 * Get content type from filename extension
 */
function getContentTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();

  const typeMap: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };

  return typeMap[ext] || 'application/octet-stream';
}

/**
 * Read file from disk and prepare for upload
 */
export async function prepareFileForUpload(
  filePath: string
): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const buffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const contentType = getContentTypeFromFilename(filename);

  return { buffer, filename, contentType };
}

/**
 * Optimize image file for upload (optional preprocessing)
 *
 * Note: Full image optimization requires the 'sharp' library.
 * Install with: npm install sharp
 *
 * When sharp is not available, this function returns the original buffer.
 * For production use, install sharp for proper image optimization:
 * - Resize to max dimensions
 * - Convert format if needed
 * - Optimize quality/compression
 */
export async function optimizeImageForUpload(
  buffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Buffer> {
  const { maxWidth = 1024, maxHeight = 1024, quality = 80, format } = options;

  // Attempt to use sharp if available
  try {
    const sharp = require('sharp');

    let pipeline = sharp(buffer).resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    // Apply format conversion if specified
    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    }

    return await pipeline.toBuffer();
  } catch (err) {
    // sharp not available - return original buffer
    // This is acceptable for development; production should install sharp
    console.log(
      'Image optimization skipped (sharp not installed) - using original image'
    );
    return buffer;
  }
}

/**
 * Create deterministic asset preparation for token metadata
 */
export async function prepareTokenAssets(
  assets: {
    image?: string; // File path
    metadata?: Record<string, any>;
  },
  apiKey: string,
  buildId: string
): Promise<{
  imageUrl?: string;
  metadataHash: string;
  uploadReceipts: FileUploadResult[];
}> {
  const uploadReceipts: FileUploadResult[] = [];
  let imageUrl: string | undefined;

  // Upload image if provided
  if (assets.image) {
    console.log('🖼️ Preparing token image...');

    const { buffer, filename, contentType } = await prepareFileForUpload(
      assets.image
    );

    // Optimize image if needed
    const optimizedBuffer = await optimizeImageForUpload(buffer, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 85,
    });

    // Create deterministic filename
    const imageHash = createHash('sha256')
      .update(optimizedBuffer)
      .digest('hex')
      .substring(0, 16);
    const ext = path.extname(filename);
    const deterministicFilename = `token-${buildId}-${imageHash}${ext}`;

    // Upload file
    const uploadResult = await uploadImageFile(
      optimizedBuffer,
      apiKey,
      deterministicFilename
    );

    imageUrl = uploadResult.url;
    uploadReceipts.push(uploadResult);
  }

  // Create metadata hash for idempotency
  const metadataString = JSON.stringify(
    {
      image: imageUrl,
      ...assets.metadata,
    },
    Object.keys(assets.metadata || {}).sort()
  );

  const metadataHash = createHash('sha256')
    .update(metadataString)
    .digest('hex');

  return {
    imageUrl,
    metadataHash,
    uploadReceipts,
  };
}
