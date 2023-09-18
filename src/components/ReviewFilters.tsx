import { FaSearch, FaStar } from "react-icons/fa";
import { Button } from "./Button";
import { useState } from "react";
import { SidePanel } from "./SidePanel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./form/Form";
import { Input } from "./Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReviewFilterContext } from "./utils/useReviewFilterContext";
import { cn } from "../utils/cn";
import { Slider } from "./Slider";

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

export const ReviewFilters = () => {
  const [filterTitle, setFilterTitle] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [panelContent, setPanelContent] = useState<React.ReactNode>(<></>);

  const {
    searchQuery,
    filterPanelOpen,
    setFilterPanelOpen,
    ratingRange,
    clearFilters,
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
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <Button
      className={cn(
        "px-3 py-1.5 bg-white rounded-[15px] border border-zinc-200 justify-center items-center gap-2 flex text-gray-700 font-lato-regular leading-tight whitespace-nowrap",
        className
      )}
      onClick={() =>
        handleFilterClick("Rating", "Filter by Rating", <ReviewRatingSlider />)
      }
    >
      {children}
    </Button>
  );

  return (
    <>
      <div className="justify-start items-center gap-2 flex flex-wrap">
        <Button
          className={cn(
            "px-2 py-1 bg-white rounded-[15px] border border-zinc-200 justify-center items-center gap-2.5 flex",
            searchQuery && "px-3 py-1.5 bg-zinc-200"
          )}
          onClick={() =>
            handleFilterClick(
              "Search",
              "Search Review Content",
              <ReviewSearchForm />
            )
          }
        >
          {searchQuery ? (
            <span className="text-gray-900 font-lato-regular leading-tight whitespace-nowrap">{`"${searchQuery}"`}</span>
          ) : (
            <FaSearch className="text-gray-700 w-4 h-4" />
          )}
        </Button>
        {ratingRange[0] === 1 && ratingRange[1] === 5 ? (
          <FilterButton>All Ratings</FilterButton>
        ) : (
          <>
            {ratingRange[0] === ratingRange[1] ? (
              <FilterButton className="bg-zinc-200">
                {Array.from({ length: ratingRange[0] }).map((_, i) => (
                  <FaStar key={i} className="text-gray-700 w-2.5 2.5" />
                ))}
              </FilterButton>
            ) : (
              <>
                {ratingRange[0] > 1 && (
                  <FilterButton className="bg-zinc-200">
                    {Array.from({ length: ratingRange[0] }).map((_, i) => (
                      <FaStar key={i} className="text-gray-700 w-2.5 2.5" />
                    ))}
                    & Up
                  </FilterButton>
                )}
                {ratingRange[1] < 5 && (
                  <FilterButton className="bg-zinc-200">
                    {Array.from({ length: ratingRange[1] }).map((_, i) => (
                      <FaStar key={i} className="text-gray-700 w-2.5 2.5" />
                    ))}
                    & Below
                  </FilterButton>
                )}
              </>
            )}
          </>
        )}

        <Button className="px-3 py-1.5 bg-white rounded-[15px] border border-zinc-200 justify-center items-center gap-2 flex text-gray-700 font-lato-regular leading-tight whitespace-nowrap">
          No Response
        </Button>
        <Button className="px-3 py-1.5 bg-white rounded-[15px] border border-zinc-200 justify-center items-center gap-2 flex text-gray-700 font-lato-regular leading-tight whitespace-nowrap">
          All Publishers
        </Button>
        <Button
          className="text-blue font-lato-regular leading-tight hover:underline"
          onClick={handleCancel}
        >
          Clear
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
