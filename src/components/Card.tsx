import * as React from "react";

export interface CardProps {
  children?: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow border border-zinc-200">
      {children}
    </div>
  );
};

export default Card;
