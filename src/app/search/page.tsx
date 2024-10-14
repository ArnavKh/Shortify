"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface Video {
    _id: string;
    VideoFile: string; // Use this for the video URL
}

const SearchPage = () => {
    const searchParams = useSearchParams(); // Get search params
    const query = searchParams.get('query'); // Get the query parameter from the URL
    const [searchResults, setSearchResults] = useState<Video[]>([]); // Specify the type of searchResults
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                try {
                    const response = await axios.get(`/api/users/search`, {
                        params: { q: query }
                    });
                    setSearchResults(response.data);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    toast.error("Error fetching search results."); // Display error toast
                } finally {
                    setLoading(false);
                }
            };

            fetchResults();
        } else {
            setLoading(false); // If no query, set loading to false
        }
    }, [query]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex min-h-screen flex-col bg-primary text-white p-0 m-0 font-textFont transition-all duration-500 overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6 mt-24 text-center">Search Results for "{query}"</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {searchResults.length > 0 ? (
                    searchResults.map((video) => (
                        <div key={video._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <video
                                className="w-full max-w-sm h-full object-contain rounded-t-lg" // Adjust height here
                                controls
                                src={video.VideoFile} // Using VideoFile for the video URL
                                style={{ objectFit: 'cover' }} // Prevent video from being cut off
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No results found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
