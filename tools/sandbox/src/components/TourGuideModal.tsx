import { useEffect, useRef } from 'react';
import './TourGuideModal.css';
import Viewer from './Viewer';

interface TourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function TourGuideModal({ isOpen, onClose }: TourGuideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="companion-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="companion-frame">
        {/* Just the model, nothing else */}
        <Viewer />

        {/* Tiny close button in corner */}
        <button
          className="companion-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default TourGuideModal;
