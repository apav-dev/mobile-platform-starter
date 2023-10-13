import { GalleryImage } from "../types/yext";
import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { LeftChevronIcon } from "./icons/LeftChevronIcon";
import { RightChevronIcon } from "./icons/RightChevronIcon";
import { v4 as uuidv4 } from "uuid";

export interface ImageCarouselProps {
  images: GalleryImage[];
}

export const ImageCarousel = ({ images }: ImageCarouselProps) => {
  let [index, setIndex] = useState(0);

  return (
    <div className="flex justify-center">
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="relative overflow-hidden z-0 w-full max-w-sm flex">
          <motion.div className="flex w-96" animate={{ x: `-${index * 100}%` }}>
            {images.map((image, i) => (
              <img
                key={`image-${uuidv4()}`}
                src={image.image.url}
                className="object-cover aspect-3/2 max-h-80 min-w-full"
              />
            ))}
          </motion.div>
          <AnimatePresence initial={false}>
            {index > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0, pointerEvents: "none" }}
                whileHover={{ opacity: 1 }}
                className="absolute left-2 top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                onClick={() => setIndex(index - 1)}
              >
                <LeftChevronIcon />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {index + 1 < images.length && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0, pointerEvents: "none" }}
                whileHover={{ opacity: 1 }}
                className="absolute right-2 top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                onClick={() => setIndex(index + 1)}
              >
                <RightChevronIcon />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </div>
  );
};
