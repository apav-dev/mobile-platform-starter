import * as React from "react";
import { Card } from "../Card";
import { ContentContainer } from "../ContentContainer";
import EditPanel from "../EditPanel";
import { Review } from "src/types/yext";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { CommentBubbleIcon } from "../icons/CommentBubble";
import { PersonIcon } from "../icons/PersonIcon";
import { formatDate } from "../../utils/formatDate";
import { ClockIcon } from "../icons/ClockIcon";
import Stars from "../Stars";
import { HorizontalDivider } from "../HorizontalDivider";
import TextareaForm from "../form/TextAreaForm";
import { getDaysSince } from "../../utils/getDaysSince";
import { StarsIcon } from "../icons/StarsIcon";
import { Heading } from "../Heading";
import Header from "../Header";
import { usePageContext } from "../utils/usePageContext";

export interface ReviewCardProps {
  review: Review;
}

{
  /* TODO: Handle comments */
}
export const ReviewCard = ({ review }: ReviewCardProps) => {
  const { formData, entityMeta, editId, setEditId } = usePageContext();

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setEditId?.("");
  };

  // address string where parts of the address are separated by commas and parts maybe missing so don't use commas to separate and don't show undefined parts
  const addressStr = [
    review.entity.address.line1,
    review.entity.address.line2,
    review.entity.address.city,
    review.entity.address.region,
    review.entity.address.postalCode,
    review.entity.address.countryCode,
  ]
    .filter((part) => part !== undefined)
    .join(", ");

  return (
    // TODO: Is it bad to have onClick without button?
    <div onClick={() => setEditId?.(review.$key.primary_key)}>
      <Card containerClassName="flex flex-col gap-y-4">
        <div className="justify-between items-center gap-4 inline-flex">
          <div className="flex gap-x-4">
            <div className="w-5 h-5 justify-center items-center gap-2.5 flex my-auto">
              <LocationPinIcon />
            </div>
            <div className="flex-col justify-center items-start inline-flex">
              <div className="text-gray-700 text-base font-lato-bold leading-tight">
                {review.entity.name}
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
            {formatDate(review.reviewDate)}
          </div>
        </div>
      </Card>
      <EditPanel open={editId === review.$key.primary_key}>
        <Header
          breadcrumbs={[
            {
              name: "Home",
              path: "/",
            },
            { name: "Reviews", onClick: handleCancel },
            { name: review.$key.primary_key },
          ]}
        />
        <ContentContainer containerClassName={"flex flex-col gap-y-6"}>
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
                      {review.entity.name}
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
                {formatDate(review.reviewDate)}
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
                      {formatDate(comment.commentDate)}
                    </p>
                    <p className="text-gray-500 text-sm font-lato-regular">
                      {getDaysSince(comment.commentDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <TextareaForm
            id={"content"}
            submitButtonLabel="Submit Response"
            placeholder="Write a Response..."
            onCancel={handleCancel}
          />
        </ContentContainer>
      </EditPanel>
    </div>
  );
};
