
"use client"
import React from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"

export default function ProfilePage() {
    

    const router = useRouter()

    const [data, setData] = React.useState("")

    const onLogout = async () => {
        try {
            await axios.get("/api/users/logout")
            toast.success("Logout successful")
            router.push("/login")
        } catch (error: any) {
            console.error("Logout failed", error)
            toast.error("Logout failed. Please try again.")
        }
    }

    const getUserData = async() =>{
        const response = await axios.get("/api/users/me")
        console.log(response.data)
        setData(response.data.data._id)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <div className="flex flex-col items-center">
                    <img
                        // src={"user.profilePic"}
                        alt="Profile Picture"
                        className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4"
                    />
                    <h1 className="text-2xl font-bold mb-2 text-center text-black">{"user.username"}</h1>
                    <p className="text-gray-700 mb-4 text-center">{"user.email"}</p>
                </div>
                <h2>{data==="" ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
                <button onClick={getUserData} className="w-full p-2 mt-4 text-white rounded-lg bg-red-500 hover:bg-red-600">get User</button>
                <button
                    onClick={onLogout}
                    className="w-full p-2 mt-4 text-white rounded-lg bg-red-500 hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
