import i18next from "i18next";

export const formatUtcDate = (input: number): string => {
  return i18next.t("intlDateTime", {
    val: new Date(input),
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
