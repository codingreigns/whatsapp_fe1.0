import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";

const Register = () => {
  return (
    <div className=" dark:bg-darkBg1 flex items-center justify-center py-[19px] overflow-hidden">
      {/* container */}
      <div className="flex w-[1600px] mx-auto h-full">
        {/* register form */}
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
