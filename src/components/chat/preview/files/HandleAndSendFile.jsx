import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFiles,
  removeFileFromFiles,
  sendMessage,
} from "../../../../app/features/chatSlice";
import { uploadFiles } from "../../../../utils/upload";
import SocketContext from "../../../../context/SocketContext";
import { SendIcon } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { CloseIcon } from "../../../../svg";
import Add from "./Add";

function HandleAndSend({ activeIndex, setActiveIndex, message, socket }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { files, activeConversation } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.user);
  const { access_token } = user;
  //send message handler
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    //uplaod files first
    const uploaded_files = await uploadFiles(files);
    //send the message
    const values = {
      token: access_token,
      message,
      convoId: activeConversation?._id,
      files: uploaded_files.length > 0 ? uploaded_files : [],
    };
    try {
      let newMsg = await dispatch(sendMessage(values));
      socket.emit("send message", newMsg.payload);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  //Handle remove file
  const handleRemoveFile = (index) => {
    dispatch(removeFileFromFiles(index));
  };
  return (
    <div className="w-[97%] flex items-center justify-between mt-2 border-t dark:border-dark_border_2">
      {/*Empty*/}
      <span></span>
      {/*List files*/}
      <div className="flex items-center gap-x-2">
        {files?.map((file, i) => (
          <div
            key={i}
            className={`fileThumbnail border-none relative w-14 h-14   mt-2 rounded-md overflow-hidden cursor-pointer
            ${activeIndex === i && "border"}
            `}
            onClick={() => setActiveIndex(i)}
          >
            {file?.type === "IMAGE" ? (
              <img
                src={file?.fileData}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : file?.type === "VIDEO" ? (
              <video src={file?.fileData} controls />
            ) : file?.type === "AUDIO" ? (
              <audio src={file?.fileData} controls />
            ) : (
              <img
                src={`../../../../images/file/${file?.type}.png`}
                alt=""
                className="w-8 h-10 mt-1.5 ml-2.5"
              />
            )}
            {/*Remove file icon*/}
            <div className="" onClick={() => handleRemoveFile(i)}>
              <CloseIcon className="dark:fill-white absolute right-0 top-0 w-4 h-4" />
            </div>
          </div>
        ))}
        {/* Add another file */}
        <Add setActiveIndex={setActiveIndex} />
      </div>
      {/*Send button*/}
      <button
        className="bg-green_1 w-16 h-16 mt-2 rounded-full flex items-center justify-center cursor-pointer"
        onClick={async (e) => {
          await sendMessageHandler(e);
          await dispatch(clearFiles());
        }}
      >
        {loading ? (
          <ClipLoader color="#E9EDEF" size={25} />
        ) : (
          <SendIcon className="fill-white" />
        )}
      </button>
    </div>
  );
}

const HandleAndSendWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <HandleAndSend {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default HandleAndSendWithContext;
