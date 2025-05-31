import { AttachmentIcon, CloseIcon } from "../../svg";
import AttachmentMenu from "./AttachmentMenu";

const Attachments = ({
  showAttachments,
  setShowAttachments,
  setShowPicker,
}) => {
  return (
    <li className="relative">
      <button
        onClick={() => {
          setShowPicker(false);
          setShowAttachments((prev) => !prev);
        }}
        type="button"
        className="btn"
      >
        {showAttachments ? (
          <CloseIcon className="dark:fill-darkSvg1" />
        ) : (
          <AttachmentIcon className="dark:fill-darkSvg1" />
        )}
      </button>
      {/*Menu*/}
      {showAttachments ? <AttachmentMenu /> : null}
    </li>
  );
};

export default Attachments;
