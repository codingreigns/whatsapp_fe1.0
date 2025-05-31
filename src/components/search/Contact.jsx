import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openCreateConversation } from "../../app/features/chatSlice";
import SocketContext from "../../context/SocketContext";

const Contact = ({ contact, setSearchResults, socket }) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { access_token } = user;

  const values = {
    receiverId: contact._id,
    token: access_token,
  };
  const openConversation = async () => {
    let res = await dispatch(openCreateConversation(values));
    socket.emit("join conversation", res.payload._id);
    setSearchResults([]);
  };
  return (
    <li
      onClick={() => openConversation()}
      className="list-none h-[72px] hover:bg-darkBg2 cursor-pointer dark:text-darkText1"
    >
      {/* container */}
      <div className="flex items-center gap-x-3">
        <div className="relative max-w-[50px] w-[50px] rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={contact.picture}
            alt="conversation image"
          />
        </div>
        <div className="w-full flex flex-col">
          {/* conversation name */}
          <h1 className="font-bold flex items-center gap-x-2">
            {contact.name}
          </h1>
          {/* message */}
          <div>
            <div className="flex items-center gap-x-1 dark:text-darkText2">
              <div className="flex -1 items-center gap-x-1 dark:text-darkText2">
                <p>{contact.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-16 border-b dark:border-b-darkBorder1" />
    </li>
  );
};

const ContactWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Contact {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContactWithSocket;
