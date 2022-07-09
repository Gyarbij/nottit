import { Tab } from "@headlessui/react";
import { useState, useRef, useEffect, createRef } from "react";

import { BiImages, BiComment, BiDetail, BiCog, BiPaint } from "react-icons/bi";
import { BsColumnsGap } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import FilterSubs from "../FilterSubs";

import ToggleFilters from "../ToggleFilters";
import CardStyleDemo from "./CardStyleDemo";
import ColumnCardOptions from "./ColumnCardOptions";
import FilterEntities from "./FilterEntities";
import ThemeSelector from "./ThemeSelector";
import Toggles from "./Toggles";

const Settings = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const icons = "w-6 h-6 flex-none ";
  const [categories] = useState({
    Appearance: {
      icon: <BiPaint className={icons} />,
      settings: [
        <label
          key={"theme"}
          className="flex flex-row items-center justify-between w-full p-2 my-2 hover:cursor-pointer"
        >
          <span className="flex flex-col gap-0.5">
            <span>Theme</span>
            <span className="mr-2 text-xs opacity-70">
              Select a theme. System defaults to light or dark from your system
              settings.
            </span>
          </span>
          <div className="flex-none w-24">
            <ThemeSelector />
          </div>
        </label>,
        <label
          key={"card_style"}
          className="flex flex-row items-center justify-between w-full p-2 my-2 hover:cursor-pointer"
        >
          <span className="flex flex-col gap-0.5">
            <span>Card Style</span>
            <span className="mr-2 text-xs opacity-70">
              <CardStyleDemo />
            </span>
          </span>
          <div className="flex-none w-24">
            <ColumnCardOptions mode="cards" />
          </div>
        </label>,
        ...["dimRead", "showAwardings", "showFlairs"].map((s: any) => (
          <Toggles
            key={s}
            setting={s}
            withSubtext={true}
            externalStyles="rounded-lg group hover:bg-th-highlight p-2 cursor-pointer"
          />
        )),
      ],
    },
    Layout: {
      icon: <BsColumnsGap className={icons} />,
      //[
      settings: [
        <label
          key={"column_count"}
          className="flex flex-row items-center justify-between w-full p-2 my-2 hover:cursor-pointer"
        >
          <span className="flex flex-col gap-0.5">
            <span>Column Count</span>
            <span className="mr-2 text-xs opacity-70">
              Sets column count in your feeds. "Auto" changes columns by window
              width
            </span>
          </span>
          <div className="flex-none w-24">
            <ColumnCardOptions mode="columns" />
          </div>
        </label>,

        ...["wideUI", "syncWideUI", "postWideUI", "expandedSubPane"].map(
          (s: any) => (
            <Toggles
              key={s}
              setting={s}
              withSubtext={true}
              externalStyles="rounded-lg group hover:bg-th-highlight p-2 cursor-pointer"
            />
          )
        ),
      ],
      // "auto hide nav bar",
    },
    Media: {
      icon: <BiImages className={icons} />,
      settings: [
        ...[
          "disableEmbeds",
          "preferEmbeds",
          "embedsEverywhere",
          "autoplay",
          "hoverplay",
          "audioOnHover",
          "nsfw",
        ].map((s: any) => (
          <Toggles
            key={s}
            setting={s}
            withSubtext={true}
            externalStyles="rounded-lg group hover:bg-th-highlight p-2 cursor-pointer"
          />
        )),
      ],
    },
    // Cards: {
    //   icon: <BiDetail className={icons} />,
    //   settings: [
    //     "show sub icons",
    //     "dim read cards",
    //     "rounded corners",
    //     "Show text body",
    //   ],
    // },
    Comments: {
      icon: <BiComment className={icons} />,
      settings: [
        ...[
          "showUserIcons",
          "showUserFlairs",
          "collapseChildrenOnly",
          "defaultCollapseChildren",
        ].map((s: any) => (
          <Toggles
            key={s}
            setting={s}
            withSubtext={true}
            externalStyles={
              "rounded-lg group hover:bg-th-highlight p-2 cursor-pointer"
            }
          />
        )),
      ],
    },
    Filters: {
      icon: <FiFilter className={icons} />,
      settings: [
        ...[
          "self",
          "links",
          "images",
          "videos",
          "portrait",
          "landscape",
          "read",
        ].map((f, i) => (
          <div key={f}>
            <ToggleFilters filter={f} withSubtext={true} />
          </div>
        )),
        <div key={"other_filters"} className={"py-1 "}>
          <FilterEntities />
        </div>,
      ],
    },
    Other: {
      icon: <BiCog className={icons} />,
      settings: [
        ...[
          "autoRead",
          // "dimRead",
          "infiniteLoading",
          // "showAwardings",
          // "showFlairs",
        ].map((s: any) => (
          <Toggles
            key={s}
            setting={s}
            withSubtext={true}
            externalStyles="rounded-lg group hover:bg-th-highlight p-2 cursor-pointer"
          />
        )),
      ],
    },
  });

  const refs = Object.keys(categories).reduce((acc, value) => {
    acc[value] = createRef();
    return acc;
  }, {});

  const handleCategoryChange = (id) => {
    refs[id].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Tab.Group
      as={"div"}
      vertical
      className="relative flex w-full max-w-3xl max-h-[80vh]  "
      selectedIndex={selectedIndex}
      onChange={(index) => {
        setSelectedIndex(index);
        handleCategoryChange(Object.keys(categories)[index]);
      }}
    >
      <h1 className="absolute ml-0.5 mr-auto text-xl font-semibold -top-10">
        Settings
      </h1>
      <Tab.List
        className={
          "flex flex-col border rounded-lg overflow-y-auto  py-4 w-16 sm:w-44 px-0 pb-0 flex-none  sm:mr-4 overflow-hidden border-r-0 sm:border-r  rounded-r-none sm:rounded-r-lg bg-th-post border-th-border2 shadow-md "
         + " scrollbar-thin scrollbar-thumb-th-scrollbar scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-track-rounded-full bg-th-post border-th-border2"
        }
      >
        {Object.keys(categories).map((category, i) => (
          <Tab key={category} className={" outline-none "}>
            {({ selected }) => (
              <div
                className={
                  (selected ? " font-bold opacity-100 bg-th-highlight " : "") +
                  " cursor-pointer opacity-50 hover:opacity-80 select-none flex my-1 "
                }
                onClick={() => {
                  refs[category].current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                <div className="w-1 h-12 mt-0 mr-2 bg-th-scrollbar "></div>

                <div className="flex items-center justify-start py-2 pl-1">
                  <span className="">{categories[category]?.icon}</span>
                  <span className="hidden sm:block sm:pl-3">{category}</span>
                </div>
              </div>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels
        className={
          "border  shadow-md  rounded-lg rounded-l-none sm:rounded-l-lg p-2 pt-5   overflow-y-auto  flex-grow select-none outline-none" +
          " scrollbar-thin scrollbar-thumb-th-scrollbar scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-track-rounded-full bg-th-post border-th-border2"
        }
      >
        {Object.keys(categories).map((category, i) => (
          <div
            ref={refs[category]}
            key={category}
            className={" sm:px-5  py-2 pt-6 "}
          >
            <h1 className="text-xl font-semibold ">{category}</h1>
            {categories[category]?.settings?.map((setting) => (
              <div key={setting}>{setting}</div>
            ))}
          </div>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Settings;
