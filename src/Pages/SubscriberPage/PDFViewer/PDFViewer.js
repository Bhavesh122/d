import React, { useState, useRef } from 'react';
import './PDFViewer.css';

const PDFViewer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFitWidth, setIsFitWidth] = useState(false);
    const pdfContainerRef = useRef(null);
    const totalPages = 5;

    // Mock PDF data
    const pdfData = {
        title: "Q3 2024 Financial Performance Report",
        fileName: "Q3_2024_Financial_Report.pdf",
        user: "MOHAN KISHORE",
        date: "2025-01-07"
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleZoomChange = (e) => {
        const newZoom = parseFloat(e.target.value);
        setZoomLevel(newZoom);
        setIsFitWidth(false); // Reset fit width when manually zooming
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            pdfContainerRef.current?.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    const handleFitWidth = () => {
        if (isFitWidth) {
            // Return to normal zoom
            setZoomLevel(1);
            setIsFitWidth(false);
        } else {
            // Fit to width
            setZoomLevel(1.2);
            setIsFitWidth(true);
        }
    };

    const handleDownload = () => {
        alert("Download functionality would be implemented here!");
    };

    return (
        <div 
            className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`} 
            ref={pdfContainerRef}
        >
            {/* Header */}
            <header className="viewer-header">
                <div className="header-title">
                    <h2> RW Tool - Report Viewer</h2>
                    <span className="report-title">{pdfData.fileName}</span>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => window.history.back()}
                        style={{ marginRight: '10px' }}
                    >
                         Back to Dashboard
                    </button>    
                    <button className="btn btn-primary" onClick={handleDownload}>
                         Download PDF
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleFullscreen}
                    >
                        {isFullscreen ? ' Exit Fullscreen' : ' Fullscreen'}
                    </button>
                </div>
            </header>

            {/* Navigation Controls */}
            <div className="navigation-controls">
                <div className="page-controls">
                    <button className="btn btn-secondary" onClick={handlePreviousPage}>
                         Previous
                    </button>
                    <div className="page-info">
                        Page {currentPage} of {totalPages}
                    </div>
                    <button className="btn btn-secondary" onClick={handleNextPage}>
                        Next 
                    </button>
                </div>

                <div className="zoom-controls">
                    <select 
                        className="zoom-select" 
                        value={zoomLevel} 
                        onChange={handleZoomChange}
                    >
                        <option value="0.5">50%</option>
                        <option value="0.75">75%</option>
                        <option value="1">100%</option>
                        <option value="1.25">125%</option>
                        <option value="1.5">150%</option>
                        <option value="2">200%</option>
                    </select>
                    <button 
                        className={`btn ${isFitWidth ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={handleFitWidth}
                    >
                        {isFitWidth ? 'Actual Size' : 'Fit Width'}
                    </button>
                </div>
            </div>

            {/* PDF Content Area */}
            <div className="pdf-content-area">
                <div 
                    className="pdf-document" 
                    style={{ 
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: 'top center' // Fix positioning issue
                    }}
                >
                    {/* Watermark Overlay */}
                    <div className="watermark-overlay">
                        CONFIDENTIAL - {pdfData.user} - {pdfData.date}
                    </div>

                    {/* PDF Content */}
                    <div className="pdf-content">
                        <div className="document-header">
                            <h1>{pdfData.title}</h1>
                            <p>Standard Chartered Bank - Internal Use Only</p>
                        </div>

                        <div className="section">
                            <h2>Executive Summary</h2>
                            <p>Q3 2024 showed strong financial performance with revenue growth of 15% year-over-year across all business segments. The bank demonstrated robust operational efficiency and improved customer satisfaction metrics.</p>
                        </div>

                        <div className="section">
                            <h2>Financial Highlights - Page {currentPage}</h2>
                            <p>Detailed financial analysis and performance metrics for Q3 2024.</p>

                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <div className="metric-value">$2.5B</div>
                                    <div className="metric-label">Total Revenue (+15% YoY)</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">$650M</div>
                                    <div className="metric-label">Net Profit (+22% YoY)</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">26%</div>
                                    <div className="metric-label">Operating Margin</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">+8%</div>
                                    <div className="metric-label">Customer Growth</div>
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <h2>Regional Performance</h2>
                            <p>All geographic regions showed positive growth momentum with Asia-Pacific leading the expansion at 18% revenue increase, followed by Europe at 12% and Americas at 9%.</p>
                        </div>

                        <div className="document-footer">
                            <p>Generated on: {pdfData.date} | Page {currentPage} of {totalPages} | Standard Chartered Bank Internal Document</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PDFViewer;

