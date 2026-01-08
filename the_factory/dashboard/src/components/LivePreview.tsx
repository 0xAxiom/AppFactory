import React, { useState, useEffect } from 'react';
import { Play, Square, Copy, ExternalLink, AlertCircle, Loader } from 'lucide-react';
import QRCode from 'qrcode';

interface LivePreviewProps {
  ideaSlug: string;
  ideaName: string;
  runId?: string;
}

interface BuildInfo {
  id: string;
  path: string;
  name?: string;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

interface BuildDiscoveryResult {
  totalBuilds: number;
  validBuilds: number;
  builds: BuildInfo[];
  errors: string[];
}

interface PreviewSession {
  id: string;
  buildPath: string;
  mode: string;
  status: 'starting' | 'running' | 'stopped' | 'error';
  urls: {
    lanUrl?: string;
    devtools?: string;
    metro?: string;
  };
  error?: string;
  startedAt: string;
}

const PREVIEW_API_BASE = 'http://localhost:3456';

const LivePreview: React.FC<LivePreviewProps> = ({ ideaSlug, ideaName, runId }) => {
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [session, setSession] = useState<PreviewSession | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [availableBuilds, setAvailableBuilds] = useState<BuildInfo[]>([]);
  const [selectedBuild, setSelectedBuild] = useState<BuildInfo | null>(null);
  const [isLoadingBuilds, setIsLoadingBuilds] = useState(true);

  // Check if preview service is running
  const checkService = async () => {
    try {
      const response = await fetch(`${PREVIEW_API_BASE}/health`);
      setIsServiceRunning(response.ok);
      setError('');
    } catch {
      setIsServiceRunning(false);
    }
  };

  // Get current session status
  const getSessionStatus = async () => {
    if (!isServiceRunning) return;
    try {
      const response = await fetch(`${PREVIEW_API_BASE}/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSession(data.currentSession);
        
        // Generate QR code if we have a LAN URL
        if (data.currentSession?.urls?.lanUrl) {
          try {
            const qr = await QRCode.toDataURL(data.currentSession.urls.lanUrl);
            setQrCode(qr);
          } catch (err) {
            console.error('Failed to generate QR code:', err);
          }
        } else {
          setQrCode('');
        }
      }
    } catch (err) {
      console.error('Failed to get session status:', err);
    }
  };

  // Load available builds from the discovery API
  const loadAvailableBuilds = async () => {
    if (!isServiceRunning) return;
    
    setIsLoadingBuilds(true);
    try {
      const response = await fetch(`${PREVIEW_API_BASE}/builds`);
      if (response.ok) {
        const buildData: BuildDiscoveryResult = await response.json();
        setAvailableBuilds(buildData.builds);
        
        // Auto-select matching build for current idea
        const matchingBuilds = buildData.builds.filter(build => 
          build.id.includes(ideaSlug) || 
          build.name?.toLowerCase().includes(ideaSlug.toLowerCase()) ||
          build.path.includes(ideaSlug)
        ).filter(build => build.validation.isValid);
        
        if (matchingBuilds.length > 0) {
          // Prefer most recent valid build
          setSelectedBuild(matchingBuilds[0]);
        }
        
        setError('');
      }
    } catch (err) {
      console.error('Failed to load builds:', err);
      setError('Failed to load available builds');
    } finally {
      setIsLoadingBuilds(false);
    }
  };

  useEffect(() => {
    checkService();
    
    const interval = setInterval(() => {
      checkService();
      getSessionStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [ideaSlug]);

  useEffect(() => {
    if (isServiceRunning) {
      loadAvailableBuilds();
    }
  }, [isServiceRunning, ideaSlug]);

  const startPreview = async () => {
    if (!selectedBuild) {
      setError('No build selected. Please select a valid build to preview.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${PREVIEW_API_BASE}/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          buildPath: selectedBuild.path,
          mode: 'dev-client' 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start preview');
      }
      
      setSession(data.session);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start preview');
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const stopPreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${PREVIEW_API_BASE}/sessions/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setSession(null);
        setQrCode('');
        setError('');
      }
    } catch (err) {
      console.error('Failed to stop preview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  if (!isServiceRunning) {
    return (
      <div className="detail-section">
        <h3>Live Preview</h3>
        <div className="preview-service-down">
          <AlertCircle size={24} className="warning-icon" />
          <div>
            <p><strong>Preview service not running</strong></p>
            <p>Start the preview service to enable live previews:</p>
            <code>cd preview && npm install && npm start</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-section">
      <h3>Live Preview</h3>
      
      {isLoadingBuilds ? (
        <div className="preview-loading">
          <Loader className="spin" size={16} />
          <span>Loading available builds...</span>
        </div>
      ) : availableBuilds.length > 0 ? (
        <div className="build-selection">
          <label htmlFor="build-select"><strong>Select Build:</strong></label>
          <select 
            id="build-select"
            value={selectedBuild?.id || ''} 
            onChange={(e) => {
              const build = availableBuilds.find(b => b.id === e.target.value);
              setSelectedBuild(build || null);
            }}
            className="build-selector"
          >
            <option value="">Choose a build to preview...</option>
            {availableBuilds
              .filter(build => build.validation.isValid)
              .map(build => (
                <option key={build.id} value={build.id}>
                  {build.name || build.id} {build.validation.warnings.length > 0 ? '⚠️' : ''}
                </option>
              ))}
          </select>
          
          {selectedBuild && selectedBuild.validation.warnings.length > 0 && (
            <div className="build-warnings">
              <AlertCircle size={16} />
              <span>Warnings: {selectedBuild.validation.warnings.join(', ')}</span>
            </div>
          )}
          
          {selectedBuild && (
            <div className="build-info">
              <code>{selectedBuild.path}</code>
            </div>
          )}
        </div>
      ) : (
        <div className="no-builds">
          <AlertCircle size={20} />
          <span>No valid builds found. Build an app first with <code>build &lt;IDEA_NAME&gt;</code></span>
        </div>
      )}
      
      <div className="preview-controls">
        {!session || session.status === 'stopped' || session.status === 'error' ? (
          <button 
            className="preview-button start"
            onClick={startPreview}
            disabled={isLoading || !selectedBuild}
          >
            {isLoading ? <Loader className="spin" size={16} /> : <Play size={16} />}
            Launch Live Preview
          </button>
        ) : (
          <button 
            className="preview-button stop"
            onClick={stopPreview}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="spin" size={16} /> : <Square size={16} />}
            Stop Preview
          </button>
        )}
      </div>

      {error && (
        <div className="preview-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {session && (
        <div className="preview-session">
          <div className="session-status">
            <strong>Status:</strong> 
            <span className={`status-badge ${session.status}`}>
              {session.status === 'starting' && <Loader className="spin" size={14} />}
              {session.status}
            </span>
          </div>

          {session.status === 'error' && session.error && (
            <div className="preview-error">
              <AlertCircle size={20} />
              <span>{session.error}</span>
            </div>
          )}

          {session.status === 'running' && session.urls.lanUrl && (
            <div className="preview-content">
              {qrCode && (
                <div className="qr-section">
                  <img src={qrCode} alt="QR Code for mobile preview" className="qr-code" />
                  <p>Scan with Expo Dev Client</p>
                </div>
              )}
              
              <div className="preview-links">
                {session.urls.lanUrl && (
                  <div className="link-item">
                    <span>Mobile URL:</span>
                    <div className="link-actions">
                      <code className="url-display">{session.urls.lanUrl}</code>
                      <button 
                        className="link-button"
                        onClick={() => copyToClipboard(session.urls.lanUrl!)}
                        title="Copy link"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                )}
                
                {session.urls.devtools && (
                  <div className="link-item">
                    <span>DevTools:</span>
                    <div className="link-actions">
                      <code className="url-display">{session.urls.devtools}</code>
                      <button 
                        className="link-button"
                        onClick={() => openUrl(session.urls.devtools!)}
                        title="Open DevTools"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        className="link-button"
                        onClick={() => copyToClipboard(session.urls.devtools!)}
                        title="Copy link"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {session.urls.metro && (
                  <div className="link-item">
                    <span>Metro:</span>
                    <div className="link-actions">
                      <code className="url-display">{session.urls.metro}</code>
                      <button 
                        className="link-button"
                        onClick={() => openUrl(session.urls.metro!)}
                        title="Open Metro"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="session-info">
            <p><strong>Build Path:</strong> <code>{session.buildPath}</code></p>
            <p><strong>Mode:</strong> {session.mode}</p>
            <p><strong>Started:</strong> {new Date(session.startedAt).toLocaleTimeString()}</p>
            {selectedBuild && (
              <p><strong>Build Name:</strong> {selectedBuild.name || selectedBuild.id}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePreview;