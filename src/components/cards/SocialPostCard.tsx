import * as React from "react";
import { Card } from "../Card";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { FacebookIcon } from "../icons/FacebookIcon";
import { formatUtcDate } from "../../utils/formatUtcDate";
import { FaClock, FaCommentAlt, FaHeart } from "react-icons/fa";
import Skeleton from "../Skeleton";

export const SocialCardSkeleton = () => {
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
      <Skeleton className="w-full h-40" />
      <div className="flex flex-col gap-y-1">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-1/2 h-3" />
      </div>
      <div className="justify-start items-center gap-4 inline-flex">
        <Skeleton className="rounded-full h-5 w-5" />
        <Skeleton className="w-2/3 h-4" />
      </div>
    </Card>
  );
};

export function SocialPostCard({
  entityName,
  entityAddress,
  postText,
  datePosted,
  postImage,
  publisher,
}) {
  // address string where parts of the address are separated by commas and parts maybe missing so don't use commas to separate and don't show undefined parts
  // TODO french address formatting
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

  const cleanedPublisher =
    publisher.substring(0, 1) + publisher.substring(1).toLowerCase();

  const publisherName =
    cleanedPublisher === "Googlemybusiness" ? "Google" : cleanedPublisher;

  const truncatedText =
    postText.length < 110 ? postText : postText.slice(0, 110) + "...";

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
          {truncatedText}
        </p>
        <div className="flex justify-between items-center self-stretch">
          <div className="flex gap-1 items-center">
            <FacebookIcon />
            <span className="text-gray-500 text-sm font-lato-regular normal-case">
              {publisherName}
            </span>
          </div>
          {/* <div className="flex items-center gap-4">
            <div className="flex gap-1 items-center text-gray-700 text-base font-lato-regular">
              <FaHeart />
              <span>1</span>
            </div>
            <div className="flex gap-1 items-center text-gray-700 text-base font-lato-regular">
              <FaCommentAlt />
              <span>0</span>
            </div>
          </div> */}
        </div>
        <div className="justify-start items-center gap-4 inline-flex">
          <FaClock className="text-gray-700" />
          <div className="text-gray-700 text-base font-lato-regular leading-tight">
            {formatUtcDate(datePosted)}
          </div>
        </div>
      </div>
    </Card>
  );
}
