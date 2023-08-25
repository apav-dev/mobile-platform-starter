import * as React from "react";
import "../index.css";
import {
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
  TemplateConfig,
  TemplateProps,
} from "@yext/pages";
import EntityEdit from "../components/pages/EntityEdit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const config: TemplateConfig = {
  stream: {
    $id: "locations",
    localization: { locales: ["en"] },
    fields: ["id", "slug"],
    filter: { entityTypes: ["location"] },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug ?? `content/${document.id}`;
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

const Content = ({ document }: TemplateRenderProps) => {
  const { id } = document;

  return (
    <QueryClientProvider client={queryClient}>
      <EntityEdit entityId={id} />
    </QueryClientProvider>
  );
};

export default Content;
