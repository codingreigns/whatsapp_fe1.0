import React from "react";
import { useSelector } from "react-redux";
import { DotsIcon, SearchLargeIcon } from "../../svg";

const ChatHeader = ({ online }) => {
  const { activeConversation } = useSelector((store) => store.chat);
  const { name, picture } = activeConversation;

  return (
    <div className="h-[90px] dark:bg-darkBg2 flex items-center p-[8px] select-none ">
      {/* container */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {/* image */}
          <button className="btn">
            <img
              className="w-full h-full rounded-full object-cover"
              src={picture}
              alt="profile picture"
            />
          </button>
          <div className="flex flex-col">
            <h1 className="dark:text-white text-md font-bold capitalize">
              {name.split(" ")[0]}
            </h1>
            <span className="text-xs dark:text-darkSvg2">
              {online ? "online" : ""}
            </span>
          </div>
        </div>
        {/* right side */}
        <ul className="flex items-center gap-x-2.5">
          <li>
            <button className="btn">
              <SearchLargeIcon className={"dark:fill-darkSvg1"} />
            </button>
          </li>
          <li>
            <button className="btn">
              <DotsIcon className={"dark:fill-darkSvg1"} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
