import * as React from "react";
import "../index.css";
import {
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
} from "@yext/pages";
import { getRuntime } from "@yext/pages/util";
import Main from "../components/layouts/Main";
import ContentContainer from "../components/ContentContainer";
import ProductCard from "../components/ProductCard";
import { GraphIcon } from "../components/icons/GraphIcon";
import { StarsIcon } from "../components/icons/StarsIcon";
import { SocialIcon } from "../components/icons/SocialIcon";
import { MessageBubbleIcon } from "../components/icons/MessageBubbleIcon";
import { AnalyticsIcon } from "../components/icons/AnalyticsIcon";
import platformImgUrl from "../assets/images/platform.png";
import Skeleton from "../components/Skeleton";

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

const runtime = getRuntime();

const Home = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [permissionedEntity, setPermissionedEntity] = React.useState("#");

  React.useEffect(() => {
    async function fetchPermissionedEntity() {
      try {
        const token = window?.YEXT_TOKENS?.AUTH_SEARCH.token;
        if (!token) {
          console.log("no token found on window");
          return;
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        };
        const searchResults = await fetch(
          "https://cdn.yextapis.com/v2/accounts/me/search/vertical/query?input=locations&locale=en&verticalKey=locations&experienceKey=mobile-starter-search&version=PRODUCTION&v=20230907",
          requestOptions
        ).then((response) => response.json());
        const entityId = searchResults.response.results[0].data.id;
        setPermissionedEntity(entityId);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    if (!runtime.isServerSide) {
      fetchPermissionedEntity();
    }
  }, []);

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
        {isLoading ? (
          <div className="flex flex-col gap-y-6 mt-6">
            <Skeleton className="h-24 w-full rounded-lg shadow" />
            <Skeleton className="h-24 w-full rounded-lg shadow" />
            <Skeleton className="h-24 w-full rounded-lg shadow" />
            <Skeleton className="h-24 w-full rounded-lg shadow" />
            <Skeleton className="h-24 w-full rounded-lg shadow" />
          </div>
        ) : (
          <div className="flex flex-col gap-y-6 mt-6">
            <ProductCard
              icon={<GraphIcon />}
              title="Content"
              description="Edit your business information such as address, hours, and description."
              link={`/content/${permissionedEntity}`}
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
        )}
      </ContentContainer>
    </Main>
  );
};

export default Home;
