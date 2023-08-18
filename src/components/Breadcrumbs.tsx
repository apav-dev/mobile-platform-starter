import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface Link {
  name: string;
  path?: string;
}

export interface BreadCrumbProps {
  links: Link[];
  loading?: boolean;
}

const BreadCrumbs = ({ links, loading }: BreadCrumbProps) => {
  if (links.length === 0) return <></>;

  return (
    <div className="justify-start items-center gap-1 inline-flex">
      {links.map((link, index) => {
        const isLast = index === links.length - 1;
        return (
          <span key={index}>
            <a
              href={link.path}
              className={twMerge(
                " font-lato-regular text-base text-gray-500 font-normal leading-tight ",
                link.path && "text-blue hover:underline"
              )}
            >
              {link.name}
            </a>
            {!isLast && <span className="mx-1 text-gray-500">/</span>}
          </span>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
