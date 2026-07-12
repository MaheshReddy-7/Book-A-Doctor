import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export const Rating = ({ rating = 5, max = 5, reviewsCount, interactive = false, onChange, className = '' }) => {
  const stars = [];
  const floorRating = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 1; i <= max; i++) {
    if (interactive) {
      stars.push(
        <span 
          key={i} 
          onClick={() => onChange && onChange(i)} 
          style={{ cursor: 'pointer', color: i <= rating ? '#EAB308' : '#CBD5E1' }}
          className="mx-1 fs-5"
        >
          <FaStar />
        </span>
      );
    } else {
      if (i <= floorRating) {
        stars.push(<FaStar key={i} className="text-warning me-1" />);
      } else if (i === floorRating + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning me-1" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-muted me-1" />);
      }
    }
  }

  return (
    <div className={`d-inline-flex align-items-center ${className}`}>
      {stars}
      {!interactive && rating !== undefined && (
        <span className="ms-2 fw-semibold text-dark small">
          {rating.toFixed(1)}
          {reviewsCount !== undefined && (
            <span className="text-muted fw-normal ms-1">({reviewsCount} reviews)</span>
          )}
        </span>
      )}
    </div>
  );
};
