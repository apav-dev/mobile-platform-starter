import * as React from "react";
import { v4 as uuidv4 } from "uuid";

export type Link =
  | { name: string; path: string; onClick?: never }
  | { name: string; path?: never; onClick: () => void }
  | { name: string; path?: never; onClick?: never };

export interface BreadcrumbProps {
  links: Link[];
  loading?: boolean;
}

export const Breadcrumbs = ({ links }: BreadcrumbProps) => {
  if (links.length === 0) return <></>;

  const renderLink = (link: Link, index: number) => {
    const isLast = index === links.length - 1;

    if (isLast) {
      return (
        <span key={`bc-${index}-${uuidv4()}`}>
          <span className="whitespace-nowrap truncate font-lato-regular text-base text-gray-500 font-normal leading-tight">
            {link.name}
          </span>
        </span>
      );
    } else if (link.onClick) {
      return (
        <div key={`bc-${index}-${uuidv4()}`}>
          <button
            className="whitespace-nowrap truncate font-lato-regular text-base font-normal leading-tight text-blue hover:underline"
            onClick={link.onClick}
          >
            {link.name}
          </button>
          <span className="px-1.5 text-gray-500 text-sm">/</span>
        </div>
      );
    } else {
      return (
        <div key={`bc-${index}-${uuidv4()}`}>
          <a
            href={link.path}
            className="whitespace-nowrap truncate font-lato-regular text-base font-normal leading-tight text-blue hover:underline"
          >
            {link.name}
          </a>
          <span className="px-1.5 text-gray-500 text-sm">/</span>
        </div>
      );
    }
  };

  return (
    <div className="justify-start items-center inline-flex">
      {links.map((link, index) => renderLink(link, index))}
    </div>
  );
};
