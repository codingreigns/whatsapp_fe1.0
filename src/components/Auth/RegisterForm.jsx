import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import FormInputs from "./FormInputs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/Logo";
import { changeStatus, registerUser } from "../../app/features/userSlice";
import AppBtn from "../AppBtn";
import ProfilePictureUpload from "./UploadPicture";
import axios from "axios";
const {
  VITE_CLOUDINARY_API_KEY,
  VITE_CLOUDINARY_CLOUD_NAME,
  VITE_CLOUDINARY_API_SECRET,
} = import.meta.env;

const RegisterForm = () => {
  const { status, error } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [picture, setPicture] = useState();
  const [readablePicture, setReadablePicture] = useState();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signUpSchema) });
  const onSubmit = async (data) => {
    let res;
    dispatch(changeStatus("loading"));
    if (picture) {
      // upload picture to cloudinary
      await uploadImage()
        .then(async (val) => {
          res = await dispatch(
            registerUser({ ...data, picture: val?.secure_url })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res = await dispatch(registerUser({ ...data }));
    }
    if (res?.payload?.user) navigate("/");
  };

  const uploadImage = async () => {
    if (error) return;
    else {
      let formData = new FormData();
      formData.append("upload_preset", "whatsapp");
      formData.append("file", picture);
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/" +
          VITE_CLOUDINARY_CLOUD_NAME +
          "/image/upload",
        formData
      );
      return data;
    }
  };

  return (
    <div className="h-full  w-full flex items-center justify-center overflow-hidden ">
      {/* container */}
      <div className="max-w-xs md:max-w-md space-y-8 p-10 dark:bg-darkBg2 rounded-xl ">
        {/* heading */}
        <div className="text-center dark:text-darkText1 items-center justify-center">
          <div className="hidden md:block">
            <Logo />
          </div>
          <h2 className="mt-6 text-3xl font-bold ">Welcome</h2>
          <p className="mt-2 text-sm">Sign up</p>
          {error && <p className="text-red-400">{error}</p>}
        </div>
        {/* form */}
        <form className="mt-3 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* profile pic */}
          <ProfilePictureUpload
            readablePicture={readablePicture}
            setPicture={setPicture}
            setReadablePicture={setReadablePicture}
          />
          <FormInputs
            name="name"
            type="text"
            placeholder="firstname"
            register={register}
            error={errors?.name?.message}
          />
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
          <div>
            <AppBtn status={status} text={"Sign Up"} />
            <p className="flex mt-2 hover:cursor-pointer">
              <span className="text-darkText2 text-center">
                by signing up you agree with our terms&conditions
              </span>
            </p>
          </div>
          <p className="mt-2 flex flex-col  items-center justify-center text-center text-md dark:text-darkText1">
            <span>I already have an account</span>
            <Link
              className="dark:text-darkText2 hover:underline cursor-pointer transition duration-300 mb-3"
              // href="/login"
              to={"/login"}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
