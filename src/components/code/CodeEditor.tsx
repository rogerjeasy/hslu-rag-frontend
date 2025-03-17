'use client';

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { markdown } from '@codemirror/lang-markdown';

interface CodeEditorProps {
  initialValue?: string;
  language?: 'python' | 'sql' | 'r' | 'markdown';
  readOnly?: boolean;
  onChange?: (value: string) => void;
  height?: string;
}

export default function CodeEditor({
  initialValue = '',
  language = 'python',
  readOnly = false,
  onChange,
  height = '300px',
}: CodeEditorProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (val: string) => {
    setValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  const getLanguageExtension = () => {
    switch (language) {
      case 'python':
        return python();
      case 'sql':
        return sql();
      case 'markdown':
        return markdown();
      default:
        return python();
    }
  };

  return (
    <div className="border rounded-md overflow-hidden" style={{ height }}>
      <CodeMirror
        value={value}
        height={height}
        extensions={[getLanguageExtension()]}
        onChange={handleChange}
        readOnly={readOnly}
        theme="dark"
        className="text-sm"
      />
    </div>
  );
}