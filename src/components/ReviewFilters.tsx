import { FaSearch, FaStar } from "react-icons/fa";
import { Button } from "./Button";
import { useState } from "react";
import { SidePanel } from "./SidePanel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form/Form";
import { Input } from "./Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReviewFilterContext } from "./utils/useReviewFilterContext";
import { cn } from "../utils/cn";
import { Slider } from "./Slider";
import { Checkbox } from "./Checkbox";
import { RadioGroup, RadioGroupItem } from "./Radio";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const SearchFormSchema = z.object({
  reviewContent: z.string(),
});

const ReviewSearchForm = () => {
  const { searchQuery, setSearchQuery, setFilterPanelOpen } =
    useReviewFilterContext();

  const form = useForm<z.infer<typeof SearchFormSchema>>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      reviewContent: searchQuery,
    },
  });

  function onSubmit(data: z.infer<typeof SearchFormSchema>) {
    setSearchQuery(data.reviewContent);
    setFilterPanelOpen(false);
  }

  function handleCancel() {
    setFilterPanelOpen(false);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          // control={form.control}
          name="reviewContent"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Search..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="brand-primary"
          className="w-full"
          type="submit"
          // disabled={isSelecting}
        >
          Search
        </Button>
        <Button
          variant="brand-cancel"
          size="cancel"
          className="text-center w-full"
          onClick={handleCancel}
          // disabled={isSelecting}
        >
          <span>Cancel</span>
        </Button>
      </form>
    </Form>
  );
};

// TODO: Clean up this form and schema
const ReviewRatingSchema = z.any();
// z
//   .object({
//     ratingRange: z.tuple([
//       z
//         .number()
//         .min(1, "The first number in ratingRange must be at least 1")
//         .max(5, "The first number in ratingRange must be at most 5"),
//       z
//         .number()
//         .min(1, "The second number in ratingRange must be at least 1")
//         .max(5, "The second number in ratingRange must be at most 5"),
//     ]),
//   })
//   .refine((data) => data.ratingRange[0] <= data.ratingRange[1], {
//     message:
//       "The first number in ratingRange must be less than or equal to the second number",
//     path: ["ratingRange"],
//   });
const ReviewRatingSlider = () => {
  const { ratingRange, setRatingRange, setFilterPanelOpen } =
    useReviewFilterContext();

  const form = useForm<z.infer<typeof ReviewRatingSchema>>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      ratingRange: ratingRange,
    },
  });

  function onSubmit(data: z.infer<typeof ReviewRatingSchema>) {
    data.stopPropagation();
    data.preventDefault();
    console.log(form.getValues());
    // debugger;
    setRatingRange(form.getValues().ratingRange);
    setFilterPanelOpen(false);
  }

  function handleCancel() {
    setFilterPanelOpen(false);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={
          // form.handleSubmit(
          onSubmit
          // )
        }
      >
        <FormField
          control={form.control}
          name="ratingRange"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Slider
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                  max={5}
                  step={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="brand-primary"
          className="w-full"
          type="submit"
          // disabled={isSelecting}
        >
          Search
        </Button>
        <Button
          variant="brand-cancel"
          size="cancel"
          className="text-center w-full"
          onClick={handleCancel}
          // disabled={isSelecting}
        >
          <span>Cancel</span>
        </Button>
      </form>
    </Form>
  );
};

export const publisherOptions = [
  {
    id: "FIRSTPARTY",
    label: "First-Party",
  },
  {
    id: "GOOGLEMYBUSINESS",
    label: "Google",
  },
  {
    id: "FACEBOOK",
    label: "Facebook",
  },
] as const;

const PublisherFormSchema = z.object({
  publisherIds: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: t("You must select at least one publisher"),
    }),
});

