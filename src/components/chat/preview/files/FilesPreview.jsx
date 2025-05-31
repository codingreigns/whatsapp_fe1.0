import React, { useState } from "react";
import Header from "./Header";
import Input from "./Input";
import FileViewer from "./FileViewer";
import HandleAndSendFile from "./HandleAndSendFile";

const FilesPreview = () => {
  const [message, setMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="relative  py-2 w-full flex items-center justify-center">
      {/* container */}
      <div className="w-full flex flex-col items-center">
        {/* header */}
        <Header activeIndex={activeIndex} />
        {/* viewing */}
        <FileViewer activeIndex={activeIndex} />
        <div className="">
          {/* message input */}
          <Input message={message} setMessage={setMessage} />
          {/* send and change file */}
          <HandleAndSendFile
            message={message}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default FilesPreview;
