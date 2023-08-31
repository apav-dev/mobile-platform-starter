import * as React from "react";
import { StarIcon } from "./icons/StarIcon";
import { HalfStarIcon } from "./icons/HalfStarIcon";

export interface StarsProps {
  rating: number;
}

const Stars = ({ rating }: StarsProps) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<StarIcon key={i} />);
    } else if (i === Math.floor(rating)) {
      stars.push(<HalfStarIcon key={i} />);
    } else {
      stars.push(<StarIcon key={i} />);
    }
  }
  return <div className="flex gap-x-1">{stars}</div>;
};

export default Stars;
