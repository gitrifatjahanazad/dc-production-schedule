import React, { useState, useEffect } from "react";
const { REACT_APP_API_BASE_URL } = process.env;

function DownloadFiles() {
  const [files, setFiles] = useState([]);

  const downloadFolder = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/get-files`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Error downloading folder:", error);
    }
  };

  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = `${REACT_APP_API_BASE_URL}/outputDirectory/${fileName}`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  useEffect(() => {
    downloadFolder();
  }, []); // Fetch files when the component mounts

  return (
    <div>
      <h1>File List</h1>
      {files.map((file, index) => (
        <div key={index}>
          <a
            href={file.url}
            onClick={(e) => {
              e.preventDefault();
              downloadFile(file.url, file.name);
            }}
          >
            Download {file.name}
          </a>
        </div>
      ))}
    </div>
  );
}

export default DownloadFiles;
