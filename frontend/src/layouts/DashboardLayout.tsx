import Sidebar from "../Components/Sidebar";
import { type ReactNode } from "react";
import TopHeader from "../Components/TopHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex bg-[#f1f1f1] min-h-screen">
      <Sidebar />

      <div className="ml-20 flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 px-8 pb-10 pt-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
