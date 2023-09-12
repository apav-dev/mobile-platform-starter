import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";

import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { Calendar } from "../Calendar";
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
// import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  scheduleDate: z.date({
    required_error: "A post date required.",
  }),
});

export default function PublisherSelectForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="scheduleDate"
          render={({ field }) => (
            <FormItem className="flex flex-col font-lato-regular text-gray-700">
              <FormLabel className="text-base">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span className="text-base">Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4" />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <label></label>
        <Input
          id="scheduleTime"
          type="time"
          step={60}
          className="font-lato-regular text-base h-8 text-gray-700 rounded-sm py-6 px-3 focus-visible:ring-blue"
          onChange={(e) => console.log(e.target.value)}
          defaultValue={"12:00"}
        />
        <Button variant={"brand-primary"} className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

// import * as React from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { Button } from "../Button";
// import { usePageContext } from "../utils/useSocialPageContext";
// import { ArrowDownNarrowWide } from "lucide-react";
// import { IoArrowDownCircleSharp } from "react-icons/io5";
// import { BsChevronDown } from "react-icons/bs";

// enum ScheduleEnum {
//   now = "now",
//   later = "later",
// }

// interface FormInput {
//   publishSchedule: ScheduleEnum;
//   publishTime: Date;
// }

// const PublisherSelectForm = () => {
//   const { formData, setFormData, setCreatePostStep, setCreatingPost } =
//     usePageContext();
//   const [schedulePost, setSchedulePost] = React.useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<FormInput>();
//   const onSubmit: SubmitHandler<FormInput> = (data) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       publishSchedule: data.publishSchedule,
//       publishTime: data.publishTime,
//     }));
//     setCreatePostStep(2);
//   };

//   const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
//     e?.stopPropagation();
//     setFormData({});
//     setCreatePostStep(0);
//     setCreatingPost(false);
//     reset();
//   };

//   const scheduleWatch = watch("publishSchedule");

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
//         <h3 className="font-lato-bold text-gray-700 text-xl">Publish Post</h3>
//         <div className="flex flex-col gap-2 mb-2">
//           <label htmlFor="now" className="flex">
//             <input
//               {...register("publishSchedule", { required: true })}
//               type="radio"
//               value="now"
//               id="now"
//               name="publishSchedule"
//               className="appearance-none"
//             />{" "}
//             <span className="bg-white rounded-lg shadow border border-zinc-200 flex flex-colr gap-2 p-4 grow font-lato-bold text-gray-700">
//               Post Immediately
//             </span>
//           </label>
//           <label htmlFor="later" className="flex">
//             <input
//               {...register("publishSchedule", { required: true })}
//               type="radio"
//               value="later"
//               id="later"
//               name="publishSchedule"
//               className="appearance-none"
//               onSelect={() => setSchedulePost(true)}
//             />{" "}
//             <span className="bg-white rounded-lg shadow border border-zinc-200 flex flex-colr gap-2 p-4 grow font-lato-bold text-gray-700">
//               Schedule Post
//             </span>
//           </label>
//           {scheduleWatch === "later" && (
//             <div className="flex flex-col items-center gap-2">
//               <BsChevronDown />
//               <div className="bg-white rounded-lg shadow border border-zinc-200 flex flex-col gap-2 p-4 grow font-lato-regular text-gray-700 w-full">
//                 <div className="flex flex-col gap-2">
//                   <span>Date</span>
//                   <div></div>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <span>Time</span>
//                   <div></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="flex flex-col gap-2">
//           {errors.publishSchedule && (
//             <span className="font-lato-regular text-base text-error">
//               One of the above options must be chosen.
//             </span>
//           )}
//           <Button variant={"brand-primary"} disabled>
//             <input type="submit" value="Continue" />
//           </Button>
//           <Button
//             variant={"brand-secondary"}
//             onClick={() => {
//               if (scheduleWatch) {
//                 setFormData((prevState) => ({
//                   ...prevState,
//                   publishSchedule: scheduleWatch,
//                 }));
//               }
//               setCreatePostStep(1);
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

// export default PublisherSelectForm;
