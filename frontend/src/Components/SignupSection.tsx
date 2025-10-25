import React from "react";

const SignupSection: React.FC = () => {
  return (
    <section className="relative py-20 text-white">
      <img
        src="/assets/food-grid-bg.jpg"
        alt="food grid"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold mb-6">Sign up to get your ideas</h2>
        <form className="max-w-md mx-auto bg-white text-gray-900 rounded-xl p-8 shadow-lg space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Create a password"
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            placeholder="Date of birth"
            className="w-full border p-2 rounded"
          />
          <button className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition">
            Continue
          </button>
          <p className="text-sm text-gray-600">
            Or{" "}
            <span className="text-red-600 cursor-pointer">
              Continue with Google
            </span>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupSection;
