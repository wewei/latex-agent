import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, SaveOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import SplitView from '../components/SplitView';

const { Title } = Typography;

type EditPageParams = {
  documentId: string;
};

const EditPage: React.FC = () => {
  const { documentId } = useParams<EditPageParams>();
  const [latexContent, setLatexContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading document content
    const loadDocument = async () => {
      try {
        // Replace with actual API call
        setTimeout(() => {
          setLatexContent('\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}');
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to load document:', error);
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLatexContent(value);
      // TODO: Implement auto-save functionality
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving document:', documentId);
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
      padding: 16,
      overflow: 'auto'
    }}>
      <Title level={4}>Preview</Title>
      <div>Preview will be rendered here</div>
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
          <Title level={4} style={{ margin: 0 }}>Document: {documentId}</Title>
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

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100% - 60px)",
              flexGrow: 1,
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
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
        )}
      </Card>
    </div>
  );
};

export default EditPage; 