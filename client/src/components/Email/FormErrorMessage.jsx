import React from "react";

const FormErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-2 text-sm text-red-700 rounded">
      {message}
    </div>
  );
};

export default FormErrorMessage;
