import { type ReactNode } from "react";
import Sidebar from "../Components/Sidebar";
import TopHeader from "../Components/TopHeader";
import ToastContainer from "../Components/ToastContainer";
import { NotificationsProvider } from "../context/NotificationsContext";
import { useClerkSync } from "../hooks/useClerkSync";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isSynced } = useClerkSync();

  return (
    <NotificationsProvider enabled={isSynced}>
      <div className="flex bg-[#f1f1f1] min-h-screen">
        <Sidebar />

        <div className="ml-20 flex-1 flex flex-col">
          <TopHeader />
          <main className="flex-1 px-8 pb-10 pt-4">{children}</main>
        </div>

        <ToastContainer />
      </div>
    </NotificationsProvider>
  );
};

export default DashboardLayout;
