import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";
import { Send, Star, Inbox } from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";
import EmailList from "../components/Email/EmailList";
import getSocket from "../components/Socket";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) return;

      socket.emit("join", { userEmail: user.email, socketId: socket.id });

      axios
        .get(`${BACKEND_URL}/api/notifications/receiver-email/${user.email}`, {
          withCredentials: true,
        })
        .then((response) => {
          setEmails(response.data);
        })
        .catch((err) => console.log(err));

      console.log("Socket connected", socket.id, localStorage.getItem("token"));
    };

    socket.on("connect", handleConnect);

    const handleNotification = (notification) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (notification.receiverEmail === user?.email) {
        setEmails((prev) => [notification, ...prev]);
      }
    };

    socket.on("new_notification", handleNotification);

    // Always fetch emails when Dashboard is mounted or location changes
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      axios
        .get(`${BACKEND_URL}/api/notifications/receiver-email/${user.email}`, {
          withCredentials: true,
        })
        .then((response) => {
          setEmails(response.data);
        })
        .catch((err) => console.log(err));
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new_notification", handleNotification);
    };
  }, [location]);

  const filteredEmails = emails.filter((email) => {
    if (activeTab === "inbox") {
      return email.category === "inbox";
    } else if (activeTab === "social") {
      return email.category === "social";
    } else if (activeTab === "promotions") {
      return email.category === "promotions";
    }
    return true;
  });

  return (
    <MainLayout>
      <div className="h-full">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                activeTab === "inbox"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Inbox size={18} className="mr-2" />
              Inbox
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                activeTab === "social"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Send size={18} className="mr-2" />
              Social
            </button>
            <button
              onClick={() => setActiveTab("promotions")}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                activeTab === "promotions"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Star size={18} className="mr-2" />
              Promotions
            </button>
          </div>
        </div>

        <EmailList emails={filteredEmails} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
