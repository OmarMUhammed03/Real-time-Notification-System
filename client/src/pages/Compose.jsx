import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import ComposeEmail from "../components/Email/ComposeEmail";
import { useNavigate } from "react-router-dom";

const Compose = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <MainLayout>
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="max-w-3xl w-full mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <ComposeEmail
              onClose={handleClose}
              initialTo=""
              initialSubject=""
              initialBody=""
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Compose;
