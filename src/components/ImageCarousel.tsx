import {  GalleryImage } from "../types/yext";
import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import * as React from "react";
import { Image } from "@yext/sites-components";
import { LeftChevronIcon } from "./icons/LeftChevronIcon";
import { RightChevronIcon } from "./icons/RightChevronIcon";

export interface ImageCarouselProps {
  images: GalleryImage[];
}

// TODO: Handle images that don't take full width
// TODO: Figure out why I can't use Yext Image component
// TODO: Address larger breakpoints
const ImageCarousel = ({ images }: ImageCarouselProps) => {
  let [index, setIndex] = useState(0);

  return (
    <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
      <div className="relative overflow-hidden">
        <motion.div className="flex" animate={{x : `-${index * 100}%`}}>
          {images.slice(1).map((image, i) => (
            // <Image image={image} layout="fixed" width={310} height={180} className="mx-auto" />
            <img src={image.image.url} className="object-cover aspect-3/2 max-h-80"/>
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
  );
};

export default ImageCarousel;