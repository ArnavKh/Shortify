import Image from 'next/image';
import Link from 'next/link';
import axios from "axios";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'; // New import
import SearchPage from '@/components/search';

interface HeaderProps {
     onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
     const [username, setUsername] = useState("");
     const [isMenuOpen, setIsMenuOpen] = useState(false);
     const pathname = usePathname(); // Get current route

     useEffect(() => {
          async function fetchUsername() {
               try {
                    const response = await axios.post("/api/users/getUserdata");
                    setUsername(response.data.username);
               } catch (error) {
                    console.error("Error fetching username: ", error);
                    toast.error("Failed to fetch user data");
               }
          }
          fetchUsername();
     }, []);

     const toggleMenu = () => {
          setIsMenuOpen((prev) => !prev);
     };

     const isActive = (href: string) => pathname === href ? 'bg-gradient-to-br from-[#F84E9D] to-[#FF7375]' : 'bg-secondary';

     return (
          <header className="flex justify-between w-full p-4 bg-primary fixed z-50 font-textFont">
               <div className="flex items-center">
                    <Link href="/" passHref className="flex items-center">
                         <Image src="/Logo.png" alt="Logo" width={45} height={45} />
                         <h1 className="myGradient inline-block text-transparent bg-clip-text text-3xl font-bold ml-4">
                              Shortify
                         </h1>
                    </Link>

                    {pathname === '/profile' && (
                         <Link href="/profile" passHref className="flex items-center">
                              <h2 className="pl-4">{username}</h2>
                         </Link>
                    )}
               </div>

               <button
                    onClick={toggleMenu}
                    className="lg:hidden text-white focus:outline-none"
               >
                    <svg
                         className="w-6 h-6"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg"
                    >
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16m-7 6h7"
                         />
                    </svg>
               </button>

               <nav className="hidden lg:flex space-x-8">
                    <Link href="/" passHref>
                         <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/')}`}>
                              Home
                         </button>
                    </Link>
                    <Link href="/profile" passHref>
                         <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/profile')}`}>
                              Profile
                         </button>
                    </Link>
                    <Link href="/trending" passHref>
                         <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/trending')}`}>
                              Trending
                         </button>
                    </Link>
                    <Link href="/likedVideos" passHref>
                         <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/likedVideos')}`}>
                              Liked Videos
                         </button>
                    </Link>
                    <Link href="/recommend" passHref>
                         <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/recommend')}`}>
                              Recommended Videos
                         </button>
                    </Link>
                    <SearchPage/>  
                    <Link href="" passHref>
                         <button
                              onClick={onLogout}
                              className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]"
                         >
                              Log Out
                         </button>
                    </Link>
               </nav>

               {isMenuOpen && (
                    <nav className="lg:hidden absolute top-16 right-4 bg-primary shadow-md rounded-md flex flex-col space-y-4 p-4">
                         <Link href="/" passHref>
                              <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/')}`}>
                                   Home
                              </button>
                         </Link>
                         <Link href="/profile" passHref>
                              <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/profile')}`}>
                                   Profile
                              </button>
                         </Link>
                         <Link href="/trending" passHref>
                              <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/trending')}`}>
                                   Trending
                              </button>
                         </Link>
                         <Link href="/likedVideos" passHref>
                              <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/likedVideos')}`}>
                                   Liked Videos
                              </button>
                         </Link>
                         <Link href="/recommend" passHref>
                              <button className={`px-4 py-2 rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/recommend')}`}>
                                   Recommended Videos
                              </button>
                         </Link>
                         <SearchPage/>
                         <Link href="" passHref>
                              <button
                                   onClick={onLogout}
                                   className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]"
                              >
                                   Log Out
                              </button>
                         </Link>
                    </nav>
               )}
          </header>
     );
};

export default Header;
