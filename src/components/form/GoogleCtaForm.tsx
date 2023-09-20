import * as React from "react";
import { useForm } from "react-hook-form";
import { usePageContext } from "../utils/useSocialPageContext";
import { Button } from "../Button";
import { Switch } from "../Switch";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Select";
import { Input } from "../Input";
import { useTranslation } from "react-i18next";

export default function GoogleCtaForm() {
  const [isSelecting, setIsSelecting] = React.useState(false);

  const {
    setFormData,
    setCreatePostStep,
    setCreatingPost,
    ctaType,
    setCtaType,
    addingCta,
    setAddingCta,
    setSchedulePost,
  } = usePageContext();
  const { t } = useTranslation();

  const FormSchema = z.object({
    addCta: z.boolean(),
    ctaType: addingCta
      ? z.enum(["BOOK", "ORDER", "BUY", "LEARN_MORE", "SIGN_UP", "CALL"], {
          required_error: t("Type is required"),
        })
      : z
          .enum(["BOOK", "ORDER", "BUY", "LEARN_MORE", "SIGN_UP", "CALL"], {
            required_error: t("Type is required"),
          })
          .optional(),
    ctaUrl:
      addingCta && ctaType !== "CALL"
        ? z
            .string({
              required_error: t("URL is required"),
            })
            .trim()
            .url(t("Invalid url"))
        : z
            .string({ required_error: t("URL is required") })
            .trim()
            .optional(),
    ctaPhone:
      addingCta && ctaType === "CALL"
        ? z.string().min(10, t("Invalid Phone Number"))
        : z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      addCta: addingCta,
      ctaPhone: "",
      ctaUrl: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setFormData((prev: Record<string, any>) => ({
      ...prev,
      googleCtaType: data.ctaType,
      googleCtaUrl: data.ctaUrl,
      googleCtaPhone: data.ctaPhone,
    }));
    setCreatePostStep(4);
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

  const currentCtaType = form.watch("ctaType");
  const currentCtaUrl = form.watch("ctaUrl");
  const currentCtaPhone = form.watch("ctaPhone");

  React.useEffect(() => {
    setCtaType(currentCtaType || "");
  }, [currentCtaType]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="addCta"
            render={({ field }) => (
              <FormItem className="flex gap-2 items-center space-y-0">
                <FormControl>
                  <Switch
                    checked={addingCta}
                    onCheckedChange={() => {
                      if (addingCta) {
                        form.reset();
                      }
                      setAddingCta(!addingCta);
                    }}
                  />
                </FormControl>
                <FormDescription className="text-base font-lato-bold text-gray-700 text-xl">
                  {t("Add Google Call To Action")}
                </FormDescription>
              </FormItem>
            )}
          />
          <p className="font-lato-regular text-sm text-gray-700 italic">
            {t("Only applies to Google. Skip this step for Facebook posts.")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="ctaType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-lato-regular text-gray-700">
                  {t("Call To Action Type")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  onOpenChange={() => setIsSelecting(!isSelecting)}
                  disabled={!addingCta}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-sm py-3 px-4 bg-gray-300 font-lato-regular text-base text-gray-700">
                      <SelectValue
                        placeholder={t("Select Call To Action Type")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white rounded-sm z-100">
                    <SelectItem value="BOOK" className="text-base">
                      {t("Book")}
                    </SelectItem>
                    <SelectItem value="ORDER" className="text-base">
                      {t("Order")}
                    </SelectItem>
                    <SelectItem value="BUY" className="text-base">
                      {t("Buy")}
                    </SelectItem>
                    <SelectItem value="LEARN_MORE" className="text-base">
                      {t("Learn More")}
                    </SelectItem>
                    <SelectItem value="SIGN_UP" className="text-base">
                      {t("Sign up")}
                    </SelectItem>
                    <SelectItem value="CALL" className="text-base">
                      {t("Call")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {ctaType !== "CALL" && currentCtaType !== "CALL" && (
            <FormField
              control={form.control}
              name="ctaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-lato-regular text-gray-700">
                    {t("URL")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter URL")}
                      {...field}
                      className="rounded-sm py-3 px-4 font-lato-regular text-base text-gray-700"
                      disabled={!addingCta}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {(currentCtaType === "CALL" || ctaType === "CALL") && (
            <FormField
              control={form.control}
              name="ctaPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-lato-regular text-gray-700">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter Phone Number")}
                      {...field}
                      className="rounded-sm py-3 px-4 font-lato-regular text-base text-gray-700"
                      disabled={!addingCta}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Button
            variant="brand-primary"
            className="w-full"
            type="submit"
            disabled={isSelecting}
          >
            {addingCta
              ? t("Add Call To Action")
              : t("Continue Without Call To Action")}
          </Button>
          <Button
            variant={"brand-secondary"}
            onClick={() => {
              setFormData((prevState) => ({
                ...prevState,
                googleCtaType: currentCtaType,
                googleCtaUrl: currentCtaUrl,
                googleCtaPhone: currentCtaPhone,
              }));
              setCreatePostStep(2);
            }}
            disabled={isSelecting}
          >
            <span>{t("Back")}</span>
          </Button>
          <Button
            variant="brand-cancel"
            size="cancel"
            onClick={handleCancel}
            disabled={isSelecting}
          >
            <span>{t("Cancel")}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
