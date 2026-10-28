import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

const TopHeader = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(qParam);

  // Synchronize input value with URL param when URL changes or upon refresh
  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    navigate("/dashboard");
  };

  return (
    <div className="sticky top-0 z-40 bg-[#f1f1f1] px-8 py-4 flex items-center justify-between">
      {/* Search Form */}
      <div className="flex-1 mr-6 ml-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-[#e9e9e9] rounded-full px-5 py-3 hover:bg-[#e2e2e2] transition focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 focus-within:shadow-sm"
        >
          <Search size={18} className="text-gray-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm font-medium text-gray-900"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="p-1 hover:bg-gray-200 text-gray-500 hover:text-black rounded-full transition ml-2 flex-shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>

      {/* Profile Section */}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default TopHeader;
