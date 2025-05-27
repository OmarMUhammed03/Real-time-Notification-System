import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "../utils/constants";
import { Send, Star, Inbox } from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";
import EmailList from "../components/Email/EmailList";
import ComposeEmail from "../components/Email/ComposeEmail";

const Dashboard = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [activeTab, setActiveTab] = useState("primary");
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) return;
    axios
      .get(`${BACKEND_URL}/api/notifications/receiver-email/${user.email}`, {
        withCredentials: true,
      })
      .then((response) => {
        setEmails(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredEmails = emails.filter((email) => {
    if (activeTab === "primary") {
      return email.category === "primary";
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
              onClick={() => setActiveTab("primary")}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                activeTab === "primary"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Inbox size={18} className="mr-2" />
              Primary
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

        <EmailList
          emails={filteredEmails}
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        />
      </div>

      {showCompose && <ComposeEmail onClose={() => setShowCompose(false)} />}
    </MainLayout>
  );
};

export default Dashboard;
