import React from 'react';

interface GiftCardPreviewProps {
  backgroundImage: string;
  dearText: string;
  messageText: string;
  fromText: string;
}

export const GiftCardPreview: React.FC<GiftCardPreviewProps> = ({
  backgroundImage,
  dearText,
  messageText,
  fromText
}) => {
  // Function to split text naturally at punctuation or phrases
  const splitMessage = (text: string) => {
    if (!text) return ['', ''];

    // Trim and normalize spaces
    text = text.trim().replace(/\s+/g, ' ');

    // If text is short enough, keep it as one line
    if (text.length <= 30) return [text, ''];

    // Look for natural break points
    const punctuation = ['. ', '! ', '? ', '; '];
    const conjunctions = [' and ', ' but ', ' or ', ' nor ', ' yet ', ' so '];
    const breakPoints = [...punctuation, ...conjunctions];

    // Try to find a natural break point near the middle
    const middleIndex = Math.floor(text.length / 2);
    let bestBreakIndex = -1;
    let minDistanceToMiddle = text.length;

    breakPoints.forEach(point => {
      const index = text.indexOf(point);
      if (index !== -1) {
        const distanceToMiddle = Math.abs(index - middleIndex);
        if (distanceToMiddle < minDistanceToMiddle) {
          minDistanceToMiddle = distanceToMiddle;
          bestBreakIndex = index + point.length - 1;
        }
      }
    });

    // If no natural break point found, break at the last space before middle
    if (bestBreakIndex === -1) {
      const words = text.split(' ');
      let currentLength = 0;
      for (let i = 0; i < words.length; i++) {
        currentLength += words[i].length + 1;
        if (currentLength > text.length / 2) {
          bestBreakIndex = currentLength - words[i].length - 1;
          break;
        }
      }
    }

    // Ensure we don't exceed reasonable line lengths
    const maxLineLength = 22;
    const firstLine = text.slice(0, bestBreakIndex).trim();
    const secondLine = text.slice(bestBreakIndex).trim();

    if (firstLine.length > maxLineLength || secondLine.length > maxLineLength) {
      // If lines are too long, force split at maxLineLength
      return [
        text.slice(0, maxLineLength).trim()+'-',
        text.slice(maxLineLength, maxLineLength * 2).trim()
      ];
    }

    return [firstLine, secondLine];
  };

  const [firstLine, secondLine] = splitMessage(messageText);
  const isSingleLine = !secondLine;

  const textStyle = {
    color: 'rgba(0, 0, 0, 0.85)', // Black with 85% opacity
    textShadow: `
      -1px -1px 0 #fff,  
       1px -1px 0 #fff,
      -1px  1px 0 #fff,
       1px  1px 0 #fff,
      -1px  0   0 #fff,
       1px  0   0 #fff,
       0   -1px 0 #fff,
       0    1px 0 #fff
    `
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-gray-700">Preview</h2>
      
      <div 
        id="gift-card-preview"
        className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md transition-all duration-300"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 p-8 flex flex-col">
          {/* Dear section */}
          <div className="absolute top-[29.5%] left-[30%] right-[23%]">
            <div className="absolute left-[30%] right-[0%]">
              <div className="relative">
                <span 
                  className="mx-2 border-b border-transparent min-w-[120px] inline-block"
                  style={textStyle}
                >{dearText},</span>
              </div>
            </div>
          </div>
          
          {/* Message section */}
          <div className={`absolute left-[30%] right-[23%] ${isSingleLine ? 'top-[38%]' : 'top-[45%] -translate-y-1/2'}`}>
            <div className={`flex flex-col items-center gap-2`}>
              <div 
                className={`w-full text-center border-b border-transparent min-h-[20px]`}
                style={textStyle}
              >
                {firstLine}
              </div>
              {secondLine && (
                <div 
                  className="w-full text-center border-b border-transparent min-h-[20px]"
                  style={textStyle}
                >
                  {secondLine}
                </div>
              )}
            </div>
          </div>
          
          {/* From section */}
          <div className="absolute bottom-[45.5%] left-[30%] right-[23%]">
            <div className="absolute left-[20%] right-[0%]">
              <div className="relative">
                <span 
                  className="mx-2 border-b border-transparent min-w-[138px] inline-block"
                  style={textStyle}
                >—{fromText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 italic text-center">
        Your personalized gift card will appear as shown above
      </p>
    </div>
  );
};