import React from "react";
import { dateHandler } from "../../utils/dates";
import { useDispatch, useSelector } from "react-redux";
import { openCreateConversation } from "../../app/features/chatSlice";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../../utils/chats";
import SocketContext from "../../context/SocketContext";

const Conversation = ({ convo, socket, online, typing }) => {
  const { user } = useSelector((store) => store.user);
  const { activeConversation } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const { access_token } = user;

  const values = {
    receiverId: getConversationId(user, convo.users),
    token: access_token,
  };
  const openConversation = async () => {
    let res = await dispatch(openCreateConversation(values));
    socket.emit("join conversation", res.payload._id);
  };
  const convoName = getConversationName(user, convo.users);
  const convoPic = getConversationPicture(user, convo.users);

  return (
    <li
      className={`list-none h-[72px] w-full bg-amber-200 dark:bg-darkBg1 hover:${
        convo._id === activeConversation._id ? "" : "dark:bg-darkBg2"
      } cursor-pointer dark:text-darkText1 px-[10px] ${
        convo._id === activeConversation._id ? "dark:bg-darkHover1" : ""
      }`}
      onClick={() => openConversation()}
    >
      {/* container */}
      <div className="relative flex items-center w-full justify-between py-[10px]">
        {/* left */}
        <div className="flex items-center gap-x-3">
          <div
            className={`relative max-w-[50px] w-[50px] rounded-full overflow-hidden ${
              online ? "ring-[2px] ring-green-500" : ""
            }`}
          >
            <img
              className="w-full h-full object-cover"
              src={convoPic}
              alt="conversation image"
            />
          </div>
          <div className="w-full flex flex-col">
            {/* conversation name */}
            <h1 className="font-bold flex items-center gap-x-2">{convoName}</h1>
            {/* message */}
            <div>
              <div className="flex items-center gap-x-1 dark:text-darkText2">
                <div className="flex -1 items-center gap-x-1 dark:text-darkText2">
                  {typing === convo._id ? (
                    <p className="text-green-600">Typing...</p>
                  ) : (
                    <p>
                      {convo.latestMessage?.message?.length > 24
                        ? `${convo?.latestMessage?.message.subString(0, 24)}...`
                        : convo?.latestMessage?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="flex flex-col gap-y-4 items-end text-xs">
          <span className="dark:text-darkText2">
            {convo?.latestMessage?.createdAt
              ? dateHandler(convo.latestMessage?.createdAt)
              : ""}
          </span>
        </div>
      </div>
      {/* border */}
      <div className="ml-16 border-b dark:border-b-darkBorder1" />
    </li>
  );
};

const ConversationWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Conversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ConversationWithSocket;
