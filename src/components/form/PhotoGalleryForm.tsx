import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import { Form, FormField, FormLabel } from "./Form";
import { Input } from "../Input";
import { GalleryImage } from "../../types/yext";
import { Card } from "../Card";
import { TrashIcon } from "../icons/TrashIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog";
import { useState } from "react";
import { usePageContext } from "../utils/usePageContext";
import { v4 as uuidv4 } from "uuid";
import { uploadImageToCloudinary } from "../../utils/api";
import { toast } from "../utils/useToast";

export interface PhotoGalleryFormProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  initialImages?: GalleryImage[];
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
}

type UploadType = "none" | "url" | "file";

export const PhotoGalleryForm = React.forwardRef<
  HTMLInputElement,
  PhotoGalleryFormProps
>(({ className, type, id, label, initialImages, onCancel, ...props }, ref) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<UploadType>("none");

  const { setFormData } = usePageContext();

  const ThumbnailSchema = z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
  });

  const ComplexImageTypeSchema = z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
    sourceUrl: z.string().optional(),
    thumbnails: z.array(ThumbnailSchema).optional(),
  });

  const GalleryImageSchema = z.object({
    image: ComplexImageTypeSchema,
  });

  const formSchema = z.object({
    [id]: z.array(GalleryImageSchema),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [id]: initialImages ?? [],
    },
  });

  // 2. Define a submit handler.
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated
    console.log(values);
    setFormData((prev) => ({
      ...prev,
      [id]: values[id],
    }));
    form.reset();
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    form.resetField(id);
    onCancel?.(e);
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.stopPropagation();
    const images = form.getValues(id);
    images.splice(index, 1);
    form.setValue(id, images);
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadType === "file") {
      const file = e.target.files?.[0];

      if (file) {
        uploadImageToCloudinary(file)
          .then((response) => {
            // setImagePreview(response.secure_url);
            // console.log(response);
            setImagePreview(response.secure_url);
          })
          .catch((error) => {
            console.log(error);
            toast({
              variant: "destructive",
              title: "Failed to upload image",
              description: "Please choose a different image.",
            });
          });
      }
    } else if (uploadType === "url") {
      setImagePreview(e.target.value);
    }
  };

  const handleAddImage = (e) => {
    const images = form.getValues(id);
    images.push({
      image: {
        url: imagePreview || "",
        width: 0,
        height: 0,
        sourceUrl: "",
        thumbnails: [],
      },
    });
    form.setValue(id, images);
    setImagePreview(null);
    setUploadType("none");
  };

  return (
    <Form {...form}>
      <FormLabel className="font-lato-bold text-base">{label}</FormLabel>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 mt-4"
      >
        <Dialog
          onOpenChange={() => {
            setUploadType("none");
            setImagePreview(null);
          }}
          defaultOpen={false}
        >
          <DialogTrigger className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular">
            + Add Media
          </DialogTrigger>
          <DialogContent className="overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-sm p-6">
            <DialogHeader>
              <DialogTitle className="font-lato-regular text-left">
                Add Photo
              </DialogTitle>
            </DialogHeader>
            {uploadType === "none" && (
              <>
                <DialogDescription className="font-lato-regular text-left">
                  How would you like to add a photo?
                </DialogDescription>
                <div className="grid w-full max-w-sm items-center gap-1.5 xs:grid-cols-2">
                  <button
                    type="button"
                    className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular"
                    onClick={() => setUploadType("url")}
                  >
                    Add from URL
                  </button>
                  <button
                    type="button"
                    className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular"
                    onClick={() => setUploadType("file")}
                  >
                    Upload a File
                  </button>
                </div>
              </>
            )}
            {uploadType === "file" && (
              <>
                {imagePreview && (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded-[3px]"
                    />
                  </>
                )}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="new-image"
                    type="file"
                    accept=".jpeg,.jpg,.png"
                    onChange={handleImagePreview}
                  />
                </div>
              </>
            )}
            {uploadType === "url" && (
              <>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="new-image-url"
                    type="text"
                    placeholder="Enter image URL"
                    value={imagePreview || ""}
                    onChange={handleImagePreview}
                  />
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview from URL"
                    className="h-40 w-40 object-cover rounded-[3px]"
                  />
                )}
              </>
            )}
            {uploadType !== "none" && (
              <DialogFooter className="flex-col gap-y-4">
                <DialogTrigger
                  type="button"
                  className="px-4 py-3 bg-gray-700 rounded-[3px] justify-center items-center gap-2 flex w-full text-white font-lato-regular"
                  onClick={(e) => handleAddImage(e)}
                >
                  Add Photo
                </DialogTrigger>
                <div className="px-4 justify-center items-center flex">
                  <DialogTrigger
                    type="button"
                    className="text-blue text-base font-lato-regular hover:underline"
                    // onClick={() => {
                    //   setImagePreview(null);
                    //   setUploadType("none");
                    // }}
                  >
                    Cancel
                  </DialogTrigger>
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => (
            <>
              {field.value.map((galleryImage, index) => (
                <Card key={uuidv4()}>
                  <div className="self-stretch rounded-[3px] justify-between items-center gap-4 flex">
                    <div className="flex gap-x-4">
                      <img
                        // layout="fixed"
                        width={60}
                        height={60}
                        src={galleryImage.image.url}
                      />
                      <div className="flex flex-col justify-center max-w-[120px] xs:max-w-[180px]">
                        {/* This wrapper ensures the maximum width considering the image and some gap */}
                        <span className="text-gray-700 text-base font-lato-bold truncate">
                          {galleryImage.image.url}
                        </span>
                        <span className="text-gray-500 text-sm font-lato-regular">
                          10mb
                        </span>
                      </div>
                    </div>
                    <div className="w-5 h-5 p-1 justify-center items-center gap-2.5 flex">
                      <button
                        type="button"
                        className="text-gray-700 text-sm font-lato-bold hover:underline"
                        onClick={(e) => handleDelete(e, index)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        />
        <button
          formAction="submit"
          className="px-4 py-3 mt-4 bg-gray-700 justify-center items-center flex flex-1 w-full border-none focus:outline-none "
        >
          <div className="text-white text-base font-lato-regular">Save</div>
        </button>
        <div className="px-4 justify-center items-center flex">
          <button
            type="button"
            className="text-blue text-base font-lato-regular hover:underline"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </Form>
  );
});
PhotoGalleryForm.displayName = "PhotoGalleryForm";
