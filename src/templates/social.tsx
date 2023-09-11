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
import { useQuery } from "@tanstack/react-query";
import { fetchLocation, fetchSocialPosts } from "../utils/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import { SocialIcon } from "../components/icons/SocialIcon";
import { ContentContainer } from "../components/ContentContainer";
import { Heading } from "../components/Heading";
import { Main } from "../components/layouts/Main";
import { PageContextProvider } from "../components/utils/useSocialPageContext";
import { twMerge } from "tailwind-merge";
import { Button } from "../components/Button";
import SocialPostCard from "../components/cards/SocialPostCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import SocialPostCreationForm from "../components/form/SocialPostCreationForm";
import { FaNode } from "react-icons/fa";
import { BsNodePlus } from "react-icons/bs";

export const getPath: GetPath<TemplateProps> = () => {
  return `social`;
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
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editId, setEditId] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [createPostStep, setCreatePostStep] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");
    setEntityId(entityId);
  }, []);

  const socialsQuery = useQuery(
    ["socials", entityId, pageToken],
    () => fetchSocialPosts(entityId, pageToken),
    { keepPreviousData: true, enabled: !!entityId }
  );

  const entityQuery = useQuery({
    queryKey: ["entityId", entityId],
    enabled: !!entityId,
    retry: false,
    queryFn: () => fetchLocation(entityId),
  });

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
  // console.log("social posts", socialPosts);
  console.log(formData);

  if (entityQuery.isLoading) {
    return (
      <div
        role="status"
        className="h-full min-h-screen flex justify-center items-center"
      >
        <svg
          aria-hidden="true"
          className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

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
      }}
    >
      <Main
        breadcrumbs={
          creatingPost
            ? [
                {
                  name: "Home",
                  path: "/",
                },
                { name: "Social Posts", path: `/social?entityId=${entityId}` },
                { name: "Create New Post" },
              ]
            : [
                {
                  name: "Home",
                  path: "/",
                },
                { name: "Social Posts" },
              ]
        }
      >
        {socialPosts && (
          <ContentContainer
            containerClassName={twMerge(editId && "overflow-y-hidden")}
          >
            {creatingPost ? (
              <SocialPostCreationForm entityId={entityId} />
            ) : (
              <div className="flex flex-col gap-y-4">
                <Heading
                  title={"Social Posts"}
                  icon={<IoShareSocialOutline className="text-xl" />}
                />
                <Button
                  variant="brand-primary"
                  onClick={() => {
                    setCreatingPost(true);
                    setCreatePostStep(1);
                  }}
                >
                  + Create New Post
                </Button>
                <div className="w-full border-t border-gray-400" />
                <div className="relative flex flex-col gap-y-2">
                  {socialPosts.map((post) => (
                    <SocialPostCard
                      key={post.postId}
                      entityAddress={{
                        city: "Massapequa",
                        countryCode: "US",
                        line1: "520 Hicksville Rd",
                        line2: "Floor 2",
                        postalCode: "11758",
                        region: "NY",
                      }}
                      entityName="One Stop Shop Grocer"
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
