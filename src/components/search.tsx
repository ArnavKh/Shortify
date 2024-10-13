import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Redirect to the API route with the search term as a query parameter
    router.push(`/api/search?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div>
      {/* <h1>Search Videos</h1> */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or tags"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 text-sm rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] text-white placeholder-gray-400"
        />
        <button type="submit" className="ml-2 px-3 py-1 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3a8 8 0 100 16 8 8 0 000-16zM21 21l-4.35-4.35" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchPage;