// TODO: Validate that at least one publisher is selected and show error message
export function PublisherSelector() {
  const { publisherIds, setPublisherIds, setFilterPanelOpen } =
    useReviewFilterContext();

  const form = useForm<z.infer<typeof PublisherFormSchema>>({
    resolver: zodResolver(PublisherFormSchema),
    defaultValues: {
      publisherIds,
    },
  });

  function onSubmit(data: z.infer<typeof PublisherFormSchema>) {
    setPublisherIds(data.publisherIds);
    setFilterPanelOpen(false);
  }

  function handleCancel() {
    setFilterPanelOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="publisherIds"
          render={() => (
            <FormItem className="space-y-6">
              {publisherOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="publisherIds"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, option.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== option.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-lato-regular">
                          {t(option.label)}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="brand-primary"
          className="w-full"
          type="submit"
          // disabled={isSelecting}
        >
          <span>{t("Search")}</span>
        </Button>
        <Button
          variant="brand-cancel"
          size="cancel"
          className="text-center w-full"
          onClick={handleCancel}
          // disabled={isSelecting}
        >
          <span>{t("Cancel")}</span>
        </Button>
      </form>
    </Form>
  );
}

export enum AwaitingResponseType {
  NO_RESPONSE = "NO_RESPONSE",
  REVIEW = "REVIEW",
  COMMENT = "COMMENT",
  REVIEW_OR_COMMENT = "REVIEW_OR_COMMENT",
}

const awaitingResponseOptions = [
  {
    label: "No Response",
    value: AwaitingResponseType.NO_RESPONSE,
  },
  {
    label: "Review",
    value: AwaitingResponseType.REVIEW,
  },
  {
    label: "Comment",
    value: AwaitingResponseType.COMMENT,
  },
  {
    label: "Review or Comment",
    value: AwaitingResponseType.REVIEW_OR_COMMENT,
  },
] as const;

const valuesTuple: [string, string, string, string] =
  awaitingResponseOptions.map((option) => option.value) as any;

const ResponseFormSchema = z.object({
  awaitingResponse: z.enum(valuesTuple, {
    required_error: "You need to select a notification type.",
  }),
});

export function AwaitingResponseSelector() {
  const { setFilterPanelOpen, awaitingResponse, setAwaitingResponse } =
    useReviewFilterContext();

  const form = useForm<z.infer<typeof ResponseFormSchema>>({
    resolver: zodResolver(ResponseFormSchema),
    defaultValues: {
      awaitingResponse,
    },
  });

  function onSubmit(data: z.infer<typeof ResponseFormSchema>) {
    setAwaitingResponse(data.awaitingResponse);
    setFilterPanelOpen(false);
  }

  function handleCancel() {
    setFilterPanelOpen(false);
  }
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="awaitingResponse"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value={AwaitingResponseType.NO_RESPONSE}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t("No Response")}
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AwaitingResponseType.REVIEW} />
                    </FormControl>
                    <FormLabel className="font-normal">{t("Review")}</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AwaitingResponseType.COMMENT} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t("Comment")}
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value={AwaitingResponseType.REVIEW_OR_COMMENT}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t("Review or Comment")}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="brand-primary"
          className="w-full"
          type="submit"
          // disabled={isSelecting}
        >
          {t("Search")}
        </Button>
        <Button
          variant="brand-cancel"
          size="cancel"
          className="text-center w-full"
          onClick={handleCancel}
          // disabled={isSelecting}
        >
          <span>{t("Cancel")}</span>
        </Button>
      </form>
    </Form>
  );
}

