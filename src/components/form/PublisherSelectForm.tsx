import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../Button";
import { usePageContext } from "../utils/useSocialPageContext";
import { BsGoogle } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { FacebookIcon } from "../icons/FacebookIcon";
import { GoogleIcon } from "../icons/GoogleIcon";

enum PublisherEnum {
  google = "GOOGLEMYBUSINESS",
  facebook = "FACEBOOK",
}

interface FormInput {
  publishers: PublisherEnum[];
}

const PublisherSelectForm = ({ cancelFunc }) => {
  const { formData, setFormData, setCreatePostStep } = usePageContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setFormData((prevState) => ({
      ...prevState,
      publishers: data.publishers,
    }));
    setCreatePostStep(2);
  };

  return (
    <>
      <h3 className="font-lato-bold text-gray-700 text-xl">Select Publisher</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
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
          <Button variant={"brand-primary"}>
            <input type="submit" value="Continue" />
          </Button>
          <Button
            className="text-blue font-lato-regular text-base"
            onClick={cancelFunc}
          >
            <div>Cancel</div>
          </Button>
        </div>
      </form>
    </>
  );
};

export default PublisherSelectForm;
