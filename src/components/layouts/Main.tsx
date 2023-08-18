import * as React from "react";
import Footer from "../Footer";
import Header from "../Header";
import { Link } from "../Breadcrumbs";

export interface MainProps {
  children?: React.ReactNode;
  loading?: boolean;
  breadcrumbs?: Link[];
}

const Main = ({ children, loading, breadcrumbs }: MainProps) => {
  return (
    <div className="min-h-screen">
      <Header loading={loading} breadcrumbs={breadcrumbs} />
      <div className="pb-[60px]">{children}</div>
      <Footer />
    </div>
  );
};

export default Main;
