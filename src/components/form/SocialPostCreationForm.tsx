import * as React from "react";
import { Heading } from "../Heading";
import { SocialIcon } from "../icons/SocialIcon";
import { useForm, SubmitHandler } from "react-hook-form";
import PublisherSelectForm from "./PublisherSelectForm";
import SocialPostContentForm from "./SocialPostContentForm";
import { usePageContext } from "../utils/useSocialPageContext";
import { twMerge } from "tailwind-merge";
import PostCreateSteps from "../PostCreateSteps";

const SocialPostCreationForm = ({ entityId }) => {
  const {
    createPostStep,
    setCreatePostStep,
    setFormData,
    formData,
    setCreatingPost,
  } = usePageContext();
  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setFormData({});
    setCreatePostStep(0);
    setCreatingPost(false);
  };

  React.useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="flex flex-col gap-y-4">
      <Heading title={"Create New Post"} icon={<SocialIcon />} />
      <div className="w-full border-t border-gray-300" />
      <PostCreateSteps currentStep={createPostStep} />
      {createPostStep === 1 && (
        <PublisherSelectForm cancelFunc={handleCancel} />
      )}
      {createPostStep === 2 && (
        <SocialPostContentForm cancelFunc={handleCancel} />
      )}
    </div>
  );
};

export default SocialPostCreationForm;
