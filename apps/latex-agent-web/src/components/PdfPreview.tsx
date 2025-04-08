import React, { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Spin, Button, Space, Typography } from 'antd';
import { 
  LeftOutlined, 
  RightOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';

// Set up the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type PdfPreviewProps = {
  pdfData: ArrayBuffer;
  className?: string;
  style?: React.CSSProperties;
};

const PdfPreview: React.FC<PdfPreviewProps> = ({
  pdfData,
  className = '',
  style = {},
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Create a unique key for the Document component based on the PDF data
  const pdfKey = useMemo(() => {
    // Create a hash of the first few bytes of the PDF data to use as a key
    const dataView = new DataView(pdfData.slice(0, 16));
    let hash = 0;
    for (let i = 0; i < 16; i += 4) {
      hash = ((hash << 5) - hash) + dataView.getInt32(i, true);
      hash = hash & hash; // Convert to 32bit integer
    }
    return `pdf-${hash}`;
  }, [pdfData]);

  console.log(pdfKey);

  // Convert ArrayBuffer to Uint8Array for react-pdf
  const pdfFile = useMemo(() => new Uint8Array(pdfData), [pdfData]);

  // Reset state when PDF data changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setPageNumber(1);
    setNumPages(null);
  }, [pdfKey]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => Math.min(prevPage + 1, numPages || 1));
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`pdf-preview ${className}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        ...style 
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '8px 16px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
      }}>
        <Space>
          <Button 
            icon={<LeftOutlined />} 
            onClick={goToPrevPage} 
            disabled={pageNumber <= 1}
            size="small"
          />
          <Typography.Text>
            Page {pageNumber} of {numPages || '--'}
          </Typography.Text>
          <Button 
            icon={<RightOutlined />} 
            onClick={goToNextPage} 
            disabled={pageNumber >= (numPages || 1)}
            size="small"
          />
        </Space>
        <Space>
          <Button 
            icon={<ZoomOutOutlined />} 
            onClick={zoomOut} 
            disabled={scale <= 0.5}
            size="small"
          />
          <Typography.Text>
            {Math.round(scale * 100)}%
          </Typography.Text>
          <Button 
            icon={<ZoomInOutlined />} 
            onClick={zoomIn} 
            disabled={scale >= 2.0}
            size="small"
          />
          <Button 
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
            onClick={toggleFullscreen}
            size="small"
          />
        </Space>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        display: 'flex', 
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: '#f5f5f5'
      }}>
        {loading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%'
          }}>
            <Spin size="large" tip="Loading PDF..." />
          </div>
        )}
        
        {error && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            color: '#ff4d4f'
          }}>
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <Document
            key={pdfKey}
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%'
              }}>
                <Spin size="large" tip="Loading PDF..." />
              </div>
            }
            error={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%',
                color: '#ff4d4f'
              }}>
                Failed to load PDF
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PdfPreview; 