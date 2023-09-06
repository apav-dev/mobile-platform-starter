import * as React from "react";
import { Card } from "./Card";
import { RightChevronIcon } from "./icons/RightChevronIcon";

export interface ProductCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ProductCard = ({ icon, title, description, link }: ProductCardProps) => {
  return (
    <a href={link}>
      <Card>
        <div className="self-stretch justify-start items-center gap-3 inline-flex">
          <div className="grow shrink basis-0 justify-start items-start gap-2 flex">
            <div className="w-6 h-6 relative">{icon}</div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
              <div className="self-stretch text-blue text-base font-lato-regular font-normal leading-tight">
                {title}
              </div>
              <div className="self-stretch text-gray-500 font-lato-regular text-base font-normal leading-tight">
                {description}
              </div>
            </div>
          </div>
          <div className="justify-center items-center gap-2.5 flex">
            <RightChevronIcon />
          </div>
        </div>
      </Card>
    </a>
  );
};

export default ProductCard;
