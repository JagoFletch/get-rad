import React, { useState, useEffect } from 'react';
import './VersionBadge.css';

interface VersionBadgeProps {
  version: string;
}

const VersionBadge: React.FC<VersionBadgeProps> = ({ version }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changelog, setChangelog] = useState<string>('');

  useEffect(() => {
    fetch('/CHANGELOG.md')
      .then(response => response.text())
      .then(text => setChangelog(text))
      .catch(error => console.error('Error loading changelog:', error));
  }, []);

  const handleVersionUpdate = async (type: 'patch' | 'minor' | 'major') => {
    try {
      let commitMessage = '';
      switch (type) {
        case 'patch':
          commitMessage = 'fix: patch update';
          break;
        case 'minor':
          commitMessage = 'feat: minor update';
          break;
        case 'major':
          commitMessage = 'feat: major update\n\nBREAKING CHANGE: major version update';
          break;
      }

      const response = await fetch('/api/version-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          message: commitMessage
        }),
      });

      if (!response.ok) {
        throw new Error('Version update failed');
      }

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating version:', error);
      alert('Failed to update version. Please try again.');
    }
  };

  return (
    <>
      <div className="version-controls">
        <button 
          className="version-button patch" 
          onClick={() => handleVersionUpdate('patch')}
          title="Patch Version (0.0.x)"
        >
          Patch
        </button>
        <button 
          className="version-button minor" 
          onClick={() => handleVersionUpdate('minor')}
          title="Minor Version (0.x.0)"
        >
          Minor
        </button>
        <button 
          className="version-button major" 
          onClick={() => handleVersionUpdate('major')}
          title="Major Version (x.0.0)"
        >
          Major
        </button>
        <button 
          className="version-button"
          onClick={() => setIsModalOpen(true)}
        >
          v{version}
        </button>
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
