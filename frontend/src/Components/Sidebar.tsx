import { User } from "lucide-react";
import { TiHome } from "react-icons/ti";
import { MdExplore } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaPinterest } from "react-icons/fa";

const Sidebar = () => {
  const iconClass =
    "w-12 h-12 cursor-pointer p-3 rounded-full hover:bg-gray-100 transition";

  const handleCreatePin = () => {
    window.dispatchEvent(new CustomEvent("open-create-pin-modal"));
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-white border-r flex flex-col items-center py-6 gap-6 z-40">
      <div className="text-red-600 font-bold text-2xl mb-4">
        <FaPinterest />
      </div>

      <div title="Home">
        <TiHome className={iconClass} />
      </div>
      <div title="Explore">
        <MdExplore className={iconClass} />
      </div>
      <div title="Dashboard">
        <RiDashboardFill className={iconClass} />
      </div>
      <div title="Create Pin" onClick={handleCreatePin}>
        <FaRegPlusSquare className={`${iconClass} text-[#e60023] hover:bg-red-50`} />
      </div>
      <div title="Notifications">
        <FaBell className={iconClass} />
      </div>
      <div title="Messages">
        <LuMessageCircleMore className={iconClass} />
      </div>

      <div className="mt-auto" title="Profile">
        <User className={iconClass} />
      </div>
    </div>
  );
};

export default Sidebar;
