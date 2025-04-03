import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditRp } from './EditRp';

type EditPageParams = {
  documentId: string;
};

const EditCt = () => {
  const { documentId } = useParams<EditPageParams>();
  const [latexContent, setLatexContent] = useState<string>('');

  useEffect(() => {
    const loadDocument = async () => {
      try {
        // Replace this with actual API call
        const content = '\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}';
        setLatexContent(content);
      } catch (error) {
        console.error('Failed to load document:', error);
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
    <EditRp
      latexContent={latexContent}
      onEditorChange={handleEditorChange}
    />
  );
};

export default EditCt; 