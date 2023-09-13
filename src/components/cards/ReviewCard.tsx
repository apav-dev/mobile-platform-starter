import * as React from "react";
import { Card } from "../Card";
import { ContentContainer } from "../ContentContainer";
import EditPanel from "../EditPanel";
import { Address, Review } from "src/types/yext";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { CommentBubbleIcon } from "../icons/CommentBubble";
import { PersonIcon } from "../icons/PersonIcon";
import { ClockIcon } from "../icons/ClockIcon";
import Stars from "../Stars";
import { HorizontalDivider } from "../HorizontalDivider";
import TextareaForm from "../form/TextAreaForm";
import { getDaysSince } from "../../utils/getDaysSince";
import { StarsIcon } from "../icons/StarsIcon";
import { Heading } from "../Heading";
import Header from "../Header";
import { usePageContext } from "../utils/usePageContext";
import { formatUtcDate } from "../../utils/formatUtcDate";
import { useEffect } from "react";
import Skeleton from "../Skeleton";

export interface ReviewCardProps {
  review: Review;
  entityName?: string;
  entityAddress?: Address;
}

export const ReviewCardSkeleton = () => {
  return (
    <Card containerClassName="flex flex-col gap-y-4">
      <div className="justify-between items-center gap-4 inline-flex">
        <div className="flex gap-x-4">
          <Skeleton className="rounded-full h-5 w-5" />
          <div className="flex-col gap-y-1 justify-center items-start inline-flex">
            <Skeleton className="w-[170px] h-4" />
            <Skeleton className="w-[170px] h-3" />
          </div>
        </div>
      </div>
      <Skeleton className="w-20" />
      <div className="flex flex-col gap-y-1">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
      </div>
      <div className="justify-start items-center gap-4 inline-flex">
        <Skeleton className="w-[170px] h-4" />
      </div>
      <div className="justify-start items-center gap-4 inline-flex">
        <Skeleton className="w-[170px] h-4" />
      </div>
    </Card>
  );
};

