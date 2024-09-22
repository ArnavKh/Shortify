import Image from 'next/image';
import Link from 'next/link';
import axios from "axios"
import toast from "react-hot-toast"
import React, { useEffect } from "react"


interface HeaderProps {
     onLogout: () => void;
}




const Header: React.FC<HeaderProps> = ({ onLogout }) => {
     const [username, setusername] = React.useState("")
     useEffect(() => {
          async function fetchUsername() {
               try {
                    const response = await axios.post("/api/users/getUserdata")
                    setusername(response.data.username)
               } catch (error) {
                    console.error("Error fetching username: ", error)
                    toast.error("Failed to fetch user data");
               }
          }
          fetchUsername();
     }, [])

     return (
          <header className="flex justify-between w-full p-4 bg-primary fixed z-50 font-textFont">
               <div className="flex items-center">
                    <Image src="/Logo.png" alt="Logo" width={45} height={45} />
                    <h1 className='myGradient inline-block text-transparent bg-clip-text text-3xl font-bold ml-4'>Shortify</h1>
                    <h2 className='pl-4'>{username}</h2>

               </div>
               <nav className="flex space-x-8">
                    <Link href="/" passHref>
                         <button className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
                              Home
                         </button>
                    </Link>
                    <Link href="/profile" passHref>
                         <button className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
                              Profile
                         </button>
                    </Link>
                    <Link href="/trending" passHref>
                         <button className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
                              Trending
                         </button>
                    </Link>
                    <Link href="/likedVideos" passHref>
                         <button className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
                              Liked Videos
                         </button>
                    </Link>
                    <Link href="">
                         <button
                              onClick={onLogout}
                              className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]"
                         >
                              Log Out
                         </button>
                    </Link>
               </nav>
          </header>
     );
};

export default Header;
