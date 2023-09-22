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
import { useTranslation } from "react-i18next";

type FooterProps = {
  entityId: string;
};

const Footer = ({ entityId }: FooterProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHidden, setMenuHidden] = useState(true);

  const { t } = useTranslation();

  const footerLinks = [
    {
      icon: HomeIcon,
      title: t("Home"),
      link: "/",
    },
    {
      icon: GraphIcon,
      title: t("Content"),
      link: `content?entityId=${entityId}`,
    },
    {
      icon: StarsIcon,
      title: t("Reviews"),
      link: `reviews?entityId=${entityId}`,
    },
    {
      icon: SocialIcon,
      title: t("Social"),
      link: `social?entityId=${entityId}`,
    },
    {
      icon: AnalyticsIcon,
      title: t("Analytics"),
      link: `analytics?entityId=${entityId}`,
    },
  ];

  return (
    <div className="fixed bottom-0 w-full z-40">
      <motion.div
        className={twMerge(
          "bg-gray-900 z-[5] w-full shadow rounded-t-xl flex-col justify-start items-start gap-1 flex overflow-hidden",
          menuOpen && "px-2 py-4",
          menuHidden && "hidden"
        )}
        initial={false}
        animate={{ y: menuOpen ? 0 : "100%" }}
        exit="closed"
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        onAnimationStart={() => {
          setMenuHidden(false);
        }}
        onAnimationComplete={() => {
          !menuOpen && setMenuHidden(true);
        }}
      >
        {footerLinks.map((link) => (
          <a
            key={link.title}
            className="self-stretch px-2 py-2.5 justify-start items-center gap-2 inline-flex"
            href={link.link}
          >
            <link.icon fillColor="#ffffff" />
            <div className="grow shrink basis-0 text-white text-base font-lato-regular font-bold hover:text-white">
              {link.title}
            </div>
          </a>
        ))}
      </motion.div>
      <div className="bg-gray-900 relative z-10 pl-[15px] w-full pr-1.5 py-2 justify-center items-center gap-4 inline-flex border-t border-gray-700">
        <YextIcon />
        <div className="grow shrink basis-0 text-white text-sm font-bold font-lato-bold">
          {t("Company Name")}
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
