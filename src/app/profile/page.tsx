
"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Image from "next/image";
import Script from "next/script"
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/userModel"






export default function ProfilePage() {
    const router = useRouter()
    const [data, setData] = React.useState("")

    const [username, setusername] = React.useState("")


    useEffect(()=>{
        async function fetchUsername() {
            try{
                const response = await axios.post("/api/users/getUsername")
                setusername(response.data.username)
            }catch(error){
                console.error("Error fetching username: ",error)
                toast.error("Failed to fetch user data");
            }
        }
        fetchUsername();
    },[])
    
    

    return (
        <main className="flex min-h-screen flex-col items-center bg-black text-white">
            {/* Header */}
            <div className="flex justify-between w-full p-4 bg-gray-900">
                <div className="flex items-center gap-5">
                    <Image
                        className="logo"
                        src="/logo.svg" // Replace with your logo or YouTube-like logo
                        alt="Logo"
                        width={100}
                        height={50}
                        
                    />
                    <h2>{username}</h2>
                </div>
                <nav className="flex space-x-8">
                    <Link href="/">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Home</button>
                    </Link>
                    <Link href="/profile">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">DashBoard</button>
                    </Link>
                    <Link href="/content">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Content</button>
                    </Link>
                    <Link href="/trending">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Analytics</button>
                    </Link>
                </nav>
            </div>
        </main>  
    )
}
