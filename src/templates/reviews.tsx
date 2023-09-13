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
  createReviewComment,
  fetchLocationFromContentApi,
  fetchReviews,
} from "../utils/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../components/Dropdown";
import { StarsIcon } from "../components/icons/StarsIcon";
import { ContentContainer } from "../components/ContentContainer";
import { Heading } from "../components/Heading";
import { ReviewCard, ReviewCardSkeleton } from "../components/cards/ReviewCard";
import { DownChevronIcon } from "../components/icons/DownChevronIcon";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Main } from "../components/layouts/Main";
import { PageContextProvider } from "../components/utils/usePageContext";
import { twMerge } from "tailwind-merge";
import { useToast } from "../components/utils/useToast";
import { ToastAction } from "../components/Toast";

export const getPath: GetPath<TemplateProps> = () => {
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

export interface EntityReviewProps {
  entityId?: string;
}

const pageSizes = [5, 10, 25, 50];

const Reviews = () => {
  const { toast } = useToast();

  const [entityId, setEntityId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState<number>(1); // Starting index of current page
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editId, setEditId] = useState<number | string>("");

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

  const entityQuery = useQuery({
    queryKey: ["entityId", entityId],
    enabled: !!entityId,
    retry: false,
    queryFn: () => fetchLocationFromContentApi(entityId),
  });

  const commentMutation = useMutation({
    mutationFn: createReviewComment,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: (response) => {
      if (response.meta.errors?.length === 0) {
        const reviewId = Object.keys(formData)[0];
        toast({
          title: "Comment Submitted!",
          description: "Comment successfully submitted for review",
          duration: 5000,
          action: (
            <ToastAction
              altText="View Review"
              onClick={() => setEditId(Number(reviewId) ?? "")}
            >
              View Review
            </ToastAction>
          ),
        });
      } else {
        // TODO: throw error from api function to handle this in the onError callback
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }

      setFormData({});
      setTimeout(() => reviewsQuery.refetch(), 1000);
    },
  });

  useEffect(() => {
    // check how many keys are in the formData object. If greater than 1, log an error
    if (Object.keys(formData).length > 1) {
      console.error(
        "The formData object should only have one key-value pair. Please check the ReviewCard component."
      );
    } else if (entityId && Object.keys(formData).length === 1) {
      // If there is only one key-value pair, then it is the comment to be submitted. the key is the reviewId
      const reviewId = Object.keys(formData)[0];
      const content = formData[reviewId];
      commentMutation.mutate({ entityId, reviewId, content });
    }
  }, [formData]);

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
          { name: "Reviews" },
        ]}
      >
        {reviewsQuery.isLoading ? (
          <ContentContainer>
            <div className="flex flex-col gap-y-4">
              <Heading title={"Reviews"} icon={<StarsIcon />} />
              <div className="relative flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-4">
                  {[...Array(pageSize)].map((_, index) => (
                    <ReviewCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            </div>
          </ContentContainer>
        ) : (
          <ContentContainer
            containerClassName={twMerge(editId && "overflow-y-hidden")}
          >
            <div className="flex flex-col gap-y-4">
              <Heading title={"Reviews"} icon={<StarsIcon />} />
              <>
                {reviewsQuery?.data?.response?.count &&
                reviewsQuery.data.response.count > 0 ? (
                  <div className="relative flex flex-col gap-y-2">
                    {reviews?.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        entityAddress={entityAddress}
                        entityName={entityName}
                      />
                    ))}
                    <div className="justify-between items-start gap-4 flex">
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
                                "w-11 h-11 px-2 py-1.5 bg-zinc-200 rounded-tl-[3px] rounded-bl-[3px] justify-center items-center gap-2.5 flex",
                                prevPageTokens.length === 0 && "bg-gray-100"
                              )}
                              onClick={handlePrev}
                              disabled={prevPageTokens.length === 0}
                            >
                              <FaChevronLeft
                                className={twMerge(
                                  "h-3 w-3",
                                  prevPageTokens.length === 0 && "text-gray-400"
                                )}
                              />
                            </button>
                            <button
                              className={twMerge(
                                "w-11 h-11 px-2 py-1.5 bg-zinc-200 rounded-tr-[3px] rounded-br-[3px] justify-center items-center gap-2.5 flex",
                                (reviewsQuery.data?.response.nextPageToken ===
                                  undefined ||
                                  endIndex === count) &&
                                  "bg-gray-100"
                              )}
                              onClick={handleNext}
                              disabled={
                                reviewsQuery.data?.response.nextPageToken ===
                                  undefined || endIndex === count
                              }
                            >
                              <FaChevronRight
                                className={twMerge(
                                  "h-3 w-3",
                                  (reviewsQuery.data?.response.nextPageToken ===
                                    undefined ||
                                    endIndex === count) &&
                                    "text-gray-400"
                                )}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="px-4 justify-center items-center flex flex-col gap-y-4">
                      <div className="text-gray-700 text-base font-lato-bold leading-tight">
                        {`No reviews submitted for entity ${entityId}`}
                      </div>
                      <a
                        className="text-blue text-base font-lato-regular hover:underline"
                        href="/"
                      >
                        Return Home
                      </a>
                    </div>
                  </>
                )}
              </>
            </div>
          </ContentContainer>
        )}
      </Main>
    </PageContextProvider>
  );
};

export default Reviews;
