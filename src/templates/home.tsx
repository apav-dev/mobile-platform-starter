import * as React from "react";
import "../index.css";
import {
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
} from "@yext/pages";
import { Main } from "../components/layouts/Main";
import { ContentContainer } from "../components/ContentContainer";
import ProductCard from "../components/ProductCard";
import { GraphIcon } from "../components/icons/GraphIcon";
import { StarsIcon } from "../components/icons/StarsIcon";
import { SocialIcon } from "../components/icons/SocialIcon";
import { IoShareSocialOutline } from "react-icons/io5";
import { AnalyticsIcon } from "../components/icons/AnalyticsIcon";
import platformImgUrl from "../assets/images/platform.png";
import Skeleton from "../components/Skeleton";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import permissionedEntity from "../components/utils/permissionedEntity";

export const getPath: GetPath<TemplateRenderProps> = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Home",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const Home = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [authedEntity, setauthedEntity] = React.useState("#");
  const entityAuth = permissionedEntity();

  useEffect(() => {
    if (entityAuth) {
      setauthedEntity(entityAuth);
      setIsLoading(false);
    }
  }, [entityAuth]);

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
          <h1 className="font-lato-regular text-3xl">{t("Welcome to Yext")}</h1>
          <p className="font-lato-regular">
            {t(
              "We're excited to have you here. Please note that the mobile version of the platform offers limited functionality compared to the desktop version."
            )}
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
              title={t("Content")}
              description={t(
                "Edit your business information such as address, hours, and description."
              )}
              link={`/content?entityId=${authedEntity}`}
            />
            <ProductCard
              icon={<StarsIcon />}
              title={t("Reviews")}
              description={t("View your recent reviews, filter, and respond.")}
              link={`/reviews?entityId=${authedEntity}`}
            />
            <ProductCard
              icon={<IoShareSocialOutline className="w-5 h-5" />}
              title={t("Social")}
              description={t(
                "View and create social posts for Google and Facebook."
              )}
              link={`/social?entityId=${authedEntity}`}
            />
            <ProductCard
              icon={<AnalyticsIcon />}
              title={t("Analytics")}
              description={t(
                "View top metrics such as impressions and average rating for your business."
              )}
              link={`/analytics?entityId=${authedEntity}`}
            />
          </div>
        )}
      </ContentContainer>
    </Main>
  );
};

export default Home;
