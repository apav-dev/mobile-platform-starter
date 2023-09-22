import i18next from "i18next";

export const formatUtcToLocal = (input: number): string => {
  return i18next.t("intlDateTime", {
    val: new Date(`${input} UTC`),
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
