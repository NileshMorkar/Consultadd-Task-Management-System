import { useContext, useState } from "react";
import { AuthContext } from "../AuthProvider";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";

function Header() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-sky-800 to-cyan-700 text-white px-4 py-4 shadow-lg rounded-b-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span className="text-xl font-bold tracking-wide text-white drop-shadow">
              My Task Manager
            </span>
          </Link>

          {/* Desktop buttons */}
          <div id="hide-buttons" className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-white text-white hover:bg-red-500 hover:border-red-500 rounded-md font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Button
                  text="Login"
                  url="/login"
                />
                <Button
                  text="Register"
                  url="/register"
                />
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Button
                  text="Login"
                  url="/login"
                  className="border border-white text-white hover:bg-white hover:text-cyan-700 px-4 py-2 rounded-md transition"
                />
                <Button
                  text="Register"
                  url="/register"
                  className="bg-white text-cyan-700 hover:bg-cyan-100 px-4 py-2 rounded-md transition font-semibold"
                />
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Header;
