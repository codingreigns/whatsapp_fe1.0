import { TriangleIcon } from "lucide-react";
import moment from "moment";
import React from "react";

const Message = ({ message, me }) => {
  return (
    <div
      className={`w-full flex mt-2 space-x-3 max-w-xs ${
        me ? "ml-auto justify-end" : ""
      }`}
    >
      {/* message container */}
      <div
        className={`relative h-full  dark:text-darkText1 p-2 rounded-lg ${
          me ? "bg-green3" : "dark:bg-darkBg2"
        }`}
      >
        {/* messages */}
        <p className="float-left h-full text-sm pb-4">{message.message}</p>
        {/* dates */}
        <span className="absolute  right-1.5 bottom-1.5  text-xs leading-none text-darkText5">
          {moment(message.createdAt).format("HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default Message;
