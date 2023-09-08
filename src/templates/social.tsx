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
import { fetchLocation, fetchReviews, fetchSocialPosts } from "../utils/api";
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
import { ReviewCard } from "../components/cards/ReviewCard";
import { DownChevronIcon } from "../components/icons/DownChevronIcon";
import { LeftChevronIcon } from "../components/icons/LeftChevronIcon";
import { RightChevronIcon } from "../components/icons/RightChevronIcon";
import { Main } from "../components/layouts/Main";
import { PageContextProvider } from "../components/utils/usePageContext";
import { twMerge } from "tailwind-merge";
import { Button } from "../components/Button";
import SocialPostCard from "../components/cards/SocialPostCard";

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

const pageSizes = [5, 10, 25, 50];

const Social = () => {
  const [entityId, setEntityId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState<number>(1); // Starting index of current page
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editId, setEditId] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");
    setEntityId(entityId);
  }, []);

  const reviewsQuery = useQuery(
    ["reviews", entityId, pageToken, pageSize],
    () => fetchReviews(entityId, pageSize, pageToken),
    { keepPreviousData: true, enabled: !!entityId }
  );

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
    if (reviewsQuery.data?.response.nextPageToken) {
      // Push the current pageToken to the prevPageTokens stack before moving to the next page
      setPrevPageTokens([...prevPageTokens, pageToken!]);
      setPageToken(reviewsQuery.data.response.nextPageToken);
      setStartIndex(startIndex + pageSize); // Update start index
    }
  };

  const handlePrev = () => {
    // Pop the last token from the prevPageTokens stack and use it to fetch the previous page
    const lastToken = prevPageTokens.pop();
    setPrevPageTokens([...prevPageTokens]); // Updating state after popping
    setPageToken(lastToken);
    setStartIndex(Math.max(1, startIndex - pageSize)); // Update start index
  };

  // useEffect that resets all pagination state when the page size changes
  useEffect(() => {
    setCurrentPage(0);
    setPageToken(undefined);
    setPrevPageTokens([]);
    setStartIndex(1);
  }, [pageSize]);

  const reviews = reviewsQuery.data?.response.reviews;
  const count = reviewsQuery.data?.response.count;
  // Calculate the ending index for current page
  const endIndex = Math.min(
    startIndex + pageSize - 1,
    reviewsQuery.data?.response.count ?? 0
  );
  const entityName = entityQuery.data?.response.docs?.[0]?.name;
  const entityAddress = entityQuery.data?.response.docs?.[0]?.address;
  const socialPosts = socialsQuery.data?.response.posts;
  console.log("social posts", socialPosts);

  return (
    <PageContextProvider
      value={{
        formData,
        setFormData,
        editId,
        setEditId,
      }}
    >
      <Main
        breadcrumbs={[
          {
            name: "Home",
            path: "/",
          },
          { name: "Social Posts" },
        ]}
      >
        {socialPosts && (
          <ContentContainer
            containerClassName={twMerge(editId && "overflow-y-hidden")}
          >
            <div className="flex flex-col gap-y-4">
              <Heading title={"Social Posts"} icon={<SocialIcon />} />
              <Button variant="brand-primary">+ Create New Post</Button>
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
                    postImage={post.photoUrls[0]}
                    publisher={post.publishers[0]}
                  />
                ))}
              </div>
              {/* <div className="justify-between items-start gap-4 flex">
                  <div className="justify-start items-center gap-2 flex">
                    <div className="text-gray-700 text-base font-lato-regular leading-tight">
                      Show
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-start items-center gap-2 inline-flex font-lato-regular">
                        <div className="flex gap-x-2 ">
                          {pageSize}
                          <div className="my-auto">
                            <DownChevronIcon />
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="font-lato-regular bg-white min-w-[6rem]">
                        {pageSizes
                          .filter((size) => size !== pageSize)
                          .map((size) => (
                            <DropdownMenuItem
                              key={size}
                              onSelect={() => setPageSize(size)}
                            >
                              <DropdownMenuLabel>{size}</DropdownMenuLabel>
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="justify-start items-center gap-2 flex pb-8">
                    <div className="text-gray-700 text-base font-lato leading-tight">
                      <span className="font-lato-bold">
                        {startIndex}-{endIndex}
                      </span>
                      <span className="font-lato-regular"> of</span>
                      <span className="font-lato-bold"> {count}</span>
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
                          <LeftChevronIcon />
                        </button>
                        <button
                          className={twMerge(
                            "w-11 h-11 px-2 py-1.5 bg-zinc-200 rounded-tr-[3px] rounded-br-[3px] justify-center items-center gap-2.5 flex",
                            reviewsQuery.data?.response.nextPageToken ===
                              undefined && "bg-gray-100"
                          )}
                          onClick={handleNext}
                          disabled={
                            reviewsQuery.data?.response.nextPageToken ===
                            undefined
                          }
                        >
                          <RightChevronIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </ContentContainer>
        )}
      </Main>
    </PageContextProvider>
  );
};

export default Social;
