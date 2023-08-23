import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import ContentContainer from "./ContentContainer";
import { twMerge } from "tailwind-merge";

export interface EditPanelProps {
  open: boolean;
  children?: React.ReactNode;
}

const EditPanel = ({ open, children }: EditPanelProps) => {
  const [hidden, setHidden] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ y: open ? 0 : "100%" }}
      className={twMerge(
        "inset-0 absolute bg-white -mx-6 -mb-3 z-10",
        hidden && "hidden",
        hasOverflow && "overflow-y-auto"
        // editMode && "overflow-y-auto"
      )}
      onAnimationStart={() => {
        setHidden(false);
        setHasOverflow(true);
      }}
      onAnimationComplete={() => {
        setHasOverflow(false);
        !open && setHidden(true);
      }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default EditPanel;
