import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split by newlines
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-700">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // 1. Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-emerald-700 font-bold text-sm mt-3 mb-1 flex items-center gap-1.5">
              <span className="text-[8px] text-emerald-500">◆</span>
              {parseInline(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-emerald-800 font-bold text-base mt-4 mb-2 flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-600">◆</span>
              {parseInline(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-emerald-900 font-extrabold text-lg mt-5 mb-3">
              {parseInline(trimmed.slice(2))}
            </h2>
          );
        }

        // 2. Bullet Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="pl-5 flex items-start gap-2 text-slate-600">
              <span className="text-emerald-600 mt-1.5 text-[8px]">•</span>
              <span className="flex-1">{parseInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        // 3. Numbered Lists
        const matchNum = trimmed.match(/^(\d+)\.\s(.*)/);
        if (matchNum) {
          return (
            <div key={idx} className="pl-5 flex items-start gap-2 text-slate-600">
              <span className="text-emerald-700 font-bold text-xs mt-0.5">{matchNum[1]}.</span>
              <span className="flex-1">{parseInline(matchNum[2])}</span>
            </div>
          );
        }

        // 4. Default paragraph
        return (
          <p key={idx} className="text-slate-655 leading-relaxed text-slate-600">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-100">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
