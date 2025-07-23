import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormaData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/register/",
        formData
      );
      console.log("Registration Successful", response.data);
      setErrors({});
      setSuccess(true);
      // navigate("/login");
    } catch (error) {
      setErrors(error.response?.data || {});
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-slate-900 via-gray-800 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white border border-white/10">
        <h3 className="text-3xl font-bold text-center text-cyan-400 mb-6 drop-shadow-md">
          Create an Account
        </h3>

        <form onSubmit={handleRegistration} className="space-y-5">
          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleFormaData}
              className="w-full px-4 py-2 rounded-md border border-cyan-500 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleFormaData}
              className="w-full px-4 py-2 rounded-md border border-cyan-500 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Set Password"
              value={formData.password}
              onChange={handleFormaData}
              className="w-full px-4 py-2 rounded-md border border-cyan-500 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Success Message */}
          {success && (
            <div className="text-green-500 text-center text-sm font-medium animate-pulse">
              🎉 Registration successful! You can now login.
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className={`w-full py-2 rounded-md font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-cyan-500 hover:bg-cyan-600 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
