import * as React from "react";
import { twMerge } from "tailwind-merge";

interface PostCreateStepProps {
  currentStep: number;
}

const PostCreateSteps = ({ currentStep }: PostCreateStepProps) => {
  const stepNameMap = {
    "1": "1. Select Publisher",
    "2": "2. Post Content",
    "3": "3. Additional Options",
    "4": "4. Publish Post",
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div
          className={twMerge(
            "w-1/5 border-b-2 border-gray-500",
            currentStep === 1 && "border-b-4 border-blue"
          )}
        />
        <div
          className={twMerge(
            "w-1/5 border-b-2 border-gray-500",
            currentStep === 2 && "border-b-4 border-blue"
          )}
        />
        <div
          className={twMerge(
            "w-1/5 border-b-2 border-gray-500",
            currentStep === 3 && "border-b-4 border-blue"
          )}
        />
        <div
          className={twMerge(
            "w-1/5 border-b-2 border-gray-500",
            currentStep === 4 && "border-b-4 border-blue"
          )}
        />
      </div>
      <div className="font-lato-regular flex justify-between text-sm">
        <span className="text-blue">{stepNameMap[`${currentStep}`]}</span>
        <span className="text-gray-500">{`(Step ${currentStep} of 4)`}</span>
      </div>
    </div>
  );
};

export default PostCreateSteps;
