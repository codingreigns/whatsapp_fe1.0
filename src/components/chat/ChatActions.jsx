import React, { useRef, useState } from "react";
import EmojiPicer from "./EmojiPicer";
import Attachments from "./Attachments";
import Inputs from "./Inputs";
import { SendIcon } from "../../svg";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../app/features/chatSlice";
import { ClipLoader } from "react-spinners";
import SocketContext from "../../context/SocketContext";

const ChatActions = ({ socket }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const textRef = useRef();
  const [message, setMessage] = useState("");
  const { activeConversation, status } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.user);
  const { access_token } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const values = {
    message,
    convoId: activeConversation._id,
    files: [],
    token: access_token,
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (values.message.length === 0) return;
    setLoading(true);
    let newMessage = await dispatch(sendMessage(values));
    socket.emit("send message", newMessage.payload);
    setMessage("");
    setLoading(false);
  };

  return (
    <form
      onSubmit={(e) => sendMessageHandler(e)}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute -bottom-6 py-2 px-4 select-none"
    >
      {/*Container*/}
      <div className="w-full flex items-center gap-x-2">
        {/*Emojis and attachpments*/}
        <ul className="flex gap-x-2">
          <EmojiPicer
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setShowAttachments={setShowAttachments}
          />
          <Attachments
            showAttachments={showAttachments}
            setShowAttachments={setShowAttachments}
            setShowPicker={setShowPicker}
          />
        </ul>
        {/*Input*/}
        <Inputs message={message} setMessage={setMessage} textRef={textRef} />
        {/*Send button*/}
        <button type="submit" className="btn">
          {status === "loading" && loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
      </div>
    </form>
  );
};

const ChatActionsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatActions {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatActionsWithSocket;
