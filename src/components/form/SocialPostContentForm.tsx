import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "../Textarea";
import { Button } from "../Button";

enum GoogleCtaEnum {
  google = "Google",
  facebook = "Facebook",
}

interface FormInput {
  postText: string;
}

const SocialPostContentForm = ({
  updatePostContent,
  updateStep,
  currentPostContent,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    updatePostContent(data.postText);
    updateStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Textarea
        defaultValue={currentPostContent}
        {...register("postText", { required: true })}
      />
      {errors.postText && <span>Post content is required.</span>}

      <Button variant={"brand-primary"}>
        <input type="submit" />
      </Button>
    </form>
  );
};

export default SocialPostContentForm;
