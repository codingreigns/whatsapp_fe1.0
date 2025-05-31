import React from "react";
import { Logo } from "../../svg";

const WhatsappHome = () => {
  return (
    <div className=" dark:bg-darkBg3 select-none border-l dark:border-darkBorder1 border-b-[6px] border-b-green1">
      {/* container */}
      <div className="-mt-1.5 w-full h-full flex flex-col gap-y-8 items-center justify-center">
        <span>
          <Logo />
        </span>
        {/* info */}
        <div className="mt-1 space-y-[12px] text-center">
          <h1 className="text-[32px] dark:text-darkText4 font-extralight">
            WhatsApp
          </h1>
          <p className="text-sm dark:text-darkText3">
            Get in touch with your friends...
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappHome;
