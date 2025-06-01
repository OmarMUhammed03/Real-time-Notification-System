import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Inbox } from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";
import EmailList from "../components/Email/EmailList";
import getSocket from "../components/Socket";

const Dashboard = ({ search, onSearch }) => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      if (!user || !user.email) return;

      socket.emit("join", { userEmail: user.email, socketId: socket.id });

      axiosInstance
        .get(`/api/notifications/receiver-email/${user.email}`)
        .then((response) => {
          setEmails(response.data);
          setFilteredEmails(response.data);
        })
        .catch((err) => console.log(err));

      console.log("Socket connected", socket.id, localStorage.getItem("token"));
    };

    socket.on("connect", handleConnect);

    const handleNotification = (notification) => {
      if (notification.receiverEmail === user?.email) {
        setEmails((prev) => [notification, ...prev]);
      }
    };

    socket.on("notification", handleNotification);

    if (user && user.email) {
      axiosInstance
        .get(`/api/notifications/receiver-email/${user.email}`)
        .then((response) => {
          console.log("notifications", response.data);
          setEmails(response.data);
          setFilteredEmails(response.data);
        })
        .catch((err) => console.log(err));
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification", handleNotification);
    };
  }, []);

  useEffect(() => {
    if (!search || !search.trim()) {
      setFilteredEmails(emails);
      return;
    }
    const fetchSearch = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/notifications/search/${userEmail}?q=${encodeURIComponent(
            search
          )}`
        );
        setFilteredEmails(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSearch();
  }, [search, emails, userEmail]);

  let displayEmails = filteredEmails;
  if (location.pathname === "/dashboard") {
    displayEmails = filteredEmails.filter(
      (email) => email.category === "inbox" && email.receiverEmail === userEmail
    );
  } else if (location.pathname === "/starred") {
    displayEmails = filteredEmails.filter(
      (email) =>
        email.category === "starred" && email.receiverEmail === userEmail
    );
  } else if (location.pathname === "/sent") {
    displayEmails = filteredEmails.filter(
      (email) => email.senderEmail === userEmail
    );
  }

  return (
    <MainLayout
      search={search}
      onSearch={onSearch}
      unreadCount={
        emails.filter((e) => !e.isRead && e.receiverEmail === userEmail).length
      }
    >
      <div className="h-full">
        <div className="border-b border-gray-200">
          <div className="flex items-center">
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
          </div>
        </div>
        <EmailList emails={displayEmails} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
