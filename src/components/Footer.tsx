import * as React from "react";
import { useState } from "react";
import { YextIcon } from "./icons/YextIcon";
import { MenuIcon } from "./icons/MenuIcon";
import { twMerge } from "tailwind-merge";
import { GraphIcon } from "./icons/GraphIcon";
import { SocialIcon } from "./icons/SocialIcon";
import { StarsIcon } from "./icons/StarsIcon";
import { AnalyticsIcon } from "./icons/AnalyticsIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { motion } from "framer-motion";
import { XIcon } from "./icons/XIcon";

const footerLinks = [
  {
    icon: HomeIcon,
    title: "Home",
    link: "#",
  },
  {
    icon: GraphIcon,
    title: "Content",
    link: "#",
  },
  {
    icon: SocialIcon,
    title: "Social",
    link: "#",
  },
  {
    icon: StarsIcon,
    title: "Reviews",
    link: "#",
  },
  {
    icon: AnalyticsIcon,
    title: "Analytics",
    link: "#",
  },
];

const Footer = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-0 w-full">
      <motion.div
        className={twMerge(
          "bg-gray-900 w-full shadow rounded-t-xl flex-col justify-start items-start gap-1 flex overflow-hidden",
          menuOpen && "px-2 py-4"
        )}
        initial="closed"
        animate={menuOpen ? "open" : "closed"}
        variants={{
          open: { height: "auto" },
          closed: { height: 0 },
        }}
        exit="closed"
        transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        {footerLinks.map((link) => (
          <a
            key={link.title}
            className="self-stretch px-2 py-2.5 justify-start items-center gap-2 inline-flex"
            href={link.link}
          >
            <link.icon />
            <div className="grow shrink basis-0 text-neutral-400 text-base font-lato-regular font-bold hover:text-white">
              {link.title}
            </div>
          </a>
        ))}
      </motion.div>
      <div className="bg-gray-900 pl-[15px] w-full pr-1.5 py-2 justify-center items-center gap-4 inline-flex border-t border-gray-700">
        <YextIcon />
        <div className="grow shrink basis-0 text-white text-sm font-bold font-lato-bold">
          Company Name
        </div>
        <button
          className="justify-start items-center gap-2 flex z-10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-11 h-11 justify-center items-center flex">
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Footer;
