import * as React from "react";
import { useEffect, useState } from "react";
import "../index.css";
import {
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
  TemplateProps,
} from "@yext/pages";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAnalyticsForEntity } from "../utils/api";
import { ContentContainer } from "../components/ContentContainer";
import { Heading } from "../components/Heading";
import { Main } from "../components/layouts/Main";
import { SocialCardSkeleton } from "../components/cards/SocialPostCard";
import { IoAnalytics } from "react-icons/io5";
import Skeleton from "../components/Skeleton";
import { Card } from "../components/Card";
import { EyeIcon, ViewIcon } from "lucide-react";
import {
  AnalyticsMetricCard,
  AnalyticsCardSkeleton,
} from "../components/cards/AnalyticsMetricCard";
import { CommentBubbleIcon } from "../components/icons/CommentBubble";
import { BsListStars, BsStars, BsViewStacked } from "react-icons/bs";
import { StarsIcon } from "../components/icons/StarsIcon";
import { AnalyticsIcon } from "../components/icons/AnalyticsIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { useTranslation } from "react-i18next";

export const getPath: GetPath<TemplateProps> = () => {
  return "analytics";
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: `Analytics`,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

export interface EntityReviewProps {
  entityId?: string;
}

const Analytics = () => {
  const [entityId, setEntityId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<number>(7);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [totalPageViews, setTotalPageViews] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalImpressions, setTotalImpressions] = useState<number | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");
    setEntityId(entityId);
  }, []);

  const analyticsQuery = useQuery(
    ["analytics", entityId, startDate],
    () => fetchAnalyticsForEntity(entityId, startDate),
    { enabled: !!entityId }
  );
  const analyticsData = analyticsQuery.data?.response.data[0];

  useEffect(() => {
    if (analyticsData) {
      setTotalReviews(analyticsData["Reviews"]);
      setTotalPageViews(analyticsData["Page Views"]);
      setAverageRating(analyticsData["Average Rating"]);
      setTotalImpressions(analyticsData["Total Listings Impressions"]);
    }
  }, [analyticsData]);

  return (
    <Main
      breadcrumbs={[
        {
          name: t("Home"),
          path: "/",
        },
        { name: t("Analytics") },
      ]}
    >
      {analyticsQuery.isLoading && (
        <ContentContainer containerClassName="overflow-y-hidden">
          <div className="flex flex-col gap-y-4">
            <Heading title={t("Analytics")} icon={<AnalyticsIcon />} />
            <div className="w-full border-t border-gray-400" />
            <div className="flex flex-col gap-y-4">
              {[...Array(4)].map((_, index) => (
                <AnalyticsCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </ContentContainer>
      )}
      {analyticsQuery.isSuccess && (
        <ContentContainer containerClassName="overflow-y-hidden">
          <div className="flex flex-col gap-y-4">
            <Heading title={t("Analytics")} icon={<AnalyticsIcon />} />
            <Select
              defaultValue={startDate.toString()}
              onValueChange={(value) => setStartDate(parseInt(value))}
            >
              <SelectTrigger className="border border-zinc-200 rounded-full text-sm font-lato-regular text-gray-700 w-fit flex gap-2 items-center">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value={"7"}>{t("Last 7 Days")}</SelectItem>
                <SelectItem value={"30"}>{t("Last 30 Days")}</SelectItem>
              </SelectContent>
            </Select>
            <AnalyticsMetricCard
              icon={<EyeIcon />}
              label={t("Page Views")}
              metric={totalPageViews}
            />
            <AnalyticsMetricCard
              icon={<BsStars />}
              label={t("Impressions")}
              metric={totalImpressions}
            />
            <AnalyticsMetricCard
              icon={<CommentBubbleIcon />}
              label={t("Total Reviews")}
              metric={totalReviews}
            />
            <AnalyticsMetricCard
              icon={<StarsIcon />}
              label={t("Average Rating")}
              metric={averageRating?.toString().replace(".", ",")}
            />
          </div>
        </ContentContainer>
      )}
    </Main>
  );
};

export default Analytics;
