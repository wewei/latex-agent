import React from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { SplitContainer } from '../../components/SplitContainer';

import * as monaco from 'monaco-editor';

loader.config({ monaco });

type EditRpProps = {
  latexContent: string;
  onEditorChange: (value: string | undefined) => void;
};

export const EditRp = ({ latexContent, onEditorChange }: EditRpProps) => {
  const editorContent = (
    <Editor
      height="100%"
      defaultLanguage="latex"
      value={latexContent}
      onChange={onEditorChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
      }}
      beforeMount={(monaco) => {
        // Configure Monaco to use local version
        monaco.editor.defineTheme('vs-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {},
        });
      }}
      loading={<div>Loading editor...</div>}
      path="monaco-editor"
      onMount={(editor, monaco) => {
        // Ensure we're using local Monaco
        console.log('Monaco Editor mounted with local version');
      }}
    />
  );

  const previewContent = (
    <div>Preview will be rendered here</div>
  );

  return (
    <SplitContainer
      leftContent={editorContent}
      rightContent={previewContent}
    />
  );
}; 