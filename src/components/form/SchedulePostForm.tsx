import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";

import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { Calendar } from "../Calendar";
import { RadioGroup, RadioGroupItem } from "../Radio";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form/Form";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Input } from "../Input";
import { usePageContext } from "../utils/useSocialPageContext";
import { useTranslation } from "react-i18next";

export default function PublisherSelectForm() {
  const {
    setFormData,
    setCreatePostStep,
    setCreatingPost,
    schedulePost,
    setSchedulePost,
  } = usePageContext();
  const { t } = useTranslation();

  const FormSchema = z.object({
    scheduleDate: schedulePost
      ? z.date({ required_error: t("Post date is required") })
      : z.date().optional(),
    scheduleTime: schedulePost
      ? z.string({ required_error: t("Post time is required") })
      : z.string().optional(),
    publishSchedule: z.enum(["now", "later"], {
      required_error: t("Select a publishing schedule"),
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setFormData((prev: Record<string, any>) => ({
      ...prev,
      publishSchedule: data.publishSchedule,
      scheduleDate: data.scheduleDate,
      scheduleTime: data.scheduleTime,
      readyToSubmit: true,
    }));
    setCreatingPost(false);
    setCreatePostStep(0);
    setSchedulePost(false);
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
          name="publishSchedule"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-xl font-lato-bold text-gray-700">
                {t("Publish Post")}
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
                        value="now"
                        onClick={() => setSchedulePost(false)}
                        className="peer hidden"
                      />
                    </FormControl>
                    <FormLabel className="font-lato-regular text-base text-gray-700 w-full border border-2 rounded-lg py-3 px-4 peer-aria-checked:border-blue">
                      {t("Post Immediately")}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem
                        value="later"
                        onClick={() => setSchedulePost(true)}
                        className="peer hidden"
                      />
                    </FormControl>
                    <FormLabel className="font-lato-regular text-base text-gray-700 w-full border border-2 rounded-lg py-3 px-4 peer-aria-checked:border-blue">
                      {t("Schedule Post")}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {schedulePost && (
          <div className="flex flex-col gap-2">
            <h3 className="font-lato-bold text-lg text-gray-700">
              {t("Schedule Settings")}
            </h3>
            <FormField
              control={form.control}
              name="scheduleDate"
              render={({ field }) => (
                <FormItem className="flex flex-col font-lato-regular text-gray-700">
                  <FormLabel className="text-base font-lato-regular text-gray-700">
                    {t("Date")}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal active:bg-blue text-sm"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-base">
                              {t("Pick a date")}
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-black" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-white shadow"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-sm font-lato-regular" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="scheduleTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-lato-regular text-gray-700">
                      {t("Time")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        defaultValue={field.value}
                        type="time"
                        className="rounded-sm py-3 px-4 text-sm font-lato-regular text-gray-700"
                      />
                    </FormControl>
                    <FormMessage className="text-sm font-lato-regular" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Button variant={"brand-primary"} className="w-full" type="submit">
            {t("Create post")}
          </Button>
          <Button
            variant={"brand-secondary"}
            onClick={() => {
              setSchedulePost(false);
              setCreatePostStep(3);
            }}
          >
            <span>{t("Back")}</span>
          </Button>
          <Button variant="brand-cancel" size="cancel" onClick={handleCancel}>
            <span>{t("Cancel")}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
