import { useState, useEffect } from "react";
import "./FilePathManagement.css";

export const FilePathManagement = () => {
  // Incoming files shown to Admin with a Send button
  const [incomingFiles, setIncomingFiles] = useState([]); // {name, size, modified}
  const [sendStatus, setSendStatus] = useState({}); // { [fileName]: 'idle'|'sending'|'success'|'error:msg' }
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const fetchIncoming = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/routing/incoming");
      const data = await res.json();
      setIncomingFiles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch incoming files:", e);
    }
  };

  useEffect(() => {
    fetchIncoming();
    const interval = setInterval(fetchIncoming, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendFile = async (fileName) => {
    setSendStatus((prev) => ({ ...prev, [fileName]: "sending" }));
    try {
      const res = await fetch(`http://localhost:8080/api/routing/route-one?fileName=${encodeURIComponent(fileName)}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data && data.routed) {
        setSendStatus((prev) => ({ ...prev, [fileName]: "success" }));
        setNotification(`File ${fileName} sent successfully!`);
      } else {
        const reason = data?.reason || "Unknown error";
        setSendStatus((prev) => ({ ...prev, [fileName]: `error:${reason}` }));
        setNotification(`Failed to send ${fileName}: ${reason}`);
      }
    } catch (err) {
      setSendStatus((prev) => ({ ...prev, [fileName]: `error:${err.message}` }));
      setNotification(`Error sending ${fileName}: ${err.message}`);
    }
    setTimeout(() => setNotification(""), 3000);
  };

  const filtered = incomingFiles.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="fpm-container">
      {notification && (
        <div className="fpm-notification">{notification}</div>
      )}

      <div className="fpm-header">
        <div>
          <h1 className="fpm-title">Incoming Files</h1>
          <p className="fpm-subtitle">Review and send files to their destinations</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search files..."
        className="fpm-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="fpm-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Size</th>
            <th>Modified</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan="5" className="fpm-no-data">
                No incoming files found
              </td>
            </tr>
          ) : (
            paged.map((file) => {
              const status = sendStatus[file.name] || "idle";
              const isSending = status === "sending";
              const isSuccess = status === "success";
              const isError = status.startsWith("error:");
              return (
                <tr key={file.name}>
                  <td className="fpm-bold">{file.name}</td>
                  <td>{file.size || "N/A"}</td>
                  <td>{file.modified ? new Date(file.modified).toLocaleString() : "N/A"}</td>
                  <td>
                    {isSuccess && <span className="fpm-badge active">Sent</span>}
                    {isError && <span className="fpm-badge inactive">Failed</span>}
                    {isSending && <span className="fpm-badge">Sending...</span>}
                    {!isSending && !isSuccess && !isError && <span className="fpm-badge">Pending</span>}
                  </td>
                  <td>
                    <button
                      className={`fpm-btn-primary ${isSuccess ? "fpm-btn-success" : ""}`}
                      onClick={() => sendFile(file.name)}
                      disabled={isSending || isSuccess}
                    >
                      {isSuccess ? "Sent ✓" : isSending ? "Sending..." : "Send"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="fpm-pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};