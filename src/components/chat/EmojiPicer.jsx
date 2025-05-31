import React, { useEffect, useState } from "react";
import { CloseIcon, EmojiIcon } from "../../svg";
import EmojiPicker from "emoji-picker-react";

const EmojiPicer = ({
  textRef,
  message,
  setMessage,
  showPicker,
  setShowPicker,
  setShowAttachments,
}) => {
  const [cursorPosition, setCursorPosition] = useState();

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  const handleEmoji = (emojiData) => {
    // e.preventDefault();
    const { emoji } = emojiData;
    const ref = textRef.current;
    ref.focus();
    const start = message.substring(0, ref.selectionStart);
    const end = message.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setMessage(newText);
    setCursorPosition(start.length + emoji.length);
  };
  return (
    <li className="w-full">
      <button
        onClick={() => {
          setShowAttachments(false);
          setShowPicker(!showPicker);
        }}
        type="button"
        className="btn cursor-pointer"
      >
        {showPicker ? (
          <CloseIcon className="dark:fill-darkSvg1 cursor-pointer" />
        ) : (
          <EmojiIcon className="dark:fill-darkSvg1 cursor-pointer" />
        )}
      </button>
      {/* emojis */}
      <div className="openEmojiAnimation absolute bottom-[60px] -left-[0.5px] w-full">
        {showPicker ? (
          <EmojiPicker onEmojiClick={handleEmoji} theme="dark" />
        ) : null}
      </div>
    </li>
  );
};

export default EmojiPicer;
