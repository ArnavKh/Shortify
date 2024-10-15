import Image from 'next/image';
import Link from 'next/link';
import axios from "axios";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const [username, setUsername] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const pathname = usePathname(); // Get current route
    const router = useRouter(); // Initialize router

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

    const isActive = (href: string) => (pathname === href ? 'bg-gradient-to-br from-[#F84E9D] to-[#FF7375]' : 'bg-secondary');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission
        if (searchTerm) {
            // Redirect to the search results page with the query
            router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
            setSearchTerm(""); // Clear the search term
        }
    };

    return (
        <header className="flex justify-between items-center w-full p-4 bg-primary fixed z-50 font-textFont">
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

            <form onSubmit={handleSearch} className="flex items-center justify-center">
                <input
                    type="text"
                    placeholder="Search for videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-[22rem] w-full p-3 border-2 rounded-full border-secondary bg-secondary focus:outline-none focus:border-[#F84E9D]"
                />
                <button type="submit" className="ml-2 p-3 rounded-full bg-secondary hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                        <path d="M17.5 17.5L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </button>
            </form>

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

            <nav className="hidden lg:flex space-x-4">
                <Link href="/" passHref>
                    <button className={`p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/')}`} title="Home">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                            <path d="M9 22L9.00192 17.9976C9.00236 17.067 9.00258 16.6017 9.15462 16.2347C9.35774 15.7443 9.74746 15.3547 10.2379 15.1519C10.6051 15 11.0704 15 12.001 15V15C12.9319 15 13.3974 15 13.7647 15.152C14.2553 15.355 14.645 15.7447 14.848 16.2353C15 16.6026 15 17.0681 15 17.999V22" stroke="currentColor" stroke-width="1.5" />
                            <path d="M7.08848 4.76243L6.08847 5.54298C4.57181 6.72681 3.81348 7.31873 3.40674 8.15333C3 8.98792 3 9.95205 3 11.8803V13.9715C3 17.7562 3 19.6485 4.17157 20.8243C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8243C21 19.6485 21 17.7562 21 13.9715V11.8803C21 9.95205 21 8.98792 20.5933 8.15333C20.1865 7.31873 19.4282 6.72681 17.9115 5.54298L16.9115 4.76243C14.5521 2.92081 13.3724 2 12 2C10.6276 2 9.44787 2.92081 7.08848 4.76243Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                    </button>
                </Link>
                <Link href="/profile" passHref>
                    <button className={`p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/profile')}`} title="Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                            <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" stroke-width="1.5" />
                        </svg>
                    </button>
                </Link>
                <Link href="/trending" passHref>
                    <button className={`p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/trending')}`} title="Trending">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                            <path d="M13.8561 22C26.0783 19 19.2338 7 10.9227 2C9.9453 5.5 8.47838 6.5 5.54497 10C1.66121 14.6339 3.5895 20 8.96719 22C8.1524 21 6.04958 18.9008 7.5 16C8 15 9 14 8.5 12C9.47778 12.5 11.5 13 12 15.5C12.8148 14.5 13.6604 12.4 12.8783 10C19 14.5 16.5 19 13.8561 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </Link>
                <Link href="/likedVideos" passHref>
                    <button className={`p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/likedVideos')}`} title="Liked Videos">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                            <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                    </button>
                </Link>
                <Link href="/recommend" passHref>
                    <button className={`p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/recommend')}`} title="Recommended Videos">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                            <path d="M2.50012 7.5H21.5001" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            <path d="M17.0001 2.5L14.0001 7.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            <path d="M10.0001 2.5L7.00012 7.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5" />
                            <path d="M14.9531 14.8948C14.8016 15.5215 14.0857 15.9644 12.6539 16.8502C11.2697 17.7064 10.5777 18.1346 10.0199 17.9625C9.78934 17.8913 9.57925 17.7562 9.40982 17.57C9 17.1198 9 16.2465 9 14.5C9 12.7535 9 11.8802 9.40982 11.4299C9.57925 11.2438 9.78934 11.1087 10.0199 11.0375C10.5777 10.8654 11.2697 11.2936 12.6539 12.1498C14.0857 13.0356 14.8016 13.4785 14.9531 14.1052C15.0156 14.3639 15.0156 14.6361 14.9531 14.8948Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                    </button>
                </Link>

                <Link href="" passHref>
                    <button
                        onClick={onLogout}
                        className="p-3 rounded-full bg-secondary hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]" title="Logout"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                            <path d="M15 17.625C14.9264 19.4769 13.3831 21.0494 11.3156 20.9988C10.8346 20.987 10.2401 20.8194 9.05112 20.484C6.18961 19.6768 3.70555 18.3203 3.10956 15.2815C3 14.723 3 14.0944 3 12.8373L3 11.1627C3 9.90561 3 9.27705 3.10956 8.71846C3.70555 5.67965 6.18961 4.32316 9.05112 3.51603C10.2401 3.18064 10.8346 3.01295 11.3156 3.00119C13.3831 2.95061 14.9264 4.52307 15 6.37501" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M21 12H10M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </Link>
            </nav>

            {isMenuOpen && (
                <nav className="lg:hidden absolute top-16 right-4 bg-primary shadow-md rounded-md flex flex-col space-y-4 p-4 border-2 border-secondary mt-4">
                    <Link href="/" passHref>
                        <button className='flex items-center'>
                            <span className={`flex p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/')}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none" className=''>
                                    <path d="M9 22L9.00192 17.9976C9.00236 17.067 9.00258 16.6017 9.15462 16.2347C9.35774 15.7443 9.74746 15.3547 10.2379 15.1519C10.6051 15 11.0704 15 12.001 15V15C12.9319 15 13.3974 15 13.7647 15.152C14.2553 15.355 14.645 15.7447 14.848 16.2353C15 16.6026 15 17.0681 15 17.999V22" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M7.08848 4.76243L6.08847 5.54298C4.57181 6.72681 3.81348 7.31873 3.40674 8.15333C3 8.98792 3 9.95205 3 11.8803V13.9715C3 17.7562 3 19.6485 4.17157 20.8243C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8243C21 19.6485 21 17.7562 21 13.9715V11.8803C21 9.95205 21 8.98792 20.5933 8.15333C20.1865 7.31873 19.4282 6.72681 17.9115 5.54298L16.9115 4.76243C14.5521 2.92081 13.3724 2 12 2C10.6276 2 9.44787 2.92081 7.08848 4.76243Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span className='pl-2'>Home</span>
                        </button>
                    </Link>
                    <Link href="/profile" passHref>
                        <button className='flex items-center'>
                            <span className={`flex p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/profile')}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                                    <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" stroke-width="1.5" />
                                </svg>
                            </span>
                            <span className='pl-2'>Profile</span>
                        </button>
                    </Link>
                    <Link href="/trending" passHref>
                        <button className='flex items-center'>
                            <span className={`flex p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/trending')}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
                                    <path d="M13.8561 22C26.0783 19 19.2338 7 10.9227 2C9.9453 5.5 8.47838 6.5 5.54497 10C1.66121 14.6339 3.5895 20 8.96719 22C8.1524 21 6.04958 18.9008 7.5 16C8 15 9 14 8.5 12C9.47778 12.5 11.5 13 12 15.5C12.8148 14.5 13.6604 12.4 12.8783 10C19 14.5 16.5 19 13.8561 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span className='pl-2'>Trending</span>

                        </button>
                    </Link>
                    <Link href="/likedVideos" passHref>
                        <button className='flex items-center'>
                            <span className={`flex p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/likedVideos')}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                                    <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                </svg>
                            </span>
                            <span className='pl-2'>Liked Videos</span>
                        </button>
                    </Link>
                    <Link href="/recommend" passHref>
                        <button className='flex items-center'>
                            <span className={`flex p-3 rounded-full hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] ${isActive('/recommend')}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                                    <path d="M2.50012 7.5H21.5001" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                    <path d="M17.0001 2.5L14.0001 7.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                    <path d="M10.0001 2.5L7.00012 7.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M14.9531 14.8948C14.8016 15.5215 14.0857 15.9644 12.6539 16.8502C11.2697 17.7064 10.5777 18.1346 10.0199 17.9625C9.78934 17.8913 9.57925 17.7562 9.40982 17.57C9 17.1198 9 16.2465 9 14.5C9 12.7535 9 11.8802 9.40982 11.4299C9.57925 11.2438 9.78934 11.1087 10.0199 11.0375C10.5777 10.8654 11.2697 11.2936 12.6539 12.1498C14.0857 13.0356 14.8016 13.4785 14.9531 14.1052C15.0156 14.3639 15.0156 14.6361 14.9531 14.8948Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span className='pl-2'>Recommended Videos</span>
                        </button>
                    </Link>

                    <Link href="" passHref>
                        <button onClick={onLogout} className="flex items-center">
                            <span className={`flex p-3 rounded-full bg-secondary hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                                    <path d="M15 17.625C14.9264 19.4769 13.3831 21.0494 11.3156 20.9988C10.8346 20.987 10.2401 20.8194 9.05112 20.484C6.18961 19.6768 3.70555 18.3203 3.10956 15.2815C3 14.723 3 14.0944 3 12.8373L3 11.1627C3 9.90561 3 9.27705 3.10956 8.71846C3.70555 5.67965 6.18961 4.32316 9.05112 3.51603C10.2401 3.18064 10.8346 3.01295 11.3156 3.00119C13.3831 2.95061 14.9264 4.52307 15 6.37501" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <path d="M21 12H10M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span className='pl-2'>Log Out</span>
                        </button>
                    </Link>
                </nav>
            )}
        </header>
    );
};

export default Header;
