import * as React from "react";
import { Breadcrumbs, Link } from "./Breadcrumbs";

export interface HeaderProps {
  breadcrumbs?: Link[];
}

const Header = ({ breadcrumbs }: HeaderProps) => {
  return (
    <div className="min-h-[36px] px-6 py-2 bg-white overflow-x-auto whitespace-nowrap">
      <Breadcrumbs links={breadcrumbs || []} />
    </div>
  );
};

export default Header;
