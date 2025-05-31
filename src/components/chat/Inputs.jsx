import { useState } from "react";
import { useSelector } from "react-redux";
import SocketContext from "../../context/SocketContext";

const Inputs = ({ message, setMessage, textRef, socket }) => {
  const [typing, setTyping] = useState(false);
  const { activeConversation } = useSelector((store) => store.chat);

  const onChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", activeConversation._id);
    }
    let lastTypingTime = new Date().getTime();
    let timer = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let diff = timeNow - lastTypingTime;
      if (diff >= timer && typing) {
        socket.emit("stop typing", activeConversation._id);
        setTyping(false);
      }
    }, timer);
  };
  return (
    <div className="w-full">
      <input
        type="text"
        className="dark:bg-darkHover1 dark:text-darkText1 outline-none h-[45px] w-full flex-1 rounded-lg pl-4"
        placeholder="Type a message"
        value={message}
        onChange={onChangeHandler}
        ref={textRef}
      />
    </div>
  );
};

const InputsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Inputs {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default InputsWithSocket;
