import React, { useEffect, useState } from "react";
import { X, Bold, Italic, Underline } from "lucide-react";
import FormErrorMessage from "./FormErrorMessage";
import Cookies from "js-cookie";
import getSocket from "../../components/Socket";

const ComposeEmail = ({
  onClose,
  initialTo = "",
  initialSubject = "",
  initialBody = "",
  replyTo,
}) => {
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState("");

  const socket = getSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!to.trim()) {
      setError("Recipient email is required.");
      return;
    }
    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }
    if (!body.trim()) {
      setError("Message body is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to.trim())) {
      setError("Please enter a valid recipient email address.");
      return;
    }
    console.log(
      "parameters",
      to,
      subject,
      body,
        localStorage.getItem("token"),
      JSON.parse(localStorage.getItem("user")).email,
    );
    socket.emit("notification", {
      senderEmail: JSON.parse(localStorage.getItem("user")).email,
      receiverEmail: to,
      title: subject,
      content: body,
      category: "inbox",
    });
    onClose();
  };

  return (
    <div
      className={`
        bg-white rounded-t-lg shadow-xl flex flex-col fixed
        h-[600px] bottom-0 right-4 w-[500px]
        transition-all duration-300 ease-in-out
        border border-gray-300 overflow-hidden z-50
      `}
    >
      <div className="bg-gray-800 text-white py-2 px-4 flex items-center justify-between rounded-t-lg">
        <h3 className="text-sm font-medium">
          {replyTo ? `Reply to ${replyTo}` : "New Message"}
        </h3>

        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <FormErrorMessage message={error} />
        <div className="p-4 border-b border-gray-200">
          <div className="mb-3">
            <input
              type="text"
              placeholder="To"
              className="w-full px-2 py-1 text-sm border-b border-gray-200 focus:border-blue-500 outline-none"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-2 py-1 text-sm border-b border-gray-200 focus:border-blue-500 outline-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 p-4">
          <textarea
            className="w-full h-full outline-none resize-none text-sm"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Compose your message..."
          ></textarea>
        </div>

        <div className="p-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex space-x-1">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <Bold size={18} />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <Italic size={18} />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <Underline size={18} />
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ComposeEmail;
