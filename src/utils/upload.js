import axios from "axios";
const {
  VITE_CLOUDINARY_API_KEY,
  VITE_CLOUDINARY_CLOUD_NAME,
  VITE_CLOUDINARY_API_SECRET,
} = import.meta.env;

export const uploadFiles = async (files) => {
  let formData = new FormData();
  formData.append("upload_preset", "whatsapp");
  let uploaded = [];
  for (const f of files) {
    const { file, type } = f;
    formData.append("file", file);
    let res = await uploadToCloudinary(formData);
    uploaded.push({
      file: res,
      type: type,
    });
  }
  return uploaded;
};
const uploadToCloudinary = async (formData) => {
  return new Promise(async function (resolve) {
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        formData
      );
      resolve(data);
    } catch (err) {
      console.log(err);
    }
  });
};
