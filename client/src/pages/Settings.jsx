import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", birthDate: "", gender: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.email) {
      axiosInstance
        .get(`/api/users/email/${user.email}`)
        .then((res) => {
          const u = res.data.data;
          setForm({
            name: u.name || "",
            birthDate: u.birthDate ? u.birthDate.slice(0, 10) : "",
            gender: u.gender || "",
          });
        })
        .catch(() => setError("Failed to load user info"));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.put(`/api/users/${user.id}`, form);
      if (form.password) {
        await axiosInstance.put(
          `/api/auth/update-password/email/${user.email}`,
          {
            password: form.password,
          }
        );
      }
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Leave blank to keep current password"
            autoComplete="new-password"
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
