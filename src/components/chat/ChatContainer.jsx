import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { useDispatch, useSelector } from "react-redux";
import { getConversationMessages } from "../../app/features/chatSlice";
import ChatActions from "./ChatActions";
import { getConversationId } from "../../utils/chats";
import FilesPreview from "./preview/files/FilesPreview";

const ChatContainer = ({ onlineUsers, typing }) => {
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.user);
  const { access_token } = user;
  const values = {
    token: access_token,
    convoId: activeConversation?._id,
  };
  useEffect(() => {
    if (activeConversation?._id) dispatch(getConversationMessages(values));
  }, [activeConversation]);

  return (
    <div className="relative h-full w-full border-l dark:border-darkBorder2 select-none overflow-hidden">
      {/* container */}
      <div>
        {/* header */}
        <ChatHeader
          online={onlineUsers.find((u) =>
            u.userId === getConversationId(user, activeConversation.users)
              ? true
              : false
          )}
        />
        {files?.length > 0 ? (
          <FilesPreview />
        ) : (
          <>
            {/* messages */}
            <ChatMessages typing={typing} />
            {/* chatActions */}
            <ChatActions />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
