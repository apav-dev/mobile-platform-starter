import { twMerge } from "tailwind-merge";

export const renderEntityText = (entityText: string, className?: string) => {
  // if any parts of the string are wrapped [[]] , the text should be white on gray-700 background
  const isWhiteText = entityText.includes("[[") && entityText.includes("]]");
  const textParts = entityText.split("[[").flatMap((part) => {
    if (part.includes("]]")) {
      const [whiteText, blackText] = part.split("]]");
      return [whiteText, blackText];
    }
    return part;
  });

  return (
    <div className={twMerge("text-gray-700 font-lato-regular", className)}>
      {textParts.map((part, index) => {
        if (isWhiteText && index % 2 === 1) {
          return (
            <span
              key={index}
              className="text-white bg-gray-500 px-1 py-0.5 rounded-[3px]"
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </div>
  );
};
