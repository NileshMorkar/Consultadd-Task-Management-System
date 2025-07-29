import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [notSuccess, setNotSuccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleFormaData = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/auth/login",
        loginData
      );
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setNotSuccess(true);
      setIsLoggedIn(true);
      navigate("/");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrors("Invalid Credentials!");
      setNotSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl border border-white/10">
        <h3 className="text-3xl font-bold mb-6 text-center text-cyan-400 drop-shadow-md">
          Login to Your Account
        </h3>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={loginData.username}
              onChange={handleFormaData}
              className="w-full px-4 py-2 rounded-md border border-cyan-500 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              value={loginData.password}
              onChange={handleFormaData}
              className="w-full px-4 py-2 rounded-md border border-cyan-500 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            />
          </div>

          {!notSuccess && (
            <div className="text-red-500 text-sm font-semibold text-center animate-pulse">
              {errors}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md font-semibold transition-all ${loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600 text-white"
                }`}
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
