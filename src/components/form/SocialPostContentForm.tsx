import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "../Textarea";
import { Button } from "../Button";
import { usePageContext } from "../utils/useSocialPageContext";

interface FormInput {
  postText: string;
}

const SocialPostContentForm = ({ cancelFunc }) => {
  const { formData, setFormData, setCreatePostStep } = usePageContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setFormData((prevState) => ({
      ...prevState,
      postText: data.postText,
    }));
    setCreatePostStep(3);
  };

  const watchText = watch("postText", "");
  const maxContentLength = formData.publishers?.includes("GOOGLEMYBUSINESS")
    ? 1500
    : 5000;

  return (
    <>
      <h2 className="font-lato-bold text-xl">Content</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label
          htmlFor="postText"
          className="font-lato-regular text-brand-gray-900 text-base"
        >
          Post Content
        </label>
        <Textarea
          defaultValue={formData.postText || null}
          maxLength={maxContentLength}
          id="postText"
          {...register("postText", {
            required: true,
            maxLength: maxContentLength,
          })}
        />
        <div className="self-end text-sm py-2 text-gray-700 font-lato-regular">{`Characters remaining: ${
          maxContentLength - watchText.length
        }`}</div>
        <div className="flex flex-col gap-2">
          {errors.postText && (
            <span className="font-lato-regular text-base text-error">
              Post content is required.
            </span>
          )}

          <Button variant={"brand-primary"}>
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
          <Button
            className="text-blue font-lato-regular text-base"
            onClick={cancelFunc}
          >
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </>
  );
};

export default SocialPostContentForm;
