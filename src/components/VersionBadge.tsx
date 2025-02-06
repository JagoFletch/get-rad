import React, { useState, useEffect } from 'react';
import './VersionBadge.css';

interface VersionBadgeProps {
  version: string;
}

const VersionBadge: React.FC<VersionBadgeProps> = ({ version }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changelog, setChangelog] = useState<string>('');

  useEffect(() => {
    // Fetch and parse CHANGELOG.md when component mounts
    fetch('/CHANGELOG.md')
      .then(response => response.text())
      .then(text => setChangelog(text))
      .catch(error => console.error('Error loading changelog:', error));
  }, []);

  return (
    <>
      <div 
        className="version-badge"
        onClick={() => setIsModalOpen(true)}
      >
        v{version}
      </div>

      {isModalOpen && (
        <>
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)} />
          <div className="changelog-modal">
            <button 
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2>Changelog</h2>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {changelog || 'Loading changelog...'}
            </pre>
          </div>
        </>
      )}
    </>
  );
};

export default VersionBadge;
