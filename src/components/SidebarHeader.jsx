import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from "../svg";
import Menu from "./Menu";

const SidebarHeader = () => {
  const { user } = useSelector((store) => store.user);
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="h-[50px] dark:bg-darkBg2 flex items-center px-[16px]">
      {/* container */}
      <div className="w-full flex items-center justify-between">
        {/* userImg */}
        <button className="btn">
          <img
            className="rounded-full w-full h-full object-cover"
            src={user.picture}
            alt="profile phote"
          />
        </button>
        {/* user icons */}
        <ul className="flex items-center gap-x-2.5">
          <li>
            <button className="btn">
              <CommunityIcon className={"dark:fill-darkSvg1"} />
            </button>
          </li>
          {/* story */}
          <li>
            <button className="btn">
              <StoryIcon className={"dark:fill-darkSvg1"} />
            </button>
          </li>
          {/* chat */}
          <li>
            <button className="btn">
              <ChatIcon className={"dark:fill-darkSvg1"} />
            </button>
          </li>
          {/* group */}
          <li className="relative" onClick={() => setShowMenu((prev) => !prev)}>
            <button className={`btn ${showMenu ? "bg-darkHover1" : ""}`}>
              <DotsIcon className={"dark:fill-darkSvg1"} />
            </button>
            {showMenu ? <Menu /> : null}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarHeader;
