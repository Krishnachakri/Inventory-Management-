import React, { useRef } from 'react';
import './ImportExportButtons.css';

function ImportExportButtons({ onImport, onExport }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className="import-export-buttons">
      <button className="btn btn-secondary" onClick={handleImportClick}>
        📥 Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button className="btn btn-secondary" onClick={onExport}>
        📤 Export
      </button>
    </div>
  );
}

export default ImportExportButtons;


