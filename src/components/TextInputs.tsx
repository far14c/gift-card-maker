import React from 'react';

interface TextInputsProps {
  dearText: string;
  messageText: string;
  fromText: string;
  onDearChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onFromChange: (value: string) => void;
}

export const TextInputs: React.FC<TextInputsProps> = ({
  dearText,
  messageText,
  fromText,
  onDearChange,
  onMessageChange,
  onFromChange
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Personalize Your Message</h2>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="dear-input" className="text-sm font-medium text-gray-700">
          Dear
        </label>
        <input
          id="dear-input"
          type="text"
          value={dearText}
          onChange={(e) => onDearChange(e.target.value)}
          placeholder="Recipient's name"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
          maxLength={13}
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="message-input" className="text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message-input"
          value={messageText}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Write your heartfelt message here"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none"
          rows={2}
          maxLength={44}
        />
        <p className="text-xs text-gray-500 text-right">
          {messageText.length}/44 characters
        </p>
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="from-input" className="text-sm font-medium text-gray-700">
          From
        </label>
        <input
          id="from-input"
          type="text"
          value={fromText}
          onChange={(e) => onFromChange(e.target.value)}
          placeholder="Your name"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
          maxLength={14}
        />
      </div>
    </div>
  );
};