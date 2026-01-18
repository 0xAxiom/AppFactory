"use client";

import { sdk } from "@farcaster/frame-sdk";
import { useState, useEffect } from "react";
import * as htmlToImage from 'html-to-image';

interface ShareButtonProps {
  displayName: string;
  tokens?: Array<{ imageUrl?: string; name?: string }>;
}

export function ShareButton({ displayName, tokens = [] }: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'capturing' | 'uploading' | 'ready' | 'sharing' | 'error'>('idle');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Detect if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Wait for images to be VISUALLY RENDERED (not just loaded)
  const waitForVisualRender = async (): Promise<boolean> => {
    const collageContainer = document.getElementById('collage-container');
    if (!collageContainer) return false;

    const images = collageContainer.querySelectorAll('img');
    console.log(`🔍 [SHARE-BUTTON] Found ${images.length} images to validate`);
    
    const timeout = 10000; // 10 seconds max
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      // Check if images are visually rendered
      const allImagesVisible = Array.from(images).every(img => {
        // Skip placeholder images
        if (img.src.includes('placeholder')) return true;
        
        // Basic load check
        const isLoaded = img.complete && img.naturalWidth > 0;
        
        // Visual render check - get computed style and check if actually taking up space
        const rect = img.getBoundingClientRect();
        const hasVisibleDimensions = rect.width > 0 && rect.height > 0;
        
        // Check if the image has rendered content (not just empty space)
        const computedStyle = window.getComputedStyle(img);
        const notHidden = computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none';
        
        const isVisuallyRendered = isLoaded && hasVisibleDimensions && notHidden;
        
        if (!isVisuallyRendered) {
          console.log('🔄 [SHARE-BUTTON] Image not visually rendered:', {
            src: img.src.substring(0, 60) + '...',
            loaded: isLoaded,
            rect: `${rect.width}x${rect.height}`,
            visibility: computedStyle.visibility,
            display: computedStyle.display
          });
        }
        
        return isVisuallyRendered;
      });
      
      if (allImagesVisible) {
        console.log('✅ [SHARE-BUTTON] All images visually rendered');
        return true;
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.warn('⚠️ [SHARE-BUTTON] Timeout - some images may not be visually rendered');
    return false;
  };

  // NEW: Generate image using Vercel OG Image service
  const generateOGImage = async () => {
    setStatus('capturing');
    setErrorMessage(null);
    
    console.log('🎨 [SHARE-BUTTON] Generating OG image for:', displayName, 'with', tokens.length, 'tokens');
    
    try {
      // Build URL for OG image service
      const ogParams = new URLSearchParams();
      ogParams.set('displayName', displayName);
      
      // Add up to 5 token images
      tokens.slice(0, 5).forEach((token, index) => {
        if (token.imageUrl) {
          ogParams.set(`img${index + 1}`, token.imageUrl);
        }
      });
      
      const ogImageUrl = `/api/og-collage?${ogParams.toString()}`;
      console.log('🔗 [SHARE-BUTTON] OG Image URL:', ogImageUrl);
      
      // Test if the OG image generates successfully
      const testResponse = await fetch(ogImageUrl);
      if (!testResponse.ok) {
        throw new Error(`OG Image generation failed: ${testResponse.status}`);
      }
      
      console.log('✅ [SHARE-BUTTON] OG Image generated successfully');
      setBlobUrl(ogImageUrl); // Use OG URL directly
      setStatus('ready');
      
    } catch (error) {
      console.error('❌ [SHARE-BUTTON] OG Image generation failed:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate image');
    }
  };

  // FALLBACK: Original client-side capture method  
  const captureAndSaveImage = async () => {
    // Reset state
    setStatus('capturing');
    setErrorMessage(null);
    
    console.log('📸 [SHARE-BUTTON] Starting capture process for displayName:', displayName);
    
    // Get the collage element
    const collageContainer = document.getElementById('collage-container');
    
    if (!collageContainer) {
      console.log('❌ [SHARE-BUTTON] Could not find collage-container element');
      setStatus('error');
      setErrorMessage('Could not find collage element');
      return;
    }
    
    console.log('✅ [SHARE-BUTTON] Found collage container:', collageContainer.offsetWidth + 'x' + collageContainer.offsetHeight);
    
    // Log all images in the collage for debugging
    const images = collageContainer.querySelectorAll('img');
    console.log('🖼️ [SHARE-BUTTON] Found', images.length, 'images in collage:');
    images.forEach((img, index) => {
      console.log(`  Image ${index + 1}:`, {
        src: img.src,
        loaded: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: img.width,
        height: img.height
      });
    });
    
    try {
      // Wait for images to be VISUALLY RENDERED before capturing
      console.log('⏳ [SHARE-BUTTON] Waiting for images to be visually rendered...');
      const imagesRendered = await waitForVisualRender();
      
      if (!imagesRendered) {
        console.warn('⚠️ [SHARE-BUTTON] Proceeding with capture despite some images not being fully rendered');
      }

      // Give extra time for any final paint operations
      console.log('⏱️ [SHARE-BUTTON] Final 500ms wait for paint completion...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Final validation - log what we're about to capture
      const finalImages = collageContainer.querySelectorAll('img');
      console.log('📊 [SHARE-BUTTON] About to capture with these images:');
      finalImages.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        console.log(`  Image ${index + 1}:`, {
          src: img.src.includes('placeholder') ? 'PLACEHOLDER' : img.src.substring(0, 80) + '...',
          dimensions: `${rect.width}x${rect.height}`,
          visible: rect.width > 0 && rect.height > 0,
          complete: img.complete,
          naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
          currentSrc: img.currentSrc ? 'HAS_CURRENT_SRC' : 'NO_CURRENT_SRC'
        });
      });
      
      // Also check Next.js Image wrapper divs
      const nextImageDivs = collageContainer.querySelectorAll('[style*="position: relative"]');
      console.log('🖼️ [SHARE-BUTTON] Next.js Image containers found:', nextImageDivs.length);
      
      console.log('🎯 [SHARE-BUTTON] Starting screen capture...');
      
      // Simple, clean capture - focus on timing, not options
      const dataUrl = await htmlToImage.toPng(collageContainer, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#000000',
        cacheBust: true
      });
      
      // Debug: Check if capture is mostly black (indicating failed image capture)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData?.data || [];
        
        // Count non-black pixels
        let nonBlackPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2];
          if (r > 10 || g > 10 || b > 10) nonBlackPixels++;
        }
        
        const totalPixels = data.length / 4;
        const nonBlackPercentage = (nonBlackPixels / totalPixels) * 100;
        console.log('🎨 [SHARE-BUTTON] Capture analysis:', {
          totalPixels,
          nonBlackPixels,
          nonBlackPercentage: Math.round(nonBlackPercentage),
          likelyFailedCapture: nonBlackPercentage < 30
        });
      };
      img.src = dataUrl;
      
      const dataUrlSize = dataUrl.length;
      const dataUrlType = dataUrl.substring(0, 50) + '...';
      console.log('✅ [SHARE-BUTTON] Successfully captured image:', dataUrlType, 'Size:', dataUrlSize, 'chars');
      
      // Upload to server
      setStatus('uploading');
      console.log('🔄 [SHARE-BUTTON] Uploading to /api/save-image...');

      const saveRes = await fetch("/api/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          displayName,
          imageData: dataUrl 
        }),
      });
  
      if (!saveRes.ok) {
        const errorText = await saveRes.text();
        console.log('❌ [SHARE-BUTTON] Save failed:', saveRes.status, errorText);
        throw new Error(`Image save failed: ${saveRes.status} - ${errorText}`);
      }
  
      const { blobUrl } = await saveRes.json();
      console.log("✅ [SHARE-BUTTON] Successfully uploaded! Blob URL:", blobUrl);
      
      // Set state to ready for sharing
      setBlobUrl(blobUrl);
      setStatus('ready');
      console.log('🎉 [SHARE-BUTTON] Process complete, ready to share!');
    } catch (error) {
      console.error("❌ [SHARE-BUTTON] Failed to capture and save image:", error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const handleShare = async () => {
    if (!blobUrl) {
      // Use OG Image service by default (more reliable)
      return await generateOGImage();
    }
    
    setStatus('sharing');
    
    try {
      // Remove spaces and URL encode the displayName for the frame URL
      const cleanDisplayName = displayName.replace(/\s+/g, '');
      const encodedDisplayName = encodeURIComponent(cleanDisplayName);
      const frameUrl = `${process.env.NEXT_PUBLIC_URL}/frame/${encodedDisplayName}`;
      
      await sdk.actions.composeCast({
        text: "Not financial advice. Just personal branding, this is my Zora Collage, whats yours?",
        embeds: [frameUrl],
      });
      
      setStatus('idle');
    } catch (error) {
      console.error("❌ Failed to share cast:", error);
      setStatus('error');
      setErrorMessage('Failed to share to Base App');
    }
  };

  // Button text based on status
  const getButtonText = () => {
    switch (status) {
      case 'capturing': return 'Loading images & capturing...';
      case 'uploading': return 'Uploading...';
      case 'ready': return 'Share to Base App';
      case 'sharing': return 'Opening Base App...';
      case 'error': return 'Try again';
      default: return 'Create Shareable Image';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={status === 'ready' ? handleShare : generateOGImage}
        disabled={['capturing', 'uploading', 'sharing'].includes(status)}
        className="border border-gray-700 hover:border-lime-300 text-gray-400 py-3 px-4 md:px-6 font-mono tracking-wider transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
      >
        {getButtonText()}
      </button>
      
      {/* Fallback option for testing */}
      {status === 'error' && (
        <button
          onClick={captureAndSaveImage}
          className="border border-red-700 hover:border-red-500 text-red-400 py-2 px-3 font-mono text-xs tracking-wider transition-colors duration-300"
        >
          Try Screen Capture Instead
        </button>
      )}
      
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}