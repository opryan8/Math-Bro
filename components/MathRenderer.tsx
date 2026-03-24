import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathRendererProps {
  content: string;
  isDark: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, isDark }) => {
  return (
    <div className={`markdown-body ${isDark ? 'text-slate-100' : 'text-slate-800'} text-sm md:text-base leading-relaxed overflow-x-auto`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-md font-bold mb-1 mt-2">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 ml-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 ml-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          code: ({ children }) => <code className={`${isDark ? 'bg-slate-700' : 'bg-slate-100'} px-1 py-0.5 rounded text-sm font-mono`}>{children}</code>,
          pre: ({ children }) => <pre className={`${isDark ? 'bg-slate-900' : 'bg-slate-100'} p-3 rounded-lg overflow-x-auto mb-3 text-sm`}>{children}</pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MathRenderer;