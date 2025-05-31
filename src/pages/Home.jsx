import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getConversations, updateMessages } from "../app/features/chatSlice";
import WhatsappHome from "../components/chat/WhatsappHome";
import ChatContainer from "../components/chat/ChatContainer";
import SocketContext from "../context/SocketContext";

const Home = ({ socket }) => {
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { activeConversation } = useSelector((store) => store.chat);
  // join user in the socket
  useEffect(() => {
    socket.emit("join", user._id);
    // online users
    socket.on("online users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    if (user?.access_token) {
      dispatch(getConversations(user.access_token));
    }
  }, [user]);

  useEffect(() => {
    socket.on("receive message", (message) => {
      dispatch(updateMessages(message));
    });
    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop typing", () => setTyping(false));
  }, [socket]);

  return (
    <div className="min-h-screen dark:bg-darkBg1 flex items-center justify-center py-[19px]">
      {/* container */}
      <div className="container flex h-screen">
        {/* sidebar */}
        <Sidebar onlineUsers={onlineUsers} typing={typing} />
        {activeConversation?._id ? (
          <ChatContainer typing={typing} onlineUsers={onlineUsers} />
        ) : (
          <div className="hidden md:h-full md:w-full">
            <WhatsappHome />
          </div>
        )}
      </div>
    </div>
  );
};

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