export const ReviewFilters = () => {
  const [filterTitle, setFilterTitle] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [panelContent, setPanelContent] = useState<React.ReactNode>(<></>);

  const { t } = useTranslation();

  const {
    searchQuery,
    filterPanelOpen,
    setFilterPanelOpen,
    ratingRange,
    clearFilters,
    publisherIds,
    awaitingResponse,
  } = useReviewFilterContext();

  const handleFilterClick = (
    title: string,
    description: string,
    panelContent: React.ReactNode
  ) => {
    setFilterTitle(title);
    setFilterDescription(description);
    setFilterPanelOpen(true);
    setPanelContent(panelContent);
  };

  const handleCancel = () => {
    setFilterPanelOpen(false);
    clearFilters();
  };

  const FilterButton = ({
    title,
    description,
    filterComponent,
    children,
    className,
  }: {
    title: string;
    description: string;
    filterComponent: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Button
      className={cn(
        "px-3 py-1.5 bg-white rounded-[15px] border border-zinc-200 justify-center items-center gap-2 flex text-gray-700 font-lato-regular leading-tight whitespace-nowrap",
        className
      )}
      onClick={() => handleFilterClick(title, description, filterComponent)}
    >
      {children}
    </Button>
  );

  return (
    <>
      <div className="justify-start items-center gap-2 flex flex-wrap">
        <FilterButton
          title={t("Search")}
          description={t("Search for review content by keyword")}
          className={cn(
            "px-2 py-1 bg-white rounded-[15px] border border-zinc-200 justify-center items-center gap-2.5 flex",
            searchQuery && "px-3 py-1.5 bg-zinc-200"
          )}
          filterComponent={<ReviewSearchForm />}
        >
          {searchQuery ? (
            <span className="text-gray-900 font-lato-regular leading-tight whitespace-nowrap">{`"${searchQuery}"`}</span>
          ) : (
            <FaSearch className="text-gray-700 w-4 h-4" />
          )}
        </FilterButton>
        {ratingRange[0] === 1 && ratingRange[1] === 5 ? (
          <FilterButton
            title={t("Review Rating")}
            description={t("Filter Reviews by rating")}
            filterComponent={<ReviewRatingSlider />}
          >
            {t("All Ratings")}
          </FilterButton>
        ) : (
          <>
            {ratingRange[0] === ratingRange[1] ? (
              <FilterButton
                className="bg-zinc-200"
                title={t("Review Rating")}
                description={t("Filter Reviews by rating")}
                filterComponent={<ReviewRatingSlider />}
              >
                {Array.from({ length: ratingRange[0] }).map((_, i) => (
                  <FaStar key={i} className="text-gray-700 w-2.5 2.5" />
                ))}
              </FilterButton>
            ) : (
              <>
                {ratingRange[0] > 1 && (
                  <FilterButton
                    className="bg-zinc-200"
                    title={t("Review Rating")}
                    description={t("Filter Reviews by rating")}
                    filterComponent={<ReviewRatingSlider />}
                  >
                    {Array.from({ length: ratingRange[0] }).map((_, i) => (
                      <FaStar key={i} className="text-gray-700 w-2.5 2.5" />
                    ))}
                    {t("& Up")}
                  </FilterButton>
                )}
                {ratingRange[1] < 5 && (
                  <FilterButton
                    className="bg-zinc-200"
                    title={t("Review Rating")}
                    description={t("Filter Reviews by rating")}
                    filterComponent={<ReviewRatingSlider />}
                  >
                    {Array.from({ length: ratingRange[1] }).map((_, i) => (
                      <FaStar key={i} className="text-gray-700 w-2.5 2.5" />
                    ))}
                    {t("& Below")}
                  </FilterButton>
                )}
              </>
            )}
          </>
        )}

        <FilterButton
          className={cn(
            "px-3 py-1.5 bg-white rounded-[15px] border border-zinc-200 justify-center items-center gap-2 flex text-gray-700 font-lato-regular leading-tight whitespace-nowrap",
            awaitingResponse !== AwaitingResponseType.NO_RESPONSE &&
              "bg-zinc-200"
          )}
          title={t("Awaiting Response")}
          description={t("Filter by reviews awaiting a response")}
          filterComponent={<AwaitingResponseSelector />}
        >
          {t(
            awaitingResponseOptions.find(
              (option) => option.value === awaitingResponse
            )?.label ?? ""
          )}
        </FilterButton>

        {publisherIds.length === publisherOptions.length ? (
          <FilterButton
            className="px-3 py-1.5 bg-white rounded-[15px] border border-zinc-200 justify-center items-center gap-2 flex text-gray-700 font-lato-regular leading-tight whitespace-nowrap"
            title={t("Publisher")}
            description={t("Filter Reviews by publisher")}
            filterComponent={<PublisherSelector />}
          >
            {t("All Publishers")}
          </FilterButton>
        ) : (
          // button per publisher
          <>
            {publisherIds.map((id) => {
              const publisher = publisherOptions.find(
                (publisher) => publisher.id === id
              );
              if (!publisher) return null;
              return (
                <FilterButton
                  key={publisher.id}
                  className="bg-zinc-200"
                  title={t("Publisher")}
                  description={t("Filter Reviews by publisher")}
                  filterComponent={<PublisherSelector />}
                >
                  {publisher.label}
                </FilterButton>
              );
            })}
          </>
        )}
        <Button
          className="text-blue font-lato-regular leading-tight hover:underline"
          onClick={handleCancel}
        >
          {t("Clear")}
        </Button>
      </div>
      <SidePanel
        open={filterPanelOpen}
        setOpen={setFilterPanelOpen}
        title={filterTitle}
        description={filterDescription}
      >
        {panelContent}
      </SidePanel>
    </>
  );
};
