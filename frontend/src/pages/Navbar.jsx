import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <nav className="w-full h-14 bg-base-100 text-base-content flex items-center justify-between px-6 shadow-md">

      <div className="text-xl font-semibold tracking-wide">HeyChat</div>

      <div className="flex items-center gap-6">
        <a href="/profile" className="flex items-center gap-2 hover:text-gray-300 transition">
          <FaUserCircle size={18} />
          <span className="hidden sm:block">Profile</span>
        </a>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;