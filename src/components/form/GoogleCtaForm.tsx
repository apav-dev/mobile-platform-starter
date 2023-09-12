import * as React from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { usePageContext } from "../utils/useSocialPageContext";
import Select from "react-select";
import { Button } from "../Button";
import { Switch } from "../Switch";

interface FormInput {
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

const GoogleCtaForm = () => {
  const {
    formData,
    setFormData,
    setCreatePostStep,
    setCreatingPost,
    addingCta,
    setAddingCta,
  } = usePageContext();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
    setFormData((prevState) => ({
      ...prevState,
      googleCtaType: data.ctaType,
      googleCtaUrl: data.ctaUrl,
      googleCtaPhone: data.ctaPhone,
    }));
    setCreatePostStep(4);
  };

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setFormData({});
    setCreatePostStep(0);
    setCreatingPost(false);
    reset();
  };

  const watchCtaType = watch("ctaType", "");
  const watchCtaUrl = watch("ctaUrl", "");
  const watchCtaPhone = watch("ctaPhone", "");

  const { field } = useController({
    name: "ctaType",
    control,
    rules: { required: addingCta },
  });
  const { value: ctaValue, onChange: ctaOnChange, ...restCtaField } = field;

  return (
    <>
      <h2 className="font-lato-bold text-xl text-gray-700">
        Additional Options
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Switch
              id="google-cta"
              checked={addingCta}
              onCheckedChange={() => {
                if (addingCta) {
                  reset();
                  setFormData((prevState) => ({
                    ...prevState,
                    googleCtaType: undefined,
                    googleCtaUrl: undefined,
                    googleCtaPhone: undefined,
                  }));
                }
                setAddingCta(!addingCta);
              }}
            />
            <label
              htmlFor="google-cta"
              className="text-base font-lato-regular text-gray-700"
            >
              Add Google Call To Action
            </label>
          </div>
          {addingCta && (
            <>
              {" "}
              <Select
                placeholder="Select Call To Action Type"
                isClearable={false}
                isSearchable={false}
                unstyled
                isDisabled={!addingCta}
                options={googleCtaOptions}
                value={
                  formData.googleCtaType
                    ? googleCtaOptions.find(
                        (x) => x.value === formData.googleCtaType
                      )
                    : ctaValue
                    ? googleCtaOptions.find((x) => x.value === ctaValue)
                    : ctaValue
                }
                onChange={(option) =>
                  ctaOnChange(option ? option.value : option)
                }
                {...restCtaField}
                classNames={{
                  control: (state) =>
                    state.isDisabled
                      ? "bg-gray-300 text-gray-700 text-base font-lato-regular rounded-sm flex w-full py-3 px-4 opacity-50"
                      : "bg-gray-300 text-gray-700 text-base font-lato-regular rounded-sm flex w-full py-3 px-4",
                  menu: () =>
                    "bg-white rounded-sm shadow border border-zinc-200 mt-2 p-4",
                  menuList: () =>
                    "flex flex-col gap-4 font-lato-regular text-gray-700",
                }}
              />
              {watchCtaType !== "CALL" && (
                <input
                  type="url"
                  {...register("ctaUrl", {
                    required: addingCta
                      ? watchCtaType !== "CALL"
                        ? true
                        : false
                      : false,
                  })}
                  className="border-zinc-200 border py-3 px-4 rounded-sm font-lato-regular text-base text-gray-500 focus:outline-blue"
                  placeholder="Enter URL"
                  defaultValue={formData.googleCtaUrl || ""}
                />
              )}
              {watchCtaType === "CALL" && (
                <input
                  type="tel"
                  {...register("ctaPhone", {
                    required: addingCta
                      ? watchCtaType !== "CALL"
                        ? true
                        : false
                      : false,
                  })}
                  className="border-zinc-200 border py-3 px-4 rounded-sm font-lato-regular text-base text-gray-500 focus:outline-blue"
                  placeholder="Enter Phone Number"
                  defaultValue={formData.googleCtaPhone}
                />
              )}
              {(errors.ctaType || errors.ctaPhone || errors.ctaUrl) && (
                <span className="text-error font-lato-regular">
                  A type and corresponding value are both required to add a Call
                  To Action.
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Button variant={"brand-primary"} className="">
            <input
              type="submit"
              value={!addingCta ? "Skip" : "Add Call To Action"}
            />
          </Button>
          <Button
            variant={"brand-secondary"}
            onClick={() => {
              if (watchCtaType) {
                setFormData((prevState) => ({
                  ...prevState,
                  googleCtaType: watchCtaType,
                  googleCtaUrl: watchCtaUrl,
                  googleCtaPhone: watchCtaPhone,
                }));
              }
              setCreatePostStep(2);
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

export default GoogleCtaForm;
