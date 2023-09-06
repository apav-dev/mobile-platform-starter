import * as React from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";

export interface StarsProps {
  rating: number;
}

const Stars = ({ rating }: StarsProps) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<FaStar key={i} className="text-gray-700" />);
    }
    // else if (i === Math.floor(rating)) {
    //   stars.push(
    //     <div className="relative w-4 h-4">
    //       <div className="absolute inset-0 z-[1] ">
    //         <FaStarHalf
    //           key={i}
    //           className="text-gray-700 absolute inset-0 z-[1] w-4 h-4"
    //         />
    //       </div>
    //       <div className="absolute inset-0">
    //         <FaStar
    //           key={i}
    //           className="text-gray-300 absolute inset-0 w-4 h-4"
    //         />
    //       </div>
    //     </div>
    //   );
    // }
    else {
      stars.push(<FaStar key={i} className="text-gray-300" />);
    }
  }
  return <div className="flex gap-x-1">{stars}</div>;
};

export default Stars;
