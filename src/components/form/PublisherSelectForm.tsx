import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../Button";

enum PublisherEnum {
  google = "GOOGLEMYBUSINESS",
  facebook = "FACEBOOK",
}

interface FormInput {
  publishers: PublisherEnum[];
}

const PublisherSelectForm = ({
  updatePublishers,
  updateStep,
  currentPubSelection,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    updatePublishers(data.publishers);
    updateStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      {errors.publishers && (
        <span>At least one publisher must be selected</span>
      )}
      <label htmlFor="google">
        <input
          {...register("publishers", { required: true })}
          type="checkbox"
          value="GOOGLEMYBUSINESS"
          id="google"
          name="publishers"
          defaultChecked={currentPubSelection.includes("GOOGLEMYBUSINESS")}
        />{" "}
        Google
      </label>
      <label htmlFor="facebook">
        <input
          {...register("publishers", { required: true })}
          type="checkbox"
          value="FACEBOOK"
          id="facebook"
          name="publishers"
          defaultChecked={currentPubSelection.includes("FACEBOOK")}
        />{" "}
        Facebook
      </label>

      <Button variant={"brand-primary"}>
        <input type="submit" />
      </Button>
    </form>
  );
};

export default PublisherSelectForm;
