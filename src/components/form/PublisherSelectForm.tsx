import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { usePageContext } from "../utils/useSocialPageContext";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "../Radio";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form/Form";
import { FacebookIcon } from "../icons/FacebookIcon";
import { GoogleIcon } from "../icons/GoogleIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

const PublisherSelectForm = () => {
  const {
    setFormData,
    setCreatePostStep,
    formData,
    setCreatingPost,
    setSchedulePost,
  } = usePageContext();

  const { t } = useTranslation();

  const FormSchema = z.object({
    publisher: z.enum(["GOOGLEMYBUSINESS", "FACEBOOK"], {
      required_error: t("Select a publisher"),
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      publisher: formData.publisher && formData.publisher,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setFormData((prev: Record<string, any>) => ({
      ...prev,
      publisher: data.publisher,
    }));
    setCreatePostStep(2);
    form.reset();
  }

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setFormData({});
    setCreatePostStep(0);
    setCreatingPost(false);
    setSchedulePost(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-8 flex flex-col"
      >
        <FormField
          control={form.control}
          name="publisher"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-xl font-lato-bold text-gray-700">
                {t("Select Publisher")}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col gap-2"
                >
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem
                        value="GOOGLEMYBUSINESS"
                        className="peer hidden"
                      />
                    </FormControl>
                    <FormLabel className="font-lato-regular text-base text-gray-700 w-full border border-2 rounded-lg py-3 px-4 peer-aria-checked:border-blue flex items-center gap-2">
                      <GoogleIcon />
                      Google
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem
                        value="FACEBOOK"
                        className="peer hidden"
                      />
                    </FormControl>
                    <FormLabel className="font-lato-regular text-base text-gray-700 w-full border border-2 rounded-lg py-3 px-4 peer-aria-checked:border-blue flex items-center gap-2">
                      <FacebookIcon />
                      Facebook
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <Button variant={"brand-primary"} className="w-full" type="submit">
            {t("Continue")}
          </Button>
          <Button variant="brand-cancel" size="cancel" onClick={handleCancel}>
            <span>{t("Cancel")}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PublisherSelectForm;
