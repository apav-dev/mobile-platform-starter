import * as React from "react";

export interface HeadingProps {
  icon?: React.ReactNode;
  title: string;
}

export const Heading = ({ icon, title }: HeadingProps) => {
  return (
    <div className="justify-start items-center gap-2 inline-flex">
      {icon}
      <div className="text-gray-700 text-2xl font-bold font-lato-bold">
        {title}
      </div>
    </div>
  );
};
