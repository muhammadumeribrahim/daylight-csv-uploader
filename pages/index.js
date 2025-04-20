// The Imports
import { useState } from 'react';
import Papa from 'papaparse';

// The Component
export default function Home() {
  // 🔹 State Setup
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // The File Upload Handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      setError('Only CSV files are allowed.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file.');
        } else {
          setData(results.data);
          setHeaders(Object.keys(results.data[0] || {}));
          setError('');
          setHasChanges(false); 
        }
      },
    });
  };

  // The Cell Edit Handler
  const handleEdit = (rowIndex, key, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][key] = value;
    setData(updatedData);
    setHasChanges(true);
  };

  // The Download Edited CSV Handler
  const handleDownloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // The UI Rendering
  return (
    <div className="container">
      <h1 className="title">Upload Patient Data</h1>
      <p className="subtitle">
        Easily upload a <strong>.csv</strong> file containing patient details. Accepted fields include:
        <code> id, first_name, last_name, email, phone </code>. You can edit entries after uploading.
      </p>

      <div className="upload-section">
        <label htmlFor="csvInput" className="upload-label">Select your CSV file</label>
        <input type="file" accept=".csv" onChange={handleFileUpload} id="csvInput" />
        <small className="helper-text">Only .csv files are supported</small>
      </div>

      {error && <div className="error-message">{error}</div>}

      {data.length > 0 && (
        <>
          <div className="success-message">✅ Data loaded successfully!</div>

          <div className="table-wrapper">
            <table className="csv-table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex}>
                        <input
                          value={row[header]}
                          onChange={(e) => handleEdit(rowIndex, header, e.target.value)}
                          className="edit-input"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="sync-button" onClick={() => alert('Ready for CRM sync!')}>
            Prepare for CRM Sync
          </button>

          {hasChanges && (
            <p className="download-reminder">
              You’ve made changes. Click the button below to download your updated file.
            </p>
          )}

          <button className="download-button" onClick={handleDownloadCSV}>
            Download Edited CSV
          </button>
        </>
      )}
    </div>
  );
}
