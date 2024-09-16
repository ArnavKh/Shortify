"use client"
import Link from "next/link"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"

export default function LoginPage() {
    const router = useRouter()

    const [user, setUser] = React.useState({
        email: "",
        password: "",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const onLogin = async () => {
        try {
            setLoading(true)
            const response = await axios.post("/api/users/login", user)
            console.log("Logged in Successfully", response.data)
            toast.success("Login Success")
            router.push("/")
        } catch (error: any) {
            console.log("Login failed", error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <div className="flex bg-gradient-to-br from-[#F84E9D] to-[#FF7375]">
            {/* Left subsection for graphics */}
            <div className="md:w-[50%]">
                Hello
            </div>

            {/* Right Subsection for login */}
            <div className="flex flex-col items-start justify-center min-h-screen bg-white md:w-[50%]">

                {/* Login / Signup Box */}
                <div className="bg-white p-8 shadow-lg w-96 text-left ml-[5%]">
                    <h1 className="text-3xl font-bold mb-6 text-start text-black">
                        {loading ? "Processing..." : "Login to Shortify"}
                    </h1>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full p-2 border-b-2 border-gray-300 text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Enter your password"
                            className="w-full p-2 border-b-2 border-gray-300 text-black"
                        />
                    </div>

                    <button
                        onClick={onLogin}
                        disabled={buttonDisabled}
                        className={`w-full p-2 mt-4 text-white rounded-md ${buttonDisabled ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <Link href="/signup" className="block text-center mt-4 text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}
