import * as React from "react";
import { motion } from "framer-motion";

export interface EditPanelProps {
  open: boolean;
  children?: React.ReactNode;
}

const EditPanel = ({ open, children }: EditPanelProps) => {
  return (
    <motion.div
      initial={false}
      animate={{ y: open ? 0 : "100%" }}
      className="inset-0 fixed bg-white z-10 overflow-y-auto"
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default EditPanel;
