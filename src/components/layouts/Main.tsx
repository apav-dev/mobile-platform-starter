import * as React from "react";
import Footer from "../Footer";
import Header from "../Header";
import { Link } from "../Breadcrumbs";
import { Toaster } from "../Toaster";

export interface MainProps {
  children?: React.ReactNode;
  breadcrumbs?: Link[];
}

export const Main = ({ children, breadcrumbs }: MainProps) => {
  return (
    <>
      <div className="min-h-screen">
        <Header breadcrumbs={breadcrumbs} />
        <div className="pb-[60px]">{children}</div>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};
