import * as React from "react";
import Footer from "../Footer";
import Header from "../Header";
import { Link } from "../Breadcrumbs";
import { Toaster } from "../Toaster";
import permissionedEntity from "../utils/permissionedEntity";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";

export interface MainProps {
  children?: React.ReactNode;
  breadcrumbs?: Link[];
  disableScroll?: boolean;
}

export const Main = ({ children, breadcrumbs, disableScroll }: MainProps) => {
  const [authedEntity, setauthedEntity] = React.useState("#");
  const entityAuth = permissionedEntity();

  useEffect(() => {
    if (entityAuth) {
      setauthedEntity(entityAuth);
    }
  }, [entityAuth]);

  return (
    <>
      <div className="min-h-screen">
        <Header breadcrumbs={breadcrumbs} />
        <div
          className={twMerge(
            "pb-[60px]",
            disableScroll && "overflow-y-hidden h-[calc(100vh-60px)]"
          )}
        >
          {children}
        </div>
        <Footer entityId={authedEntity} />
      </div>
      <Toaster />
    </>
  );
};
