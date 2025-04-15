import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, Button, Space, Tooltip } from 'antd';
import { SaveOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import SplitView from '../components/SplitView';
import PdfPreview from '../components/PdfPreview';
import { makeElectronLatexApi, makeHttpLatexApi } from 'latex-agent-api';
import { documentService } from '../services/api';

const { Title } = Typography;

type EditPageParams = {
  documentId: string;
};

const EditPage: React.FC = () => {
  const { documentId } = useParams<EditPageParams>();
  const [latexContent, setLatexContent] = useState<string>('');
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading document content
    const loadDocument = async () => {
      try {
        if (!documentId) {
          return;
        }

        documentService.getContent(documentId).then((document) => {
          setLatexContent(document.content);
        });
      } catch (error) {
        console.error('Failed to load document:', error);
      }
    };

    loadDocument();
  }, [documentId]);

  useEffect(() => {
    console.log('PDF Data:', pdfData);
  }, [pdfData]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLatexContent(value);
      // TODO: Implement auto-save functionality
    }
  };

  const handleSave = async () => {
    if (!documentId) {
      return;
    }

    documentService.update(documentId, { content: latexContent }).then(() => {
      console.log('Document saved successfully!');
    }).catch(() => {
      console.error('Failed to save document:');
    });
  };

  // Generate PDF when LaTeX content changes
  useEffect(() => {
    const generatePdfData = async () => {
      if (latexContent) {
        const api = makeHttpLatexApi('http://localhost:3000/latex/api/v1/latex/convert');
        if (api) {
          const data = await api.generatePdf(latexContent);
          setPdfData(data);
          // setPreviewLoading(false);
        }
      }
    };
    generatePdfData();
  }, [latexContent]);

  const handleGoBack = () => {
    navigate('/main');
  };

  const renderEditor = () => (
    <div style={{ height: '100%', border: '1px solid #f0f0f0', borderRadius: 4 }}>
      <Editor
        height="100%"
        defaultLanguage="latex"
        value={latexContent}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
        }}
      />
    </div>
  );

  const renderPreview = () => (
    <div style={{
      height: '100%',
      border: '1px solid #f0f0f0',
      borderRadius: 4,
      overflow: 'hidden'
    }}>
      {
        pdfData ? (
          <PdfPreview pdfData={pdfData} />
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#8c8c8c'
          }}>
            <Typography.Text>Preview will appear here</Typography.Text>
          </div>
        )}
    </div>
  );

  return (
    <div
      style={{
        height: "calc(100vh - 120px)",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card
        style={{
          height: "100%",
          padding: "16px 0 0 0",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
        styles={{
          body: { flexGrow: 1, display: "flex", flexDirection: "column" },
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px 16px 16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Back to Main">
              <Button
                type="text"
                icon={<HomeOutlined />}
                onClick={handleGoBack}
                style={{ marginRight: 12 }}
              />
            </Tooltip>
            <Title level={4} style={{ margin: 0 }}>Document: {documentId}</Title>
          </div>
          <Space>
            <Tooltip title="Save Document">
              <Button
                icon={<SaveOutlined />}
                onClick={handleSave}
                type="primary"
              >
                Save
              </Button>
            </Tooltip>
          </Space>
        </div>

        <div style={{ flexGrow: 1, padding: "0 16px" }}>
          <SplitView
            left={renderEditor()}
            right={renderPreview()}
            defaultMode="split"
            defaultRatio={0.6}
            storageKey={`latex-editor-split-${documentId}`}
            minRatio={0.3}
            maxRatio={0.8}
          />
        </div>

      </Card>
    </div>
  );
};

export default EditPage;