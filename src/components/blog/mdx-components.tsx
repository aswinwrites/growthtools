import React from "react";
import Link from "next/link";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;
type TableProps = React.HTMLAttributes<HTMLTableElement>;

export const mdxComponents = {
  h1: ({ children, ...props }: HeadingProps) => (
    <h1
      className="text-3xl font-bold text-gray-900 mt-10 mb-4 leading-tight"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: HeadingProps) => (
    <h2
      id={id}
      className="text-2xl font-bold text-gray-900 mt-10 mb-4 leading-snug scroll-mt-20"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: HeadingProps) => (
    <h3
      id={id}
      className="text-xl font-semibold text-gray-900 mt-8 mb-3 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: HeadingProps) => (
    <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: ParagraphProps) => (
    <p className="text-gray-700 leading-relaxed mb-5 text-[17px]" {...props}>
      {children}
    </p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-outside pl-6 mb-5 space-y-2 text-gray-700 text-[17px]">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-outside pl-6 mb-5 space-y-2 text-gray-700 text-[17px]">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-5 pr-4 py-3 my-6 rounded-r-lg text-gray-700 italic text-[17px]">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    // Block code (has a language class)
    if (className) {
      return (
        <code className={`${className} block bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto`}>
          {children}
        </code>
      );
    }
    // Inline code
    return (
      <code className="bg-gray-100 text-blue-700 rounded px-1.5 py-0.5 text-[15px] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto text-sm">
      {children}
    </pre>
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
        {...props}
      >
        {children}
      </Link>
    );
  },
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="italic text-gray-700">{children}</em>
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
  table: ({ children, ...props }: TableProps) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-gray-100">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-4 py-3 font-semibold text-gray-700 text-xs uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-4 py-3 text-gray-700">{children}</td>
  ),
};
