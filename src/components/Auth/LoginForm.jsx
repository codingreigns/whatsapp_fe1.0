import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputs from "./FormInputs";
import AppBtn from "../AppBtn";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../app/features/userSlice";
import Logo from "../../../public/Logo";

const LoginForm = () => {
  const { status, error } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (values) => {
    let res = await dispatch(loginUser({ ...values }));
    if (res?.payload?.user) navigate("/");
  };

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden ">
      {/* container */}
      <div className="max-w-md space-y-8 p-10 dark:bg-darkBg2 rounded-xl">
        {/* heading */}
        <div className="text-center dark:text-darkText1">
          <div className="mr-23 md:mr-26">
            <Logo />
          </div>
          <h2 className="mt-6 text-3xl font-bold ">Welcome Back</h2>
          <p className="mt-2 text-sm">Login</p>
          {error && <p className="text-red-400">{error}</p>}
        </div>
        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormInputs
            name="email"
            type="email"
            placeholder="email"
            register={register}
            error={errors?.email?.message}
          />
          <FormInputs
            name="password"
            type="password"
            placeholder="password"
            register={register}
            error={errors?.password?.message}
          />
          <AppBtn status={status} text={"Login"} />
          <p className="mt-2 flex flex-col  items-center justify-center text-center text-md dark:text-darkText1">
            <span>Don't have an account?</span>
            <Link
              className="dark:text-darkText2 hover:underline cursor-pointer transition duration-300 mb-3"
              // href="/login"
              to={"/register"}
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
