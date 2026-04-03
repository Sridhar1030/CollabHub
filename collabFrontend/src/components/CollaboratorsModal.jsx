import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function CollaboratorsModal({ isOpen, onClose, collaborators }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 w-full max-w-md relative animate-modal shadow-[0_16px_32px_rgba(1,4,9,0.85)]"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-[#58a6ff]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-[#e6edf3]">Repository Collaborators</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#7d8590] hover:text-[#e6edf3] transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {collaborators.map((collaborator, index) => {
            const username = collaborator.split(' <')[0];
            const email = collaborator.match(/<(.+)>/)?.[1] || '';

            return (
              <div
                key={index}
                className="bg-[#21262d] border border-[#30363d] rounded-md p-4 text-[#7d8590] hover:bg-[#161b22] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#161b22] border border-[#30363d] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-medium">
                      {username[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-[#e6edf3] text-lg truncate">
                      {username || 'Unknown User'}
                    </div>
                    <div className="text-sm text-[#7d8590] truncate">{email}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {collaborators.length === 0 && (
            <div className="text-center py-8 text-[#7d8590]">
              No collaborators found
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#21262d] border border-[#30363d] text-[#e6edf3] rounded-md hover:bg-[#30363d] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}