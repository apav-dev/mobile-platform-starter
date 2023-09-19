import * as React from "react";
import Footer from "../Footer";
import Header from "../Header";
import { Link } from "../Breadcrumbs";
import { Toaster } from "../Toaster";
import permissionedEntity from "../utils/permissionedEntity";

export interface MainProps {
  children?: React.ReactNode;
  breadcrumbs?: Link[];
}

export const Main = ({ children, breadcrumbs }: MainProps) => {
  const [authedEntity, setauthedEntity] = React.useState("#");
  const entityAuth = permissionedEntity();

  React.useEffect(() => {
    if (entityAuth) {
      setauthedEntity(entityAuth);
    }
  }, [entityAuth]);

  return (
    <>
      <div className="min-h-screen">
        <Header breadcrumbs={breadcrumbs} />
        <div className="pb-[60px]">{children}</div>
        <Footer entityId={authedEntity} />
      </div>
      <Toaster />
    </>
  );
};
