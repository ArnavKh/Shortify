// import Image from "next/image";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
//         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           Get started by editing&nbsp;
//           <code className="font-mono font-bold">src/app/page.tsx</code>
//         </p>
//         <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
//           <a
//             className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{" "}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className="dark:invert"
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
//         <Image
//           className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className="mb-3 text-2xl font-semibold">
//             Docs{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className="m-0 max-w-[30ch] text-sm opacity-50">
//             Find in-depth information about Next.js features and API.
//           </p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className="mb-3 text-2xl font-semibold">
//             Learn{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className="m-0 max-w-[30ch] text-sm opacity-50">
//             Learn about Next.js in an interactive course with&nbsp;quizzes!
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className="mb-3 text-2xl font-semibold">
//             Templates{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className="m-0 max-w-[30ch] text-sm opacity-50">
//             Explore starter templates for Next.js.
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className="mb-3 text-2xl font-semibold">
//             Deploy{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   );
// }
"use client"

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function Home() {

  const router = useRouter()

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

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between w-full p-4 bg-gray-900">
        <div className="flex items-center">
          <Image
            src="/logo.svg" // Replace with your logo or YouTube-like logo
            alt="Logo"
            width={100}
            height={50}
          />
        </div>
        <nav className="flex space-x-8">
          <Link href="/profile">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              Profile
            </button>
          </Link>
          <div>
          <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                >
                    Logout
                </button>
        
          </div>
          <Link href="/trending">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              Trending
            </button>
          </Link>
          <Link href="/likedVideos">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              Liked Videos
            </button>
          </Link>
          <Link href="/uploadVideo">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              Upload Videos
            </button>
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mt-8">
        <h1 className="text-3xl font-bold mb-6">Recommended Videos</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sample Video Cards */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/video1-thumbnail.jpg" // Replace with actual video thumbnail
              alt="Video 1"
              width={300}
              height={200}
              className="w-full"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">Video Title 1</h2>
              <p className="text-gray-400">Channel Name</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/video2-thumbnail.jpg" // Replace with actual video thumbnail
              alt="Video 2"
              width={300}
              height={200}
              className="w-full"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">Video Title 2</h2>
              <p className="text-gray-400">Channel Name</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/video3-thumbnail.jpg" // Replace with actual video thumbnail
              alt="Video 3"
              width={300}
              height={200}
              className="w-full"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">Video Title 3</h2>
              <p className="text-gray-400">Channel Name</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full p-4 bg-gray-900 mt-12">
        <p className="text-center text-gray-500">© 2024 Your Website</p>
      </footer>
    </main>
  );
}
