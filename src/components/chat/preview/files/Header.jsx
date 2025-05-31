import React from "react";
import { CloseIcon } from "../../../../svg";
import { useDispatch, useSelector } from "react-redux";
import { clearFiles } from "../../../../app/features/chatSlice";

const Header = ({ activeIndex }) => {
  const dispatch = useDispatch();
  const { files } = useSelector((store) => store.chat);
  const clearFilesHandler = () => {
    dispatch(clearFiles());
  };
  return (
    <div className="w-full items-center justify-between flex">
      <div className="cursor-pointer" onClick={() => clearFilesHandler()}>
        <CloseIcon />
      </div>
      <h1 className="dark:text-darkText1 text-[15px]">
        {files[activeIndex].file?.name}
      </h1>
      <span />
    </div>
  );
};

export default Header;
