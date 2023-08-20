import * as React from "react";
import Card from "./Card";
import { RightChevronIcon } from "./icons/RightChevronIcon";

export interface FieldCardProps {
  title: string;
  children?: React.ReactNode
}

const FieldCard = ({ title, children }: FieldCardProps) => {
  return (
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
            {title}
        </div>
        {children}
      </Card>
  );
};

export default FieldCard;
