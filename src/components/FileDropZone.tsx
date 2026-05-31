import React, { useRef } from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/FileDropZone.css';

interface FileDropZoneProps {
  onFileLoaded: () => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileLoaded }) => {
  const { loadAudioFile } = useAudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    try {
      await loadAudioFile(file);
      onFileLoaded();
    } catch (error) {
      console.error('Failed to load audio file:', error);
      alert('Failed to load audio file. Please try another file.');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  return (
    <div
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
      <div className="drop-zone-content">
        <svg className="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <h2>DROP AUDIO FILES HERE</h2>
        <button className="browse-btn" onClick={handleBrowseClick}>
          BROWSE FILES
        </button>
        <p className="supported-formats">Supported: MP3, WAV, AAC, OGG, FLAC</p>
      </div>
    </div>
  );
};

export default FileDropZone;
