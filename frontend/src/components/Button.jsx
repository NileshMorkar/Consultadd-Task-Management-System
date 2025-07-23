import { Link } from "react-router-dom";

function Button({ url, text }) {
  return (
    <Link
      to={url}
      className={`inline-block px-6 py-2 rounded-xl text-white font-medium bg-cyan-600 hover:bg-cyan-700 transition duration-300 shadow-md`}
    >
      {text}
    </Link>
  );
}

export default Button;
