import * as React from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { usePageContext } from "../utils/useSocialPageContext";
// import Select from "react-select";
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

export default function GoogleCtaForm() {
  const [isSelecting, setIsSelecting] = React.useState(false);

  const {
    setFormData,
    setCreatePostStep,
    formData,
    setCreatingPost,
    schedulePost,
    setSchedulePost,
    ctaType,
    setCtaType,
    addingCta,
    setAddingCta,
  } = usePageContext();

  const FormSchema = z.object({
    addCta: z.boolean(),
    ctaType: addingCta
      ? z.enum(["BOOK", "ORDER", "BUY", "LEARN_MORE", "SIGN_UP", "CALL"], {
          required_error: "Type is required.",
        })
      : z
          .enum(["BOOK", "ORDER", "BUY", "LEARN_MORE", "SIGN_UP", "CALL"], {
            required_error: "Type is required.",
          })
          .optional(),
    ctaUrl:
      addingCta && ctaType !== "CALL"
        ? z
            .string({ required_error: "Call To Action URL required." })
            .trim()
            .url()
        : z
            .string({ required_error: "Call To Action URL required." })
            .trim()
            .optional(),
    ctaPhone:
      addingCta && ctaType === "CALL"
        ? z.string().min(10, "Invalid Phone Number")
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
    form.reset();
  };

  const currentCtaType = form.watch("ctaType");

  React.useEffect(() => {
    setCtaType(currentCtaType);
  }, [currentCtaType]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8"
      >
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
                Add Google Call To Action
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          {addingCta && (
            <FormField
              control={form.control}
              name="ctaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-lato-regular text-gray-700">
                    Call To Action Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    onOpenChange={() => setIsSelecting(!isSelecting)}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-sm py-3 px-4 bg-gray-300 font-lato-regular text-base text-gray-700">
                        <SelectValue placeholder="Select Call To Action Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white rounded-sm z-100">
                      <SelectItem value="BOOK" className="text-base">
                        Book
                      </SelectItem>
                      <SelectItem value="ORDER" className="text-base">
                        Order
                      </SelectItem>
                      <SelectItem value="BUY" className="text-base">
                        Buy
                      </SelectItem>
                      <SelectItem value="LEARN_MORE" className="text-base">
                        Learn More
                      </SelectItem>
                      <SelectItem value="SIGN_UP" className="text-base">
                        Sign up
                      </SelectItem>
                      <SelectItem value="CALL" className="text-base">
                        Call
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {addingCta && ctaType !== "CALL" && currentCtaType !== "CALL" && (
            <FormField
              control={form.control}
              name="ctaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-lato-regular text-gray-700">
                    URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter URL"
                      {...field}
                      className="rounded-sm py-3 px-4 font-lato-regular text-base text-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {addingCta && (currentCtaType === "CALL" || ctaType === "CALL") && (
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
                      placeholder="Enter Phone Number"
                      {...field}
                      className="rounded-sm py-3 px-4 font-lato-regular text-base text-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="brand-primary"
            className="w-full"
            type="submit"
            disabled={isSelecting}
          >
            Continue
          </Button>
          <Button
            variant={"brand-secondary"}
            onClick={() => {
              setCreatePostStep(2);
            }}
            disabled={isSelecting}
          >
            <span>Back</span>
          </Button>
          <Button
            variant="brand-cancel"
            size="cancel"
            onClick={handleCancel}
            disabled={isSelecting}
          >
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

// const GoogleCtaForm = () => {
//   const {
//     formData,
//     setFormData,
//     setCreatePostStep,
//     setCreatingPost,
//     addingCta,
//     setAddingCta,
//   } = usePageContext();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm<FormInput>();
//   const onSubmit: SubmitHandler<FormInput> = (data) => {
//     console.log(data);
//     setFormData((prevState) => ({
//       ...prevState,
//       googleCtaType: data.ctaType,
//       googleCtaUrl: data.ctaUrl,
//       googleCtaPhone: data.ctaPhone,
//     }));
//     setCreatePostStep(4);
//   };

//   const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
//     e?.stopPropagation();
//     setFormData({});
//     setCreatePostStep(0);
//     setCreatingPost(false);
//     reset();
//   };

//   const watchCtaType = watch("ctaType", "");
//   const watchCtaUrl = watch("ctaUrl", "");
//   const watchCtaPhone = watch("ctaPhone", "");

//   const { field } = useController({
//     name: "ctaType",
//     control,
//     rules: { required: false },
//   });
//   const { value: ctaValue, onChange: ctaOnChange, ...restCtaField } = field;

//   return (
//     <>
//       <h2 className="font-lato-bold text-xl text-gray-700">
//         Additional Options
//       </h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
//         <div className="flex flex-col gap-4">
//           <div className="flex gap-2">
// <Switch
//   id="google-cta"
//   checked={addingCta}
//   onCheckedChange={() => {
//     if (addingCta) {
//       reset();
//       setFormData((prevState) => ({
//         ...prevState,
//         googleCtaType: undefined,
//         googleCtaUrl: undefined,
//         googleCtaPhone: undefined,
//       }));
//     }
//     setAddingCta(!addingCta);
//   }}
// />
//             <label
//               htmlFor="google-cta"
//               className="text-base font-lato-regular text-gray-700"
//             >
//               Add Google Call To Action
//             </label>
//           </div>
//           {addingCta && (
//             <>
//               {" "}
//               <Select
//                 placeholder="Select Call To Action Type"
//                 isClearable={false}
//                 isSearchable={false}
//                 unstyled
//                 isDisabled={!addingCta}
//                 options={googleCtaOptions}
//                 value={
//                   formData.googleCtaType
//                     ? googleCtaOptions.find(
//                         (x) => x.value === formData.googleCtaType
//                       )
//                     : ctaValue
//                     ? googleCtaOptions.find((x) => x.value === ctaValue)
//                     : ctaValue
//                 }
//                 onChange={(option) =>
//                   ctaOnChange(option ? option.value : option)
//                 }
//                 {...restCtaField}
//                 classNames={{
//                   control: (state) =>
//                     state.isDisabled
//                       ? "bg-gray-300 text-gray-700 text-base font-lato-regular rounded-sm flex w-full py-3 px-4 opacity-50"
//                       : "bg-gray-300 text-gray-700 text-base font-lato-regular rounded-sm flex w-full py-3 px-4",
//                   menu: () =>
//                     "bg-white rounded-sm shadow border border-zinc-200 mt-2 p-4",
//                   menuList: () =>
//                     "flex flex-col gap-4 font-lato-regular text-gray-700",
//                 }}
//               />
//               {watchCtaType !== "CALL" && (
//                 <input
//                   type="url"
//                   {...register("ctaUrl", {
//                     required: addingCta
//                       ? watchCtaType !== "CALL"
//                         ? true
//                         : false
//                       : false,
//                   })}
//                   className="border-zinc-200 border py-3 px-4 rounded-sm font-lato-regular text-base text-gray-500 focus:outline-blue"
//                   placeholder="Enter URL"
//                   defaultValue={formData.googleCtaUrl}
//                 />
//               )}
//               {watchCtaType === "CALL" && (
//                 <input
//                   type="tel"
//                   {...register("ctaPhone", {
//                     required: addingCta
//                       ? watchCtaType !== "CALL"
//                         ? true
//                         : false
//                       : false,
//                   })}
//                   className="border-zinc-200 border py-3 px-4 rounded-sm font-lato-regular text-base text-gray-500 focus:outline-blue"
//                   placeholder="Enter Phone Number"
//                   defaultValue={formData.googleCtaPhone}
//                 />
//               )}
//               {(errors.ctaType || errors.ctaPhone || errors.ctaUrl) && (
//                 <span className="text-error font-lato-regular">
//                   A type and corresponding value are both required to add a Call
//                   To Action.
//                 </span>
//               )}
//             </>
//           )}
//         </div>
//         <div className="flex flex-col gap-4">
//           <Button variant={"brand-primary"} className="">
//             <input
//               type="submit"
//               value={!addingCta ? "Skip" : "Add Call To Action"}
//             />
//           </Button>
//           <Button
//             variant={"brand-secondary"}
//             onClick={() => {
//               if (watchCtaType) {
//                 setFormData((prevState) => ({
//                   ...prevState,
//                   googleCtaType: watchCtaType,
//                   googleCtaUrl: watchCtaUrl,
//                   googleCtaPhone: watchCtaPhone,
//                 }));
//               }
//               setCreatePostStep(2);
//             }}
//           >
//             <span>Back</span>
//           </Button>
//           <Button variant="brand-cancel" size="cancel" onClick={handleCancel}>
//             <span>Cancel</span>
//           </Button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default GoogleCtaForm;
