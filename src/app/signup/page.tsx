"use client"
import Link from "next/link"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"

export default function SignupPage() {
    const router = useRouter()

    const [user, setUser] = React.useState({
        username: "",
        email: "",
        password: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const onSignUp = async () => {
        try {
            setLoading(true)
            const response = await axios.post("api/users/signup", user)
            console.log("Registered Successfully", response.data)
            router.push("/login")
        } catch (error: any) {
            console.log("Registration failed", error)
            toast.error(error.message)
        } finally { 
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.username.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">
                    {loading ? "Processing..." : "Register"}
                </h1>
                <hr className="mb-4"/>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        placeholder="Enter your username"
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Enter your password"
                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                </div>
                <button
                    onClick={onSignUp}
                    disabled={buttonDisabled}
                    className={`w-full p-2 mt-4 text-white rounded-lg ${buttonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
                <Link href="/login" className="block text-center mt-4 text-blue-500 hover:underline">
                    Already a user? Log in here...
                </Link>
            </div>
        </div>
    )
}
