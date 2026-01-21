'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'validating' | 'validated' | 'error';

interface UploadResponse {
  success: boolean;
  upload_id?: string;
  error?: string;
  missing?: string[];
}

export default function UploadPage() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ticker: '',
    twitter: '',
    website: '',
  });

  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [tokenImage, setTokenImage] = useState<File | null>(null);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.endsWith('.zip')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a .zip file');
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile?.name.endsWith('.zip')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a .zip file');
      }
    },
    []
  );

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus('uploading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (data.success && data.upload_id) {
        setUploadId(data.upload_id);
        setUploadStatus('validated');
      } else {
        setError(data.error || 'Upload failed');
        if (data.missing) {
          setError(`Missing files: ${data.missing.join(', ')}`);
        }
        setUploadStatus('error');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setUploadStatus('error');
    }
  };

  const handleLaunch = async () => {
    if (!uploadId || !connected || !publicKey) return;

    // Navigate to launch page with all data
    const params = new URLSearchParams({
      upload_id: uploadId,
      ...formData,
    });

    router.push(`/launch/${uploadId}?${params.toString()}`);
  };

  const isFormValid =
    uploadStatus === 'validated' &&
    formData.name.length > 0 &&
    formData.description.length > 0 &&
    formData.ticker.length >= 3 &&
    formData.ticker.length <= 6 &&
    connected;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Upload Your Build</h1>
      <p className="text-zinc-400 mb-8">
        Upload your zipped Next.js app and fill out the launch form.
      </p>

      {/* Step 1: Upload */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm">
            1
          </span>
          Upload Zip File
        </h2>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition
            ${file ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 hover:border-zinc-500'}
            ${error ? 'border-red-500 bg-red-500/10' : ''}
          `}
        >
          {uploadStatus === 'uploading' || uploadStatus === 'validating' ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p>
                {uploadStatus === 'uploading'
                  ? 'Uploading...'
                  : 'Validating...'}
              </p>
            </div>
          ) : uploadStatus === 'validated' ? (
            <div className="flex flex-col items-center">
              <Check className="w-10 h-10 text-green-500 mb-4" />
              <p className="font-medium">Build validated!</p>
              <p className="text-sm text-zinc-400">{file?.name}</p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-zinc-500 mx-auto mb-4" />
              {file ? (
                <p className="font-medium">{file.name}</p>
              ) : (
                <p className="text-zinc-400">
                  Drag and drop your .zip file here, or{' '}
                  <label className="text-blue-500 cursor-pointer hover:underline">
                    browse
                    <input
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </p>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {file && uploadStatus === 'idle' && (
          <button
            onClick={handleUpload}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition"
          >
            Upload & Validate
          </button>
        )}
      </div>

      {/* Step 2: Form */}
      <div
        className={
          uploadStatus !== 'validated' ? 'opacity-50 pointer-events-none' : ''
        }
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm">
            2
          </span>
          Launch Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">App Name *</label>
            <input
              type="text"
              placeholder="My Awesome App"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              placeholder="What does your app do?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Token Ticker *{' '}
              <span className="text-zinc-500">(3-6 letters)</span>
            </label>
            <input
              type="text"
              placeholder="TOKEN"
              value={formData.ticker}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ticker: e.target.value.toUpperCase().slice(0, 6),
                })
              }
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Twitter</label>
              <input
                type="text"
                placeholder="@handle"
                value={formData.twitter}
                onChange={(e) =>
                  setFormData({ ...formData, twitter: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Token Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setTokenImage(e.target.files?.[0] || null)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
            />
          </div>
        </div>
      </div>

      {/* Step 3: Connect & Launch */}
      <div
        className={`mt-8 ${uploadStatus !== 'validated' ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm">
            3
          </span>
          Connect & Launch
        </h2>

        {!connected ? (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
            <p className="text-zinc-400 mb-4">
              Connect your wallet to continue
            </p>
            <p className="text-sm text-zinc-500">
              Click the wallet button in the header
            </p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400">Connected Wallet</span>
              <span className="font-mono text-sm">
                {publicKey?.toString().slice(0, 4)}...
                {publicKey?.toString().slice(-4)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-6 text-sm">
              <span className="text-zinc-400">Fee Split</span>
              <span>75% You / 25% App Factory</span>
            </div>
            <button
              onClick={handleLaunch}
              disabled={!isFormValid}
              className={`
                w-full py-3 rounded-lg font-medium transition
                ${
                  isFormValid
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-zinc-700 cursor-not-allowed'
                }
              `}
            >
              Prepare Launch
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
