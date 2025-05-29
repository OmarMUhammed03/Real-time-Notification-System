import React, { useEffect, useState, useRef } from "react";
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
  const searchRef = useRef();
  const [search, setSearch] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      if (!user || !user.email) return;

      socket.emit("join", { userEmail: user.email, socketId: socket.id });

      axios
        .get(`${BACKEND_URL}/api/notifications/receiver-email/${user.email}`, {
          withCredentials: true,
        })
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
      axios
        .get(`${BACKEND_URL}/api/notifications/receiver-email/${user.email}`, {
          withCredentials: true,
        })
        .then((response) => {
          setEmails(response.data);
          setFilteredEmails(response.data);
        })
        .catch((err) => console.log(err));
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification", handleNotification);
    };
  }, [location]);

  // Search handler: use backend full-text search
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) {
      setFilteredEmails(emails);
      return;
    }
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/notifications/search/${userEmail}?q=${encodeURIComponent(value)}`,
        { withCredentials: true }
      );
      setFilteredEmails(res.data);
    } catch (err) {
      // Optionally handle error
    }
  };

  let displayEmails = filteredEmails;
  if (location.pathname === "/dashboard") {
    displayEmails = filteredEmails.filter(
      (email) => email.category === "inbox" && email.receiverEmail === userEmail
    );
  } else if (location.pathname === "/starred") {
    displayEmails = filteredEmails.filter(
      (email) => email.category === "starred" && email.receiverEmail === userEmail
    );
  } else if (location.pathname === "/sent") {
    displayEmails = filteredEmails.filter((email) => email.senderEmail === userEmail);
  }

  return (
    <MainLayout>
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
            {/* Search bar */}
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search mail..."
              className="ml-6 flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ maxWidth: 320 }}
            />
          </div>
        </div>
        <EmailList emails={displayEmails} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
