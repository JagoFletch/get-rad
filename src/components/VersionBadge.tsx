import React, { useState, useEffect } from 'react';
import { createCommit } from '../utils/github';
import './VersionBadge.css';

interface VersionBadgeProps {
  version: string;
}

const VersionBadge: React.FC<VersionBadgeProps> = ({ version }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changelog, setChangelog] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetch('/CHANGELOG.md')
      .then(response => response.text())
      .then(text => setChangelog(text))
      .catch(error => console.error('Error loading changelog:', error));
  }, []);

  const handleVersionUpdate = async (type: 'patch' | 'minor' | 'major') => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
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

      await createCommit(type, commitMessage);
      alert(`${type} version update initiated. Changes will be reflected shortly.`);
    } catch (error) {
      console.error('Error updating version:', error);
      alert('Failed to update version. Please check console for details.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="version-controls">
        <button 
          className={`version-button patch ${isUpdating ? 'disabled' : ''}`}
          onClick={() => handleVersionUpdate('patch')}
          title="Patch Version (0.0.x)"
          disabled={isUpdating}
        >
          Patch
        </button>
        <button 
          className={`version-button minor ${isUpdating ? 'disabled' : ''}`}
          onClick={() => handleVersionUpdate('minor')}
          title="Minor Version (0.x.0)"
          disabled={isUpdating}
        >
          Minor
        </button>
        <button 
          className={`version-button major ${isUpdating ? 'disabled' : ''}`}
          onClick={() => handleVersionUpdate('major')}
          title="Major Version (x.0.0)"
          disabled={isUpdating}
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
