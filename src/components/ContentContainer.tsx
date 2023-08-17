import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface ContainerProps {
  children?: React.ReactNode;
  containerClassName?: string;
}

const ContentContainer = ({ children, containerClassName }: ContainerProps) => {
  return (
    <div className={twMerge("px-6 py-4 mx-auto", containerClassName)}>
      {children}
    </div>
  );
};

export default ContentContainer;
