import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { Suspense, lazy } from "react";
import MainLayout from "./layouts/MainLayout";
import ErrorBoundary from "./Components/ErrorBoundary";

// Lazy load pages
const Home = lazy(() => import("./Pages/Home"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

const App = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <MainLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                isSignedIn ? <Navigate to="/dashboard" replace /> : <Home />
              }
            />
            <Route
              path="/dashboard"
              element={
                <SignedIn>
                  <Dashboard />
                </SignedIn>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default App;
