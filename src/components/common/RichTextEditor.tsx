'use client';

import React, { useRef, useEffect } from 'react';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
} from '@ant-design/icons';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  // Sync value from prop to editor only when it changes externally
  useEffect(() => {
    if (editorRef.current) {
      if (isFirstMount.current) {
        editorRef.current.innerHTML = value || '';
        isFirstMount.current = false;
      } else if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const addLink = () => {
    const url = prompt('Nhập địa chỉ liên kết (URL):');
    if (url) {
      // Ensure url starts with http/https
      const formattedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      execCommand('createLink', formattedUrl);
    }
  };

  return (
    <div className="border border-border-gray bg-white w-full flex flex-col font-sans text-xs transition-all duration-300 focus-within:border-primaryGold">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-zinc-50 border-b border-border-gray select-none">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1.5 text-xs hover:bg-zinc-200 text-charcoal rounded cursor-pointer transition-colors"
          title="In đậm (Bold)"
        >
          <BoldOutlined />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1.5 text-xs hover:bg-zinc-200 text-charcoal rounded cursor-pointer transition-colors"
          title="In nghiêng (Italic)"
        >
          <ItalicOutlined />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-1.5 text-xs hover:bg-zinc-200 text-charcoal rounded cursor-pointer transition-colors"
          title="Gạch chân (Underline)"
        >
          <UnderlineOutlined />
        </button>
        <div className="w-[1px] h-5 bg-border-gray mx-1 align-middle self-center" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1.5 text-xs hover:bg-zinc-200 text-charcoal rounded cursor-pointer transition-colors"
          title="Danh sách không thứ tự"
        >
          <UnorderedListOutlined />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-1.5 text-xs hover:bg-zinc-200 text-charcoal rounded cursor-pointer transition-colors"
          title="Danh sách có thứ tự"
        >
          <OrderedListOutlined />
        </button>
        <button
          type="button"
          onClick={addLink}
          className="p-1.5 text-xs hover:bg-zinc-200 text-charcoal rounded cursor-pointer transition-colors"
          title="Thêm liên kết"
        >
          <LinkOutlined />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-3 min-h-[220px] outline-none text-xs text-charcoal font-light leading-relaxed prose prose-sm max-w-none bg-white overflow-y-auto"
        style={{ minHeight: '220px' }}
      />
    </div>
  );
}
