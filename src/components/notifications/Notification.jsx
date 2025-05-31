import React from "react";
import { ArrowIcon, CloseIcon, NotificationIcon } from "../../svg";

const Notification = () => {
  return (
    <div className="h-[90px] dark:bg-darkBg3 flex items-center p-[13px]">
      <div className="w-full flex items-center justify-between">
        {/* left */}
        <div className="flex items-center gap-x-4">
          <NotificationIcon className={"dark:fill-blue1"} />
          <div className="flex flex-col">
            <span className="text-gray-100 tracking-wide text-md">
              Get New Messages Notification
            </span>
            <span className="flex gap-1 items-center text-sm tracking-tight text-gray-400">
              Turn on notification
              <ArrowIcon className={"dark:fill-darkSvg2 mt-1"} />
            </span>
          </div>
        </div>
        {/* right */}
        <div className="">
          <CloseIcon className={"dark:fill-darkSvg2"} />
        </div>
      </div>
    </div>
  );
};

export default Notification;
