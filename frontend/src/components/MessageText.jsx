import React, { useState } from 'react'

const MessageText = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200; // characters before showing "Read more"

  if (!content) return null;

  // urls
  const linkifyText = (text)=>{
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link underline hover:text-link-hover break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  }

  const displayText = isExpanded
    ? content
    : content.length > maxLength
    ? `${content.slice(0, maxLength)}...`
    : content;

  return (
    <div className="mt-1 whitespace-pre-wrap break-words">
      {linkifyText(displayText)}
      {content.length > maxLength && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-black text-xs ml-2 hover:underline focus:outline-none"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default MessageText
