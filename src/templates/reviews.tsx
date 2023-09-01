import * as React from "react";
import "../index.css";
import {
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
  TemplateProps,
} from "@yext/pages";
import { useEffect, useState } from "react";
import EntityReviews from "../components/pages/EntityReviews";

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return `reviews`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: `Reviews`,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const Reviews = () => {
  const [entityId, setEntityId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");
    setEntityId(entityId);
  }, []);

  return <EntityReviews entityId={entityId} />;
};

export default Reviews;
