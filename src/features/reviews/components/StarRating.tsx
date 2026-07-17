import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 16 }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;
  const isInteractive = !!onChange;

  const handleClick = (starIndex: number) => {
    if (isInteractive && onChange) {
      onChange(starIndex);
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (isInteractive) {
      setHoverValue(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverValue(null);
    }
  };

  return (
    <div 
      className="flex items-center gap-1 select-none"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= displayValue;
        return (
          <span
            key={index}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            className={`transition-colors duration-200 ${
              isFilled ? 'text-primaryGold' : 'text-zinc-200'
            } ${isInteractive ? 'cursor-pointer hover:scale-110 transform' : ''}`}
            style={{ fontSize: `${size}px`, lineHeight: 1 }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};
