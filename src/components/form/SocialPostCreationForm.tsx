import * as React from "react";
import { Heading } from "../Heading";
import { SocialIcon } from "../icons/SocialIcon";
import { useForm, SubmitHandler } from "react-hook-form";
import PublisherSelectForm from "./PublisherSelectForm";
import SocialPostContentForm from "./SocialPostContentForm";
import { usePageContext } from "../utils/useSocialPageContext";
import { twMerge } from "tailwind-merge";
import PostCreateSteps from "../PostCreateSteps";
import { IoShareSocialOutline } from "react-icons/io5";
import GoogleCtaForm from "./GoogleCtaForm";
import SchedulePostForm from "./SchedulePostForm";

const SocialPostCreationForm = ({ entityId }) => {
  const { createPostStep, setCreatePostStep, setFormData, setCreatingPost } =
    usePageContext();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Heading
          title={"Create New Post"}
          icon={<IoShareSocialOutline className="text-xl" />}
        />
        <div className="w-full border-t border-gray-300" />
      </div>
      <PostCreateSteps currentStep={createPostStep} />
      {createPostStep === 1 && <PublisherSelectForm />}
      {createPostStep === 2 && <SocialPostContentForm />}
      {createPostStep === 3 && <GoogleCtaForm />}
      {createPostStep === 4 && <SchedulePostForm />}
    </div>
  );
};

export default SocialPostCreationForm;
