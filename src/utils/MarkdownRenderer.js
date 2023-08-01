import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ boxClass, content }) => {

  return (
    <ReactMarkdown
      className={boxClass}
      remarkPlugins={[remarkGfm]} // Allows us to have embedded HTML tags in our markdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
              wrapLines={true} 
              language={match[1]}
              PreTag="pre"
              {...props}
              style={materialDark}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...props}>{children}</code>
          );
        }
      }}
      >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer

