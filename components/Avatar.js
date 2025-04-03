import { useSession } from "next-auth/react";
import React from "react";

function Avatar({ seed, large }) {
  const { data: session } = useSession();
  const nameSeed = encodeURIComponent(
    seed || session?.user?.name || "placeholder"
  );

  return (
    <div
      className={`relative overflow-hidden rounded-full border border-gray-300 bg-white ${
        large ? "h-20 w-20" : "h-10 w-10"
      }`}
    >
      <img
        alt="User Avatar"
        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${nameSeed}`}
        className="object-cover w-full h-full"
      />
    </div>
  );
}

export default Avatar;
