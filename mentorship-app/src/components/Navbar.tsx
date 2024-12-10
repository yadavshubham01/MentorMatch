import { LuUserSearch } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosNotificationsOutline } from "react-icons/io";
import { SlLogin } from "react-icons/sl";
import { CiLogout } from "react-icons/ci";
import { useState, useEffect } from "react";
const APIURL = import.meta.env.VITE_API_URL;


interface Notification {
  id: string;
  read: boolean;
  [key: string]: any; // For other properties you might have
}

const Navbar = () => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(`${APIURL}/api/nsg`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        const unread = data.some((notification: Notification) => !notification.read);
        setHasUnreadNotifications(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-black p-4">
      <div className="flex justify-between items-center">
        <Link
          to="/dashboard"
          className="text-white text-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
        >
          Mentorship Platform
        </Link>
        {/* Hamburger Menu */}
        <button
          className="text-white md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        {/* Navbar links for larger screens */}
        <div className="hidden md:flex flex-row items-center mr-3 gap-5">
          <NavLinks
            hasUnreadNotifications={hasUnreadNotifications}
            handleLogout={handleLogout}
          />
        </div>
      </div>

      {/* Sidebar for smaller screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-start p-5 space-y-5 text-white md:hidden">
          <button
            className="self-end text-2xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✖
          </button>
          <NavLinks
            hasUnreadNotifications={hasUnreadNotifications}
            handleLogout={handleLogout}
          />
        </div>
      )}
    </nav>
  );
};



interface NavLinksProps {
  hasUnreadNotifications: boolean;
  handleLogout: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({
  hasUnreadNotifications,
  handleLogout,
}) => (
  <>
    <div className="flex items-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <SlLogin className="text-white" />
      <Link to="/signin" className="text-white px-2">
        Login
      </Link>
    </div>
    <div className="flex items-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <CgProfile className="text-white" />
      <Link to="/profile" className="text-white px-2">
        Profile
      </Link>
    </div>
    <div className="relative flex items-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <IoIosNotificationsOutline className="text-white" />
      {hasUnreadNotifications && (
        <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full"></span>
      )}
      <Link to="/notification" className="text-white px-2">
        Notification
      </Link>
    </div>
    <div className="flex items-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <LuUserSearch className="text-white" />
      <Link to="/browser" className="text-white px-2">
        Search
      </Link>
    </div>
    <div className="flex items-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <CiLogout className="text-white pr-2 text-2xl" />
      <button
        onClick={handleLogout}
        className="bg-black text-white rounded-md hover:bg-black"
      >
        Logout
      </button>
    </div>
  </>
);

export default Navbar;
