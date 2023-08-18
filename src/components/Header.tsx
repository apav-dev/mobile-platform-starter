import * as React from "react";
import BreadCrumbs, { Link } from "./Breadcrumbs";

export interface HeaderProps {
  loading?: boolean;
  breadcrumbs?: Link[];
}

const Header = ({ loading, breadcrumbs }: HeaderProps) => {
  return (
    <div className="min-h-[36px] px-6 py-2 bg-white">
      <BreadCrumbs links={breadcrumbs || []} />
    </div>
  );
};

export default Header;
