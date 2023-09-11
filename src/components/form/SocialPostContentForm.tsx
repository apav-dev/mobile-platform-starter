import * as React from "react";
import { SubmitHandler, useForm, useController } from "react-hook-form";
import { Textarea } from "../Textarea";
import { Button } from "../Button";
import { usePageContext } from "../utils/useSocialPageContext";
import Select from "react-select";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "../Dropdown";
import { FiChevronDown } from "react-icons/fi";
import InputForm from "./InputForm";

interface FormInput {
  postText: string;
  ctaType: string;
  ctaUrl: string;
  ctaPhone: string;
}

const googleCtaOptions = [
  { value: "BOOK", label: "Book" },
  { value: "ORDER", label: "Order" },
  { value: "BUY", label: "Buy" },
  { value: "LEARN_MORE", label: "Learn More" },
  { value: "SIGN_UP", label: "Sign Up" },
  { value: "CALL", label: "Call" },
];

const SocialPostContentForm = ({ cancelFunc }) => {
  const { formData, setFormData, setCreatePostStep } = usePageContext();
  const [addingGoogleInfo, setAddingGoogleInfo] = React.useState(false);
  const [selectedActionType, setSelectedActionType] = React.useState("");

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setFormData((prevState) => ({
      ...prevState,
      postText: data.postText,
      googleCtaType: data.ctaType,
    }));
    setCreatePostStep(3);
  };

  const { field } = useController({ name: "ctaType", control });
  const { value: ctaValue, onChange: ctaOnChange, ...restCtaField } = field;

  const watchText = watch("postText", "");
  const watchCtaType = watch("ctaType", "");
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
              Post content is required.
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
        <div className="flex flex-col gap-2">
          <span className="font-lato-regular text-brand-gray-700 text-base">
            Other
          </span>
          {!addingGoogleInfo && (
            <Button
              variant="brand-secondary"
              onClick={() => setAddingGoogleInfo(true)}
            >
              Add Google Call To Action
            </Button>
          )}
          {addingGoogleInfo && (
            <div className="p-4 bg-white rounded-lg shadow border border-zinc-200 flex flex-col gap-4">
              <span className="font-lato-regular text-gray-700 text-base">
                Call To Action Type
              </span>
              <Select
                placeholder="Select Call To Action Type"
                isClearable={false}
                isSearchable={false}
                unstyled
                options={googleCtaOptions}
                value={
                  ctaValue
                    ? googleCtaOptions.find((x) => x.value === ctaValue)
                    : ctaValue
                }
                onChange={(option) =>
                  ctaOnChange(option ? option.value : option)
                }
                {...restCtaField}
                classNames={{
                  control: () =>
                    "bg-gray-300 text-gray-700 text-base font-lato-regular rounded-sm flex w-full py-3 px-4",
                  menu: () =>
                    "bg-white rounded-sm shadow border border-zinc-200 mt-2 p-4",
                  menuList: () =>
                    "flex flex-col gap-4 font-lato-regular text-gray-700",
                }}
              />
              {watchCtaType !== "CALL" && (
                <input
                  type="text"
                  {...register("ctaUrl")}
                  className="border-zinc-200 border py-3 px-4 rounded-sm font-lato-regular text-base text-gray-500"
                  placeholder="Enter URL"
                />
              )}
              {watchCtaType === "CALL" && (
                <input
                  type="text"
                  {...register("ctaPhone")}
                  className="border-zinc-200 border py-3 px-4 rounded-sm font-lato-regular text-base text-gray-500"
                  placeholder="Phone Number"
                />
              )}
              <Button
                className="text-blue font-lato-regular text-base"
                onClick={() => setAddingGoogleInfo(false)}
              >
                <span>Cancel</span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <Button
            variant={"brand-primary"}
            disabled={addingGoogleInfo || (!formData.postText && !watchText)}
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
          <Button
            className="text-blue font-lato-regular text-base w-fit self-center"
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
