import * as React from "react";
import Main from "../layouts/Main";
import ContentContainer from "../ContentContainer";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "../../utils/api";
import Heading from "../Heading";
import { EntityProvider } from "../utils/useEntityContext";
import { StarsIcon } from "../icons/StarsIcon";
import ReviewCard from "../cards/ReviewCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../Dropdown";
import { DownChevronIcon } from "../icons/DownChevronIcon";
import { LeftChevronIcon } from "../icons/LeftChevronIcon";
import { RightChevronIcon } from "../icons/RightChevronIcon";
import { twMerge } from "tailwind-merge";

export interface EntityReviewProps {
  entityId?: string;
}

const pageSizes = [5, 10, 25, 50];

// TODO: Add ability to add missing fields
const EntityReviews = ({ entityId }: EntityReviewProps) => {
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState<number>(1); // Starting index of current page

  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(
      ["reviews", entityId, pageToken, pageSize],
      () => fetchReviews(entityId, pageSize, pageToken),
      { keepPreviousData: true, enabled: !!entityId }
    );

  const handleNext = () => {
    if (data?.response.nextPageToken) {
      // Push the current pageToken to the prevPageTokens stack before moving to the next page
      setPrevPageTokens([...prevPageTokens, pageToken!]);
      setPageToken(data?.response.nextPageToken);
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

  const reviews = data?.response.docs;
  const count = data?.response.count;
  // Calculate the ending index for current page
  const endIndex = Math.min(
    startIndex + pageSize - 1,
    data?.response.count ?? 0
  );

  return (
    <Main
      breadcrumbs={[
        {
          name: "Home",
          path: "/",
        },
        { name: "Reviews" },
      ]}
    >
      {reviews && (
        <ContentContainer containerClassName="flex flex-col gap-y-4">
          <Heading title={"Reviews"} icon={<StarsIcon />} />
          <div className="py-4 flex flex-col gap-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.$key.primary_key} review={review} />
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
              <div className="justify-start items-center gap-2 flex">
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
                        data?.response.nextPageToken === undefined &&
                          "bg-gray-100"
                      )}
                      onClick={handleNext}
                      disabled={data?.response.nextPageToken === undefined}
                    >
                      <RightChevronIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentContainer>
      )}
    </Main>
  );
};

export default EntityReviews;
