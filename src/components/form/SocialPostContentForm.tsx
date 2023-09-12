import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "../Textarea";
import { Button } from "../Button";
import { usePageContext } from "../utils/useSocialPageContext";

interface FormInput {
  postText: string;
}

const SocialPostContentForm = () => {
  const { formData, setFormData, setCreatePostStep, setCreatingPost } =
    usePageContext();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setFormData((prevState) => ({
      ...prevState,
      postText: data.postText,
    }));
    setCreatePostStep(3);
  };

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setFormData({});
    setCreatePostStep(0);
    setCreatingPost(false);
    reset();
  };

  const watchText = watch("postText", formData.postText || "");

  const maxContentLength = formData.publishers?.includes("GOOGLEMYBUSINESS")
    ? 1500
    : 5000;

  return (
    <>
      <h2 className="font-lato-bold text-xl text-gray-700">Content</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="postText"
            className="font-lato-regular text-brand-gray-700 text-base"
          >
            Post Content
          </label>
          <Textarea
            defaultValue={formData.postText || null}
            placeholder="Write your post content here..."
            maxLength={maxContentLength}
            id="postText"
            {...register("postText", {
              required: true,
              maxLength: maxContentLength,
            })}
          />
          {errors.postText && (
            <span className="font-lato-regular text-base text-error">
              {errors.postText.type === "maxLength" &&
                "Maximum character count exeeded."}
            </span>
          )}
          <div className="self-end text-sm text-gray-500 font-lato-regular">{`Characters remaining: ${
            maxContentLength - watchText.length
          }`}</div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-lato-regular text-brand-gray-700 text-base">
            Media
          </span>
          <Button variant="brand-secondary">+ Add Media</Button>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <Button
            variant={"brand-primary"}
            disabled={
              (!formData.postText && !watchText) ||
              errors.postText !== undefined
            }
          >
            <input type="submit" value="Continue" />
          </Button>
          <Button
            variant={"brand-secondary"}
            onClick={() => {
              if (watchText) {
                setFormData((prevState) => ({
                  ...prevState,
                  postText: watchText,
                }));
              }
              setCreatePostStep(1);
            }}
          >
            <span>Back</span>
          </Button>
          <Button variant="brand-cancel" size="cancel" onClick={handleCancel}>
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </>
  );
};

export default SocialPostContentForm;
