import React from "react";
import PhotoAttachment from "./PhotoAttachment";
import DocumentAttachment from "./DocumentAttachment";
import AudioAttachment from "./AudioAttachment";
import LocationAttachment from "./LocationAttachment";
import CameraAttachment from "./CameraAttachment";
import ContactAttachment from "./ContactAttachment";

const AttachmentMenu = () => {
  return (
    <div className="bg-gray-700 p-3 h-120 w-60  relative overflow-y-auto overflow-x-hidden">
      <div>
        {/* Document Option */}
        <DocumentAttachment />
        {/* Camera Option */}
        <CameraAttachment />
        {/* Gallery Option */}
        <PhotoAttachment />
        {/* Audio Option */}
        <AudioAttachment />
        {/* Location Option */}
        <LocationAttachment />
        {/* Contact Option */}
        <ContactAttachment />
      </div>
    </div>
  );
};

export default AttachmentMenu;
