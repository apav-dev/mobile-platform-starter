import * as React from "react";
import "../index.css";
import {
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
} from "@yext/pages";
import Main from "../components/layouts/Main";
import ContentContainer from "../components/ContentContainer";
import ProductCard from "../components/ProductCard";
import { GraphIcon } from "../components/icons/GraphIcon";
import { StarsIcon } from "../components/icons/StarsIcon";
import { SocialIcon } from "../components/icons/SocialIcon";
import { MessageBubbleIcon } from "../components/icons/MessageBubbleIcon";
import { AnalyticsIcon } from "../components/icons/AnalyticsIcon";
import platformImgUrl from "../assets/images/platform.png";

export const getPath: GetPath<TemplateRenderProps> = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Yext Home",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const Home = () => {
  return (
    <Main>
      <ContentContainer containerClassName="py-8">
        <div className="flex flex-col items-center gap-y-8">
          <img
            // className="w-full h-full object-contain"
            src={platformImgUrl}
            alt="Yext Platform"
            height={245}
            width={342}
          />
          <h1 className="font-lato-regular text-3xl">Welcome to Yext</h1>
          <p className="font-lato-regular">
            We're excited to have you here. Please note that the mobile version
            of the platform offers limited functionality compared to the desktop
            version.
          </p>
        </div>
        <div className="flex flex-col gap-y-6 mt-6">
          <ProductCard
            icon={<GraphIcon />}
            title="Content"
            description="Edit your business information such as address, hours, and description."
            link="#"
          />
          <ProductCard
            icon={<StarsIcon />}
            title="Reviews"
            description="View your recent reviews, filter, and respond."
            link="#"
          />
          <ProductCard
            icon={<SocialIcon />}
            title="Social"
            description="View and create social posts for Google, Facebook, Instagram, and Twitter."
            link="#"
          />
          <ProductCard
            icon={<MessageBubbleIcon />}
            title="Q&A"
            description="View top metrics such as impressions and average rating for your business."
            link="#"
          />
          <ProductCard
            icon={<AnalyticsIcon />}
            title="Analytics"
            description="View top metrics such as impressions and average rating for your business."
            link="#"
          />
        </div>
      </ContentContainer>
    </Main>
  );
};

export default Home;
