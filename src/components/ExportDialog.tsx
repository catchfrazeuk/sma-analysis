import React, { useState } from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/ExportDialog.css';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
  const { exportAudio } = useAudioStore();
  const [filename, setFilename] = useState('audio_processed');
  const [format, setFormat] = useState<'wav' | 'mp3'>('wav');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!filename.trim()) return;
    setIsExporting(true);

    try {
      await exportAudio(`${filename}.${format}`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="export-dialog-overlay">
      <div className="export-dialog">
        <h2>EXPORT AUDIO</h2>
        <div className="dialog-content">
          <div className="form-group">
            <label>Filename:</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="audio_processed"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'wav' | 'mp3')}
              className="form-select"
            >
              <option value="wav">WAV (Lossless)</option>
              <option value="mp3">MP3 (Compressed)</option>
            </select>
          </div>
          <div className="dialog-actions">
            <button
              className="btn-cancel"
              onClick={onClose}
              disabled={isExporting}
            >
              CANCEL
            </button>
            <button
              className="btn-export"
              onClick={handleExport}
              disabled={isExporting || !filename.trim()}
            >
              {isExporting ? 'EXPORTING...' : 'EXPORT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
