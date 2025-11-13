import React, { useState } from 'react'

const MessageText = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200; // characters before showing "Read more"

  if (!content) return null;

  if (content.length <= maxLength) {
    return <p className="mt-1 whitespace-pre-wrap break-words">{content}</p>;
  }

  return (
    <div className="mt-1">
      <p className="whitespace-pre-wrap break-words">
        {isExpanded ? content : `${content.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-black text-xs mt-1 hover:underline focus:outline-none"
      >
        {isExpanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
};

export default MessageText
