import Image from "next/image";
import React from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Header({ onSearch }) {
  const { data: session } = useSession();
  const [term, setTerm] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(term); // ✅ ป้องกัน undefined
  };

  return (
    <div className="sticky top-0 z-50 flex items-center bg-white px-4 py-2 shadow-sm">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Link href="/">
          <div className="relative w-20 h-10">
            <Image
              src="https://askit-project.vercel.app/_next/static/media/ASKIT.ea62f01f.svg"
              alt="Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </div>
        </Link>
      </div>

      <div className="mx-7 flex items-center xl:min-w-[300px]"></div>

      {/* ✅ Search box พร้อม submit */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 items-center space-x-2 rounded-sm border border-gray-200 bg-gray-100 px-3 py-1"
      >
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search by title or category"
        />
        <button type="submit" hidden />
      </form>

      {/* เหมือนเดิม... Sign In / Sign Out */}
      <div className="mx-5 hidden items-center space-x-2 text-gray-500 lg:inline-flex">
        <div className="h-9 lg:w-96"></div>
        <hr className="h-10 border border-gray-100" />
      </div>

      <div className="ml-5 flex items-center lg:hidden" />

      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
              alt="Google Icon"
              fill
              className="object-contain"
            />
          </div>

          <div className="flex-1 text-xs">
            <p className="truncate">{session.user?.name}</p>
            <p className="text-gray-400">Sign Out</p>
          </div>
          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
              alt="Google Icon"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  );
}

export default Header;
