import { FaClipboardList, FaBox, FaUserCog, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-orange-500 shadow-md flex flex-col">
      <ul className="mt-4 space-y-1">

        <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <span className="text-2xl font-bold"></span>
                </div>

        <Link to="">
        <li className="flex items-center px-4 py-2 text-white text-xl hover:bg-orange-200 cursor-pointer pt-8">
          <FaClipboardList className="mr-3 text-lg" />
          <span>Profile</span>
        </li>
        </Link>
        
        <Link to="">
        <li className="flex items-center px-4 py-2 text-white text-xl hover:bg-orange-200 cursor-pointer">
          <FaBox className="mr-3 text-lg" />
          <span>Products</span>
        </li>
        </Link>

        <Link to="">
        <li className="flex items-center px-4 py-2 text-white text-xl hover:bg-orange-200 cursor-pointer">
          <FaUsers className="mr-3 text-lg" />
          <span>Customer Messages</span>
        </li>
        </Link>

        
      </ul>
    </div>
  );
};

export default Sidebar;
