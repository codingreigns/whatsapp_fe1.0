import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import FancyTypingIndicator from "./Typing";
import FileMessage from "./FileMessage";

const ChatMessages = ({ typing }) => {
  const { messages, activeConversation } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.user);
  const endRef = useRef();

  useEffect(() => {
    endRef.current.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <div className=" bg-[url(/public/pexels-steve-1269968.jpg)] bg-cover bg-no-repeat h-full scrollbar">
      {/* container */}
      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[6%] h-[550px]">
        {/* messages */}
        {messages &&
          messages?.map((message) => (
            <>
              {/* message files */}
              {message?.files?.length > 0
                ? message.files.map((file) => (
                    <FileMessage
                      fileMessage={file}
                      message={message}
                      key={message._id}
                      me={user._id === message?.sender._id}
                    />
                  ))
                : null}
              {/* message text */}
              {message?.message?.length > 0 ? (
                <Message
                  message={message}
                  key={message._id}
                  me={user._id === message?.sender._id}
                />
              ) : null}
            </>
          ))}
        {typing === activeConversation._id && (
          <FancyTypingIndicator typing={typing} />
        )}
        <div className="mb-[100px]" ref={endRef} />
      </div>
    </div>
  );
};

// h-64 overflow-y-auto p-4 border border-gray-300 rounded

export default ChatMessages;
