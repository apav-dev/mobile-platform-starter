import i18next from "i18next";
import moment from "moment";

export const formatUtcToLocal = (input: number): string => {
  const inputDate = moment.utc(input);
  // const parsedDate = moment(inputDate);
  // return parsedDate.toString();
  const localizedDate = inputDate.local();
  return i18next.t("intlDateTime", {
    val: localizedDate,
    formatParams: {
      val: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    },
  });
};