{
  /* TODO: Handle comments */
}
export const ReviewCard = ({
  review,
  entityName,
  entityAddress,
}: ReviewCardProps) => {
  const { formData, entityMeta, editId, setEditId } = usePageContext();

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setEditId?.("");
  };

  useEffect(() => {
    if (formData[review.id.toString()]) {
      setEditId?.("");
    }
  }, [formData, review]);

  // address string where parts of the address are separated by commas and parts maybe missing so don't use commas to separate and don't show undefined parts
  const addressStr = entityAddress
    ? [
        entityAddress.line1,
        entityAddress.line2,
        entityAddress.city,
        entityAddress.region,
        entityAddress.postalCode,
        entityAddress.countryCode,
      ]
        .filter((part) => part !== undefined)
        .join(", ")
    : "";

  return (
    // TODO: Is it bad to have onClick without button?
    <div onClick={() => setEditId?.(review.id)}>
      <Card containerClassName="flex flex-col gap-y-4">
        <div className="justify-between items-center gap-4 inline-flex">
          <div className="flex gap-x-4">
            <div className="w-5 h-5 justify-center items-center gap-2.5 flex my-auto">
              <LocationPinIcon />
            </div>
            <div className="flex-col justify-center items-start inline-flex">
              <div className="text-gray-700 text-base font-lato-bold leading-tight">
                {entityName}
              </div>
              <div
                className={
                  "self-stretch text-gray-500 text-sm font-lato-regular line-clamp-1"
                }
              >
                {addressStr}
              </div>
            </div>
          </div>
          <div className="p-2 justify-start items-center gap-2 flex">
            <CommentBubbleIcon />
            <div className="text-gray-700 text-base font-lato-regular leading-tight">
              {review.comments?.length ?? 0}
            </div>
          </div>
        </div>
        <Stars rating={review.rating} />
        <p className="text-gray-700 font-lato-regular leading-tight line-clamp-3">
          {review.content}
        </p>
        <div className="justify-start items-center gap-4 inline-flex">
          <PersonIcon />
          <div className="text-gray-700 text-base font-lato-regular leading-tight">
            {review.authorName}
          </div>
        </div>
        <div className="justify-start items-center gap-4 inline-flex">
          <ClockIcon />
          <div className="text-gray-700 text-base font-lato-regular leading-tight">
            {formatUtcDate(review.publisherDate)}
          </div>
        </div>
      </Card>
      <EditPanel open={editId === review.id}>
        <Header
          breadcrumbs={[
            {
              name: "Home",
              path: "/",
            },
            { name: "Reviews", onClick: handleCancel },
            { name: review.id },
          ]}
        />
        <ContentContainer containerClassName={"flex flex-col gap-y-6 pb-20"}>
          <Heading title={"Reviews"} icon={<StarsIcon />} />
          <div className={"flex flex-col gap-y-4"}>
            <Card>
              <div className="justify-between items-center gap-4 inline-flex">
                <div className="flex gap-x-4">
                  <div className="w-5 h-5 justify-center items-center gap-2.5 flex my-auto">
                    <LocationPinIcon />
                  </div>
                  <div className="flex-col justify-center items-start inline-flex">
                    <div className="text-gray-700 text-base font-lato-bold leading-tight">
                      {entityName}
                    </div>
                    <div
                      className={
                        "self-stretch text-gray-500 text-sm font-lato-regular line-clamp-1"
                      }
                    >
                      {addressStr}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Stars rating={review.rating} />
            <p className="text-gray-700 font-lato-regular leading-tight line-clamp-3">
              {review.content}
            </p>
            <div className="justify-start items-center gap-4 inline-flex">
              <PersonIcon />
              <div className="text-gray-700 text-base font-lato-regular leading-tight">
                {review.authorName}
              </div>
            </div>
            <div className="justify-start items-center gap-4 inline-flex">
              <ClockIcon />
              <div className="text-gray-700 text-base font-lato-regular leading-tight">
                {formatUtcDate(review.publisherDate)}
              </div>
            </div>
          </div>
          <HorizontalDivider />
          <div className="justify-between items-center gap-4 flex">
            <div className="text-gray-700 text-base font-lato-bold leading-tight">
              RESPONSE
            </div>
            <div className="p-2 justify-start items-center gap-2 flex">
              <CommentBubbleIcon />
              <div className="text-gray-700 text-base font-lato-regular leading-tight">
                {review.comments?.length ?? 0}
              </div>
            </div>
          </div>
          {review.comments?.map((comment) => (
            <div className="p-6 bg-gray-100 rounded-lg flex-col justify-center items-center gap-6 inline-flex">
              <div className="self-stretch justify-start items-center gap-4 inline-flex">
                <div className="w-5 h-5 text-center text-gray-700 text-base font-black">
                  <PersonIcon />
                </div>
                <div className="text-gray-700 text-base font-lato-regular leading-tight">
                  {comment.authorName}
                </div>
              </div>
              <div className="self-stretch text-gray-700 font-lato-regular leading-tight">
                {comment.content}
              </div>
              <div className="self-stretch flex-col justify-center items-start gap-4 flex">
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                  <ClockIcon />
                  <div className="self-stretch flex-col justify-start items-start gap-0.5 inline-flex">
                    <p className="font-lato-regular">
                      {formatUtcDate(comment.publisherDate)}
                    </p>
                    <p className="text-gray-500 text-sm font-lato-regular">
                      {getDaysSince(comment.publisherDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {review.comments?.length === 0 ? (
            <TextareaForm
              id={review.id.toString()}
              submitButtonLabel="Submit Response"
              placeholder="Write a Response..."
              onCancel={handleCancel}
            />
          ) : (
            <div className="px-4 justify-center items-center flex">
              <button
                className="text-blue text-base font-lato-regular hover:underline"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
            </div>
          )}
        </ContentContainer>
      </EditPanel>
    </div>
  );
};
