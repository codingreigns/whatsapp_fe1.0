import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../app/features/chatSlice";

const ContactIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z" />
  </svg>
);

const CloseIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
  </svg>
);

const ShareIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
  </svg>
);

const AddIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
  </svg>
);

const ContactAttachment = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [showContactForm, setShowContactForm] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    notes: "",
  });

  // Handle manual contact creation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createVCard = (contact) => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.firstName} ${contact.lastName}`.trim(),
      contact.firstName && `N:${contact.lastName};${contact.firstName};;;`,
      contact.phone && `TEL:${contact.phone}`,
      contact.email && `EMAIL:${contact.email}`,
      contact.company && `ORG:${contact.company}`,
      contact.notes && `NOTE:${contact.notes}`,
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    return vcard;
  };

  const handleManualContactShare = () => {
    if (
      !formData.firstName &&
      !formData.lastName &&
      !formData.phone &&
      !formData.email
    ) {
      setError("Please fill in at least name, phone, or email");
      return;
    }

    try {
      const vcard = createVCard(formData);
      const fileName = `${formData.firstName || "Contact"}-${
        formData.lastName || Date.now()
      }.vcf`;

      // Create a File object
      const file = new File([vcard], fileName, {
        type: "text/vcard",
        lastModified: Date.now(),
      });

      // Convert to data URL
      const dataUrl = `data:text/vcard;base64,${btoa(vcard)}`;

      dispatch(
        addFiles({
          file: file,
          imageData: dataUrl,
          type: "vcard",
        })
      );

      // Reset form and close
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        company: "",
        notes: "",
      });
      setShowContactForm(false);
      setError(null);
    } catch (err) {
      setError("Failed to create contact: " + err.message);
    }
  };

  // Handle contact file import
  const handleFileImport = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (
        !file.type.includes("vcard") &&
        !file.name.toLowerCase().endsWith(".vcf")
      ) {
        setError("Please select a valid contact file (.vcf)");
        return;
      }

      if (file.size > 1024 * 1024) {
        // 1MB limit
        setError("Contact file too large (max 1MB)");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        dispatch(
          addFiles({
            file: file,
            imageData: e.target.result,
            type: "vcard",
          })
        );
      };
    });

    // Reset input
    e.target.value = "";
  };

  // Handle Web Share API contact sharing (if supported)
  const handleWebShare = async () => {
    if (!navigator.share || !navigator.canShare) {
      setError("Sharing not supported on this device");
      return;
    }

    try {
      // Request contact access if available
      if ("contacts" in navigator && "ContactsManager" in window) {
        const contacts = await navigator.contacts.select(
          ["name", "tel", "email"],
          { multiple: true }
        );

        contacts.forEach((contact) => {
          const contactData = {
            firstName: contact.name?.[0] || "",
            lastName: contact.name?.[1] || "",
            phone: contact.tel?.[0] || "",
            email: contact.email?.[0] || "",
            company: "",
            notes: "",
          };

          const vcard = createVCard(contactData);
          const fileName = `${contactData.firstName || "Contact"}.vcf`;

          const file = new File([vcard], fileName, {
            type: "text/vcard",
            lastModified: Date.now(),
          });

          const dataUrl = `data:text/vcard;base64,${btoa(vcard)}`;

          dispatch(
            addFiles({
              file: file,
              fileData: dataUrl,
              type: "vcard",
            })
          );
        });
      } else {
        setError(
          "Contact access not available. Please use manual entry or file import."
        );
      }
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Contact access denied");
      } else {
        setError("Failed to access contacts: " + err.message);
      }
    }
  };

  const handleContactClick = () => {
    setShowContactForm(true);
    setError(null);
  };

  // Contact form modal
  if (showContactForm) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Share Contact</h3>
            <button
              onClick={() => {
                setShowContactForm(false);
                setError(null);
              }}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Contact Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleManualContactShare}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShareIcon />
              Share Contact
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors text-sm"
              >
                Import File
              </button>

              {navigator.contacts && (
                <button
                  onClick={handleWebShare}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors text-sm"
                >
                  From Device
                </button>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".vcf,text/vcard"
            onChange={handleFileImport}
            multiple
            hidden
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors">
      <button
        className="hover:cursor-pointer"
        type="button"
        onClick={handleContactClick}
      >
        <div className="flex gap-3">
          <div className="w-5 h-5 text-blue-400">
            <ContactIcon />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white text-sm">Contact</span>
            {error && (
              <span className="text-red-400 text-xs mt-1 max-w-32 truncate">
                {error}
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default ContactAttachment;
