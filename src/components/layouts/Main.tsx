import * as React from "react";
import Footer from "../Footer";
import Header from "../Header";
import { Link } from "../Breadcrumbs";
import { Toaster } from "../Toaster";

export interface MainProps {
  children?: React.ReactNode;
  breadcrumbs?: Link[];
  entityId: string;
}

export const Main = ({ children, breadcrumbs, entityId }: MainProps) => {
  return (
    <>
      <div className="min-h-screen">
        <Header breadcrumbs={breadcrumbs} />
        <div className="pb-[60px]">{children}</div>
        <Footer entityId={entityId} />
      </div>
      <Toaster />
    </>
  );
};
