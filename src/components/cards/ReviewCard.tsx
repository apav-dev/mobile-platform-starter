import * as React from "react";
import { useEffect, useState } from "react";
import Card from "../Card";
import ContentContainer from "../ContentContainer";
import InputForm from "../form/InputForm";
import { useEntity } from "../utils/useEntityContext";
import EditPanel from "../EditPanel";
import { Review } from "src/types/yext";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { CommentBubbleIcon } from "../icons/CommentBubble";
import { PersonIcon } from "../icons/PersonIcon";
import { formatDate } from "../../utils/formatDate";
import { ClockIcon } from "../icons/ClockIcon";
import { Star } from "lucide-react";
import Stars from "../Stars";

export interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    // TODO: Is it bad to have onClick without button?
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
            <div className="self-stretch text-gray-500 text-sm font-lato-regular line-clamp-1">
              {`${review.entity.address.line1}`}
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
  );
};

export default ReviewCard;
