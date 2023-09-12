import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../Button";
import { usePageContext } from "../utils/useSocialPageContext";
import { FacebookIcon } from "../icons/FacebookIcon";
import { GoogleIcon } from "../icons/GoogleIcon";

enum PublisherEnum {
  google = "GOOGLEMYBUSINESS",
  facebook = "FACEBOOK",
}

interface FormInput {
  publishers: PublisherEnum[];
}

const PublisherSelectForm = () => {
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
      publishers: data.publishers,
    }));
    setCreatePostStep(2);
  };

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setFormData({});
    setCreatePostStep(0);
    setCreatingPost(false);
    reset();
  };

  const watchPublishers = watch("publishers", []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <h3 className="font-lato-bold text-gray-700 text-xl">
          Select Publisher
        </h3>
        <div className="flex flex-col gap-2 mb-2">
          <label htmlFor="google" className="flex">
            <input
              {...register("publishers", { required: true })}
              type="checkbox"
              value="GOOGLEMYBUSINESS"
              id="google"
              name="publishers"
              defaultChecked={formData.publishers?.includes("GOOGLEMYBUSINESS")}
              className="appearance-none"
            />{" "}
            <span className="bg-white rounded-lg shadow border border-zinc-200 flex items-center gap-2 p-4 grow font-lato-regular text-gray-700">
              <GoogleIcon />
              Google
            </span>
          </label>
          <label htmlFor="facebook" className="flex">
            <input
              {...register("publishers", { required: true })}
              type="checkbox"
              value="FACEBOOK"
              id="facebook"
              name="publishers"
              defaultChecked={formData.publishers?.includes("FACEBOOK")}
              className="appearance-none"
            />{" "}
            <span className="bg-white rounded-lg shadow border border-zinc-200 flex items-center gap-2 p-4 grow font-lato-regular text-gray-700">
              {" "}
              <FacebookIcon />
              Facebook
            </span>
          </label>
        </div>
        <div className="flex flex-col gap-2">
          {errors.publishers && (
            <span className="font-lato-regular text-base text-error">
              At least one publisher must be selected
            </span>
          )}
          <Button
            variant={"brand-primary"}
            disabled={!(watchPublishers.length > 0) && !formData.publishers}
          >
            <input type="submit" value="Continue" />
          </Button>
          <Button variant="brand-cancel" size="cancel" onClick={handleCancel}>
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </>
  );
};

export default PublisherSelectForm;
