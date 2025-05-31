import React from "react";
import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import { getConversationId } from "../../utils/chats";

const Conversations = ({ onlineUsers, typing }) => {
  const { conversations } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.user);
  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter((c) => c.latestMessage)
            .map((convo) => {
              let check = onlineUsers.find(
                (u) => u.userId === getConversationId(user, convo.users)
              );
              return (
                <Conversation
                  key={convo._id}
                  convo={convo}
                  online={check ? true : false}
                  typing={typing}
                />
              );
            })}
      </ul>
    </div>
  );
};

export default Conversations;
