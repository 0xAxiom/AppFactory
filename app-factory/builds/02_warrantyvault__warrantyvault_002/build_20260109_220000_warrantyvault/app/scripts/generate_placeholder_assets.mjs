/**
 * Placeholder Asset Generator for WarrantyVault
 * Generates simple PNG placeholders using Node.js built-in modules
 *
 * Usage: node scripts/generate_placeholder_assets.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '..', 'assets', 'images');

// Brand color: Vault Blue
const BRAND_COLOR = { r: 37, g: 99, b: 235 }; // #2563EB

// Create a simple solid color PNG
// This is a minimal PNG encoder - creates single-color images
function createSolidColorPNG(width, height, color) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // chunk length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16); // bit depth
  ihdr.writeUInt8(2, 17); // color type (RGB)
  ihdr.writeUInt8(0, 18); // compression
  ihdr.writeUInt8(0, 19); // filter
  ihdr.writeUInt8(0, 20); // interlace
  const ihdrCrc = crc32(ihdr.slice(4, 21));
  ihdr.writeUInt32BE(ihdrCrc, 21);

  // IDAT chunk (image data)
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      rawData.push(color.r, color.g, color.b);
    }
  }

  // Simple deflate compression (store only, no actual compression)
  const compressed = deflateStore(Buffer.from(rawData));

  const idat = Buffer.alloc(compressed.length + 12);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  idat.writeUInt32BE(idatCrc, compressed.length + 8);

  // IEND chunk
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Simple store-only deflate (valid but uncompressed)
function deflateStore(data) {
  const chunks = [];
  let offset = 0;
  const BLOCK_SIZE = 65535;

  while (offset < data.length) {
    const remaining = data.length - offset;
    const blockSize = Math.min(remaining, BLOCK_SIZE);
    const isLast = offset + blockSize >= data.length;

    // Block header
    const header = Buffer.alloc(5);
    header.writeUInt8(isLast ? 1 : 0, 0);
    header.writeUInt16LE(blockSize, 1);
    header.writeUInt16LE(blockSize ^ 0xFFFF, 3);

    chunks.push(header);
    chunks.push(data.slice(offset, offset + blockSize));
    offset += blockSize;
  }

  // Add zlib header (78 01) and adler32 checksum
  const zlibHeader = Buffer.from([0x78, 0x01]);
  const adler = adler32(data);
  const adlerBuf = Buffer.alloc(4);
  adlerBuf.writeUInt32BE(adler, 0);

  return Buffer.concat([zlibHeader, ...chunks, adlerBuf]);
}

// CRC32 calculation
function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = makeCrcTable();

  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
  }

  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeCrcTable() {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
}

// Adler32 checksum
function adler32(data) {
  let a = 1, b = 0;
  const MOD = 65521;

  for (let i = 0; i < data.length; i++) {
    a = (a + data[i]) % MOD;
    b = (b + a) % MOD;
  }

  return ((b << 16) | a) >>> 0;
}

// Main
function main() {
  // Ensure assets directory exists
  if (!existsSync(ASSETS_DIR)) {
    mkdirSync(ASSETS_DIR, { recursive: true });
  }

  console.log('Generating placeholder assets for WarrantyVault...');

  // App Icon (1024x1024)
  const iconPng = createSolidColorPNG(1024, 1024, BRAND_COLOR);
  writeFileSync(join(ASSETS_DIR, 'icon.png'), iconPng);
  console.log('  Created icon.png (1024x1024)');

  // Adaptive Icon (1024x1024)
  const adaptivePng = createSolidColorPNG(1024, 1024, BRAND_COLOR);
  writeFileSync(join(ASSETS_DIR, 'adaptive-icon.png'), adaptivePng);
  console.log('  Created adaptive-icon.png (1024x1024)');

  // Splash Screen (1284x2778)
  const splashPng = createSolidColorPNG(1284, 2778, BRAND_COLOR);
  writeFileSync(join(ASSETS_DIR, 'splash.png'), splashPng);
  console.log('  Created splash.png (1284x2778)');

  // Notification Icon (96x96) - white for Android
  const notifPng = createSolidColorPNG(96, 96, { r: 255, g: 255, b: 255 });
  writeFileSync(join(ASSETS_DIR, 'notification-icon.png'), notifPng);
  console.log('  Created notification-icon.png (96x96)');

  console.log('Done! Asset placeholders generated successfully.');
}

main();
