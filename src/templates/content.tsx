import * as React from "react";
import "../index.css";
import {
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
} from "@yext/pages";
import EntityEdit from "../components/pages/EntityEdit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const getPath: GetPath<TemplateRenderProps> = () => {
  return `content`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Content",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const queryClient = new QueryClient();

const Content = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EntityEdit />
    </QueryClientProvider>
  );
};

export default Content;
