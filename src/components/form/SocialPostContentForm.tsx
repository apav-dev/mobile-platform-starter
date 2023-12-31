import * as React from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../Textarea";
import { Button } from "../Button";
import { usePageContext } from "../utils/useSocialPageContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form/Form";
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
import { v4 as uuidv4 } from "uuid";
import { uploadImageToCloudinary } from "../../utils/api";
import { toast } from "../utils/useToast";
import { TrashIcon } from "../icons/TrashIcon";
import { Card } from "../Card";
import { Input } from "../Input";
import { useTranslation } from "react-i18next";
import { checkAndOptimizeImageSize } from "../../utils/imageUtils";
import { FadeLoader } from "react-spinners";

type UploadType = "none" | "url" | "file";

const SocialPostContentForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<UploadType>("none");

  const [imagePreviewLoading, setImagePreviewLoading] =
    useState<boolean>(false);

  const {
    formData,
    setFormData,
    setCreatePostStep,
    setCreatingPost,
    setSchedulePost,
    setCloudinaryDeleteToken,
  } = usePageContext();
  const { t } = useTranslation();

  const FormSchema = z.object({
    postText: z
      .string()
      .max(formData.publisher === "GOOGLEMYBUSINESS" ? 1500 : 5000, {
        message: t("Maximum length exceeded"),
      }),
    photoUrl: z.string().url().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      photoUrl: formData.photoUrls && formData.photoUrls,
      postText: formData.postText && formData.postText,
    },
  });

  const currentPhoto = form.watch("photoUrl");

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setFormData((prevState) => ({
      ...prevState,
      postText: data.postText,
      photoUrls: data.photoUrl,
    }));
    setCreatePostStep(3);
  };

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setFormData({});
    setCreatePostStep(0);
    setCreatingPost(false);
    setSchedulePost(false);
    form.reset();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    form.setValue("photoUrl", undefined);
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadType === "file") {
      const file = e.target.files?.[0];

      if (file) {
        setImagePreviewLoading(true);
        uploadImageToCloudinary(file)
          .then((response) => {
            setCloudinaryDeleteToken(response.delete_token);
            if (response.bytes > 5000000) {
              checkAndOptimizeImageSize(
                `http://res.cloudinary.com/${YEXT_PUBLIC_CLOUDINARY_ENV_NAME}/image`,
                response.public_id
              ).then((optimizedUrl) => {
                setImagePreview(optimizedUrl);
                setImagePreviewLoading(false);
              });
            } else {
              setImagePreview(response.secure_url);
              setImagePreviewLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
            toast({
              variant: "destructive",
              title: t("Failed to upload image"),
              description: t("Please choose a different image"),
            });
          });
      }
    } else if (uploadType === "url") {
      setImagePreview(e.target.value);
    }
  };

  const handleAddImage = (e) => {
    if (imagePreview) {
      form.setValue("photoUrl", imagePreview);
    } else {
      toast({
        variant: "destructive",
        title: t("Failed to upload image"),
        description: t("Please choose a different image"),
      });
    }
    setImagePreview(null);
    setUploadType("none");
  };

  const maxContentLength =
    formData.publisher === "GOOGLEMYBUSINESS" ? 1500 : 5000;

  const watchText = form.watch("postText", formData.postText || "");
  const watchPhoto = form.watch("photoUrl", formData.photoUrls || undefined);

  return (
    <Form {...form}>
      <h2 className="font-lato-bold text-xl text-gray-700">
        {t("Post Content")}
      </h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="font-lato-regular flex flex-col gap-8 text-base text-gray-700"
      >
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="postText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Text")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("Add Text")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="self-end text-sm text-gray-500 font-lato-regular">{`${t(
            "Characters remaining"
          )}: ${maxContentLength - watchText.length}`}</div>
        </div>
        <div className="flex flex-col gap-2">
          <Dialog
            onOpenChange={() => {
              setUploadType("none");
              setImagePreview(null);
            }}
            defaultOpen={false}
          >
            <DialogTrigger
              disabled={currentPhoto ? true : false}
              className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular disabled:opacity-50"
            >
              {`+ ${t("Add Media")}`}
            </DialogTrigger>
            <DialogContent className="overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-sm p-6">
              <DialogHeader>
                <DialogTitle className="font-lato-regular text-left">
                  {t("Add Photo")}
                </DialogTitle>
              </DialogHeader>
              {uploadType === "none" && (
                <>
                  <DialogDescription className="font-lato-regular text-left">
                    {t("How would you like to add a photo?")}
                  </DialogDescription>
                  <div className="grid w-full max-w-sm items-center gap-1.5 xs:grid-cols-2">
                    <button
                      type="button"
                      className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular"
                      onClick={() => setUploadType("url")}
                    >
                      {t("Add from URL")}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular"
                      onClick={() => setUploadType("file")}
                    >
                      {t("Upload a File")}
                    </button>
                  </div>
                </>
              )}

              {uploadType === "url" && (
                <>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input
                      id="new-image-url"
                      type="text"
                      placeholder={t("Enter URL")}
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
              {uploadType === "file" && (
                <>
                  {imagePreviewLoading && (
                    <div className="flex justify-center items-center gap-2">
                      <FadeLoader color="#E1E5E8" />
                    </div>
                  )}
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
              {uploadType !== "none" && (
                <DialogFooter className="flex-col gap-y-4">
                  <DialogTrigger
                    type="button"
                    className="px-4 py-3 bg-gray-700 rounded-[3px] justify-center items-center gap-2 flex w-full text-white font-lato-regular disabled:opacity-50"
                    onClick={(e) => handleAddImage(e)}
                    disabled={!imagePreview}
                  >
                    {t("Add Photo")}
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
                      {t("Cancel")}
                    </DialogTrigger>
                  </div>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
          {currentPhoto && (
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <Card key={uuidv4()}>
                  <div className="self-stretch rounded-[3px] justify-between items-center gap-4 flex">
                    <div className="flex gap-x-4">
                      <img
                        // layout="fixed"
                        width={60}
                        height={60}
                        src={field.value}
                      />
                      <div className="flex flex-col justify-center max-w-[120px] xs:max-w-[180px]">
                        {/* This wrapper ensures the maximum width considering the image and some gap */}
                        <span className="text-gray-700 text-base font-lato-bold truncate">
                          {field.value}
                        </span>
                      </div>
                    </div>
                    <div className="w-5 h-5 p-1 justify-center items-center gap-2.5 flex">
                      <button
                        type="button"
                        className="text-gray-700 text-sm font-lato-bold hover:underline"
                        onClick={(e) => handleDelete(e)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            />
          )}
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <Button variant={"brand-primary"}>
            <input type="submit" value={t("Continue")} />
          </Button>
          <Button
            variant={"brand-secondary"}
            onClick={() => {
              if (watchText) {
                setFormData((prevState) => ({
                  ...prevState,
                  postText: watchText,
                  photoUrls: watchPhoto,
                }));
              }
              setCreatePostStep(1);
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
};

export default SocialPostContentForm;
