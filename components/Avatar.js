import { useSession } from "next-auth/react";
import React from "react";

function Avatar({ seed, large }) {
  //  ใช้ next-auth เพื่อตรวจสอบ session ของผู้ใช้ที่ล็อกอิน
  const { data: session } = useSession();

  //  สร้างชื่อ seed สำหรับใช้สร้างรูป avatar จาก DiceBear
  // ถ้ามี prop seed ให้ใช้เลย, ถ้าไม่มีใช้ชื่อผู้ใช้จาก session, ถ้าไม่มีอีกใช้ "placeholder"
  const nameSeed = encodeURIComponent(
    seed || session?.user?.name || "placeholder"
  );

  return (
    //  กล่องรูป Avatar: ปรับขนาดตาม prop `large`, มี border และเป็นวงกลม
    <div className={`relative overflow-hidden rounded-full border border-gray-300 bg-white ${ large ? "h-20 w-20" : "h-10 w-10"}`}>
      <img
        alt="User Avatar"
        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${nameSeed}`}
        className="object-cover w-full h-full" //  ให้รูปเต็มพื้นที่กล่อง
      />
    </div>
  );
}

export default Avatar;
