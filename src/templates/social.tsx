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
import {
  createSocialPost,
  fetchLocationFromContentApi,
  fetchSocialPosts,
} from "../utils/api";
import { ContentContainer } from "../components/ContentContainer";
import { Heading } from "../components/Heading";
import { Main } from "../components/layouts/Main";
import { PageContextProvider } from "../components/utils/useSocialPageContext";
import { twMerge } from "tailwind-merge";
import { Button } from "../components/Button";
import {
  SocialPostCard,
  SocialCardSkeleton,
} from "../components/cards/SocialPostCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import SocialPostCreationForm from "../components/form/SocialPostCreationForm";
import Skeleton from "../components/Skeleton";
import { FormData } from "../types/social";
import { toast } from "../components/utils/useToast";
import { useTranslation } from "react-i18next";

export const getPath: GetPath<TemplateProps> = () => {
  return "social";
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: `Social`,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

export interface EntityReviewProps {
  entityId?: string;
}

const Social = () => {
  const [entityId, setEntityId] = useState<string | null>(null);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState<number>(1); // Starting index of current page
  const [formData, setFormData] = useState<FormData>({});
  const [editId, setEditId] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [createPostStep, setCreatePostStep] = useState(0);
  const [addingCta, setAddingCta] = React.useState(false);
  const [schedulePost, setSchedulePost] = React.useState(false);
  const [ctaType, setCtaType] = React.useState("");

  const { t } = useTranslation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");
    setEntityId(entityId);
  }, []);

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  const socialsQuery = useQuery(
    ["socials", entityId, pageToken],
    () => fetchSocialPosts(entityId, pageToken),
    { keepPreviousData: true, enabled: !!entityId }
  );

  const entityQuery = useQuery({
    queryKey: ["entityId", entityId],
    enabled: !!entityId,
    retry: false,
    queryFn: () => fetchLocationFromContentApi(entityId),
  });

  const postMutation = useMutation({
    mutationFn: createSocialPost,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: t("Uh oh! Something went wrong."),
        description: t("There was a problem with your request."),
      });
    },
    onSuccess: (response) => {
      if (response.meta.errors?.length === 0) {
        toast({
          title: t("Success!"),
          description: t("Post successfully submitted"),
          duration: 5000,
        });
      } else {
        // TODO: throw error from api function to handle this in the onError callback
        toast({
          variant: "destructive",
          title: t("Uh oh! Something went wrong."),
          description: t("There was a problem with your request."),
        });
      }

      setFormData({});
      setTimeout(() => socialsQuery.refetch(), 1000);
    },
  });

  useEffect(() => {
    // check how many keys are in the formData object. If greater than 1, log an error
    if (formData.readyToSubmit) {
      postMutation.mutate({ ...formData, entityId: entityId });
    }
    setFormData({});
  }, [formData.readyToSubmit]);

  const handleNext = () => {
    if (socialsQuery.data?.response.nextPageToken) {
      // Push the current pageToken to the prevPageTokens stack before moving to the next page
      setPrevPageTokens([...prevPageTokens, pageToken!]);
      setPageToken(socialsQuery.data.response.nextPageToken);
      setStartIndex(startIndex + 10); // Update start index
    }
  };

  const handlePrev = () => {
    // Pop the last token from the prevPageTokens stack and use it to fetch the previous page
    const lastToken = prevPageTokens.pop();
    setPrevPageTokens([...prevPageTokens]); // Updating state after popping
    setPageToken(lastToken);
    setStartIndex(Math.max(1, startIndex - 10)); // Update start index
  };

  const count = socialsQuery.data?.response.posts?.length;
  // Calculate the ending index for current page
  const endIndex = Math.min(
    startIndex + 10 - 1,
    count ? startIndex + count - 1 : 0
  );

  const entityName = entityQuery.data?.response.docs?.[0]?.name;
  const entityAddress = entityQuery.data?.response.docs?.[0]?.address;
  const socialPosts = socialsQuery.data?.response.posts;

  return (
    <PageContextProvider
      value={{
        formData,
        setFormData,
        editId,
        setEditId,
        creatingPost,
        createPostStep,
        setCreatePostStep,
        setCreatingPost,
        addingCta,
        setAddingCta,
        schedulePost,
        setSchedulePost,
        ctaType,
        setCtaType,
      }}
    >
      <Main
        breadcrumbs={
          creatingPost
            ? [
                {
                  name: t("Home"),
                  path: "/",
                },
                {
                  name: t("Social Posts"),
                  path: `/social?entityId=${entityId}`,
                },
                { name: t("Create Post") },
              ]
            : [
                {
                  name: t("Home"),
                  path: "/",
                },
                { name: t("Social Posts") },
              ]
        }
      >
        {(entityQuery.isLoading || socialsQuery.isLoading) && (
          <ContentContainer
            containerClassName={twMerge(editId && "overflow-y-hidden")}
          >
            <div className="flex flex-col gap-y-4">
              <Heading
                title={t("Social Posts")}
                icon={<IoShareSocialOutline className="text-xl" />}
              />
              <Skeleton className="w-full h-12" />
              <div className="w-full border-t border-gray-400" />
              <div className="flex flex-col gap-y-4">
                {[...Array(10)].map((_, index) => (
                  <SocialCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </ContentContainer>
        )}
        {socialPosts && (
          <ContentContainer
            containerClassName={twMerge(editId && "overflow-y-hidden")}
          >
            {creatingPost ? (
              <SocialPostCreationForm entityId={entityId} />
            ) : (
              <div className="flex flex-col gap-y-4">
                <Heading
                  title={t("Social Posts")}
                  icon={<IoShareSocialOutline className="text-xl" />}
                />
                <Button
                  variant="brand-primary"
                  onClick={() => {
                    setCreatingPost(true);
                    setCreatePostStep(1);
                  }}
                >
                  {`+ ${t("Create post")}`}
                </Button>
                <div className="w-full border-t border-gray-400" />
                <div className="relative flex flex-col gap-y-2">
                  {socialPosts.map((post) => (
                    <SocialPostCard
                      key={post.postId}
                      // entityAddress={{
                      //   city: "Massapequa",
                      //   countryCode: "US",
                      //   line1: "520 Hicksville Rd",
                      //   line2: "Floor 2",
                      //   postalCode: "11758",
                      //   region: "NY",
                      // }}
                      // entityName="One Stop Shop Grocer"
                      entityAddress={entityAddress}
                      entityName={entityName}
                      postText={post.text}
                      datePosted={post.postDate}
                      postImage={post.photoUrls && post.photoUrls[0]}
                      publisher={post.publishers[0]}
                    />
                  ))}
                </div>
                {count > 0 ? (
                  <div className="justify-between items-start gap-4 flex">
                    <div className="justify-start items-center gap-2 flex pb-8">
                      <div className="text-gray-700 text-base font-lato leading-tight">
                        <span className="font-lato-bold">
                          {startIndex}-{endIndex}
                        </span>
                      </div>
                      <div className="justify-center items-center flex">
                        <div className="self-stretch justify-start items-start gap-px inline-flex">
                          <button
                            className={twMerge(
                              "w-11 h-11 px-2 py-1.5 bg-gray-100 rounded-tl-[3px] rounded-bl-[3px] justify-center items-center gap-2.5 flex",
                              prevPageTokens.length === 0 && "bg-zinc-200"
                            )}
                            onClick={handlePrev}
                            disabled={prevPageTokens.length === 0}
                          >
                            <FiChevronLeft
                              className={
                                prevPageTokens.length === 0
                                  ? "text-zinc-400"
                                  : ""
                              }
                            />
                          </button>
                          <button
                            className={twMerge(
                              "w-11 h-11 px-2 py-1.5 bg-gray-100 rounded-tr-[3px] rounded-br-[3px] justify-center items-center gap-2.5 flex",
                              socialsQuery.data?.response.nextPageToken ===
                                undefined && "bg-zinc-200"
                            )}
                            onClick={handleNext}
                            disabled={
                              socialsQuery.data?.response.nextPageToken ===
                              undefined
                            }
                          >
                            <FiChevronRight
                              className={
                                socialsQuery.data?.response.nextPageToken ===
                                undefined
                                  ? "text-zinc-400"
                                  : ""
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // TODO: translate
                  <p className="text-base text-gray-700 font-lato-regular flex justify-center">
                    No previous posts were found for this entity.
                  </p>
                )}
              </div>
            )}
          </ContentContainer>
        )}
      </Main>
    </PageContextProvider>
  );
};

export default Social;
