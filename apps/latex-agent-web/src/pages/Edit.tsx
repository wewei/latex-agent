import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin } from 'antd';
import Editor from '@monaco-editor/react';

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
        <Title level={3} style={{ margin: "0 16px 16px 16px" }}>
          Editing Document: {documentId}
        </Title>

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
          <div
            style={{ display: "flex", gap: 16, padding: "0 16px", flexGrow: 1 }}
          >
            <div
              style={{ flex: 1, border: "1px solid #f0f0f0", borderRadius: 4 }}
            >
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
            <div
              style={{
                flex: 1,
                border: "1px solid #f0f0f0",
                borderRadius: 4,
                padding: 16,
                overflow: "auto",
              }}
            >
              <Title level={4}>Preview</Title>
              <div>Preview will be rendered here</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EditPage; 