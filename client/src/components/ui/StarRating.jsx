import React from 'react';

/**
 * Editorial StarRating with gold fill and review count
 */
export const StarRating = ({
  rating = 5.0,
  reviewsCount,
  size = 'sm',
  className = '',
}) => {
  const numRating = Number(rating) || 5.0;
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="flex items-center text-[#F4A340]">
        <i className="fa-solid fa-star text-xs"></i>
      </span>
      <span className="font-bold text-xs text-[#152238] dark:text-white font-heading">
        {numRating.toFixed(1)}
      </span>
      {reviewsCount !== undefined && (
        <span className="text-xs text-[#8A9BAD]">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
