import * as React from "react";
import { Card } from "../Card";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { FacebookIcon } from "../icons/FacebookIcon";
import { CommentBubbleIcon } from "../icons/CommentBubble";
import { HeartIcon } from "../icons/HeartIcon";
import { formatUtcDate } from "../../utils/formatUtcDate";
import { ClockIcon } from "../icons/ClockIcon";

export default function SocialPostCard({
  entityName,
  entityAddress,
  postText,
  datePosted,
  postImage,
  publisher,
}) {
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

  const publisherName =
    publisher.substring(0, 1) + publisher.substring(1).toLowerCase();

  return (
    <Card>
      <div className="flex flex-col gap-4">
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
        <img src={postImage} className="w-full object-cover" />
        <p className="self-stretch text-gray-700 text-base font-lato-regular">
          {postText}
        </p>
        <div className="flex justify-between items-center self-stretch">
          <div className="flex gap-1 items-center">
            <FacebookIcon />
            <span className="text-gray-500 text-sm font-lato-regular normal-case">
              {publisherName}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 items-center text-gray-700 text-base font-lato-regular">
              <HeartIcon />
              <span>1</span>
            </div>
            <div className="flex gap-1 items-center text-gray-700 text-base font-lato-regular">
              <CommentBubbleIcon />
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="justify-start items-center gap-4 inline-flex">
          <ClockIcon />
          <div className="text-gray-700 text-base font-lato-regular leading-tight">
            {formatUtcDate(datePosted)}
          </div>
        </div>
      </div>
    </Card>
  );
}
