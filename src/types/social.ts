export interface FormData {
  publisher?: "GOOGLEMYBUSINESS" | "FACEBOOK";
  postText?: string;
  photoUrl?: string | undefined;
  googleCtaUrl?: string;
  googleCtaType?:
    | "BOOK"
    | "ORDER"
    | "BUY"
    | "LEARN_MORE"
    | "SIGN_UP"
    | "CALL"
    | undefined;
  googleCtaPhone?: string;
  publishSchedule?: "now" | "later";
  publishTime?: string;
  publishDate?: Date;
  readyToSubmit?: boolean;
}
