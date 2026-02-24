import { ChevronDown, Search } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

const TopHeader = () => {
  return (
    <div className="sticky top-0 z-50 bg-[#f1f1f1] px-8 py-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 mr-6 ml-2">
        <div className="flex items-center bg-[#e9e9e9] rounded-full px-5 py-3 hover:bg-[#e2e2e2] transition">
          <Search size={18} className="text-gray-500 mr-3 " />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent w-4/5 outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Profile Section */}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default TopHeader;
