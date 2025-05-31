import React from "react";

const FormInputs = ({ name, type, register, placeholder, error }) => {
  return (
    <div className="mt-8 content-center dark:text-darkText1 space-y-1 ml-2 mr-2">
      {/* <label
        htmlFor={name}
        className="text-sm font-bold tracking-wide text-center"
      >
        {placeholder}
      </label> */}
      <input
        className="w-full dark:bg-darkBg3 text-base py-2 px-4 outline-green-300 rounded-lg"
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FormInputs;
