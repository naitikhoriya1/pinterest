const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <header className="absolute top-4 right-4">
        {/* <UserButton afterSignOutUrl="/" /> */}
      </header>
      <h1 className="text-3xl font-bold">Welcome to Your Dashboard!</h1>
      <p className="text-gray-600 mt-2">
        Explore, save, and organize your ideas seamlessly.
      </p>
    </div>
  );
};

export default Dashboard;
