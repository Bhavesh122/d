import React, { useEffect, useState } from 'react';
import './PDFViewer.css';

export default function PDFViewer({
  displayName = 'Report',
  presignedUrl,
  onBack
}) {
  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setIframeError(null);
    // Small delay to let iframe mount
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [presignedUrl]);

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <h2 className="pdf-viewer-title">{displayName}</h2>
        {presignedUrl && (
          <a
            className="btn btn-outline-primary"
            href={presignedUrl}
            target="_blank"
            rel="noreferrer"
            title="Open PDF in new tab"
          >
            Open in new tab
          </a>
        )}
      </div>

      {!presignedUrl && (
        <div className="pdf-viewer-empty">
          No PDF URL provided. Please go back and choose a report.
        </div>
      )}

      {presignedUrl && (
        <div className="pdf-viewer-frame-wrap">
          {loading && (
            <div className="pdf-viewer-loading">
              Loading preview…
            </div>
          )}

          {iframeError && (
            <div className="pdf-viewer-error">
              Could not display inside the app. Use "Open in new tab" above.
            </div>
          )}

          {!iframeError && (
            <iframe
              key={presignedUrl}
              src={presignedUrl}
              title={displayName}
              className="pdf-viewer-iframe"
              onError={() => setIframeError('failed')}
            />
          )}
        </div>
      )}
    </div>
  );
}

