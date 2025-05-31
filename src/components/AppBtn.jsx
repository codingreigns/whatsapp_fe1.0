import React from "react";
import { HashLoader } from "react-spinners";

const AppBtn = ({ status, text }) => {
  return (
    <button
      className=" w-full flex justify-center bg-green1 px-4 py-2 text-green-100 rounded-xl font-semibold tracking-wider focus:outline-none hover:bg-green2 shadow-lg cursor-pointer transition-colors ease-in duration-300"
      type="submit"
    >
      {status === "loading" ? <HashLoader color="#fff" size={16} /> : text}
    </button>
  );
};

export default AppBtn;
