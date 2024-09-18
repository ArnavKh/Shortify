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
        <div className="flex font-textFont transition-all duration-500">
            {/* Left subsection for graphics */}
            <div className="myGradient md:w-[40%] lg:w-[50%] hidden md:block">
                <img src="/DoodleGraphic.svg" alt="" className="h-full object-cover" />
            </div>

            {/* Right Subsection for login */}
            <div className="flex flex-col items-start justify-center min-h-screen bg-primary w-full md:w-[60%] lg:w-[50%]">

                {/* Logo */}
                <div className="mx-auto my-8 lg:mx-16 h-32 w-32">
                    <img src="Logo.png" alt="logo" />
                </div>

                {/* Login / Signup Box */}
                <div className=" py-12 px-16 shadow-primary w-full lg:w-auto text-left">
                    <h1 className="text-3xl font-bold mb-6 text-start text-white font-t">
                        {loading ? "Processing..." : <>Log In to <span className="myGradient inline-block text-transparent bg-clip-text">Shortify</span></>}
                    </h1>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-300 text-sm font-medium w-full mb-2 focus:bg-red-500">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="w-full p-2 border-b-2 border-gray-300 bg-secondary lg:w-[28rem]"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full p-2 border-b-2 border-gray-300  bg-secondary lg:w-[28rem]"
                        />
                    </div>

                    <button
                        onClick={onLogin}
                        disabled={buttonDisabled}
                        className={`w-full p-3 my-6 text-white rounded-md ${buttonDisabled
                            ? "bg-secondary cursor-not-allowed"
                            : "myGradient hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] active:scale-95"
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <Link href="/signup" className="block text-center mt-4 text-white">
                        Not on Shortify? <span className="underline myGradient inline-block text-transparent bg-clip-text">Create an account</span>
                    </Link>

                    <Link href="/signup" className="block text-center mt-4 text-white">
                        Forgot Password? <span className="underline myGradient inline-block text-transparent bg-clip-text">Reset</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
