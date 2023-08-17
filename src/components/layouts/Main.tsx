import * as React from "react";
import Footer from "../Footer";

export interface MainProps {
  children?: React.ReactNode;
}

const Main = ({ children }: MainProps) => {
  return (
    <div className="min-h-screen">
      <div className="pb-[60px]">{children}</div>
      <Footer />
    </div>
  );
};

export default Main;
