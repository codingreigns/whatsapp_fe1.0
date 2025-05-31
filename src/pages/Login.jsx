import React from "react";
import LoginForm from "../components/Auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="h-screen dark:bg-darkBg1 flex items-center justify-center   overflow-hidden">
      {/* container */}
      <div className="flex w-[1600px] mx-auto h-full  ">
        {/* register form */}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
