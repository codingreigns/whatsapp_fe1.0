import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .matches(/^[a-zA-Z]*$/, "No special characters allowed in your name")
    .min(2, "Name must be atleast 2 characters long")
    .max(16, "Name must be less than 16 characters long"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email address is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Your password must have minimum 8 characters in length. At least one uppercase English letter. At least one lowercase English letter. At least one digit. At least one special character."
    ),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email address is required"),
  password: Yup.string().required("Password is required"),
});
