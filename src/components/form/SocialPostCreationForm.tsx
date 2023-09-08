import * as React from "react";
import { Heading } from "../Heading";
import { SocialIcon } from "../icons/SocialIcon";
import { useForm, SubmitHandler } from "react-hook-form";
import PublisherSelectForm from "./PublisherSelectForm";
import SocialPostContentForm from "./SocialPostContentForm";

const SocialPostCreationForm = ({ entityId }) => {
  const [selectedPublishers, setSelectedPublishers] = React.useState<string[]>(
    []
  );
  const [postContent, setPostContent] = React.useState<string>("");
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  React.useEffect(() => {
    console.log(postContent);
  }, [postContent]);

  function setPublishersFunc(selectedPubs: string[]) {
    setSelectedPublishers(selectedPubs);
  }

  function updateStepFunc() {
    setCurrentStep(currentStep + 1);
  }

  function updatePostContentFunc(content: string) {
    setPostContent(content);
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Heading title={"Create New Post"} icon={<SocialIcon />} />
      <div className="w-full border-t border-gray-400" />
      {currentStep === 1 && (
        <PublisherSelectForm
          updatePublishers={setPublishersFunc}
          updateStep={updateStepFunc}
          currentPubSelection={selectedPublishers}
        />
      )}
      {currentStep === 2 && (
        <SocialPostContentForm
          updatePostContent={updatePostContentFunc}
          updateStep={updateStepFunc}
          currentPostContent={postContent}
        />
      )}
      <ul className="flex justify-around">
        <li
          onClick={() => setCurrentStep(1)}
          className="py-2 px-6 rounded-md bg-gray-300"
        >
          1
        </li>
        <li
          onClick={() => setCurrentStep(2)}
          className="py-2 px-6 rounded-md bg-gray-300"
        >
          2
        </li>
      </ul>
    </div>
  );
};

export default SocialPostCreationForm;
