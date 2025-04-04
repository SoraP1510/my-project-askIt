import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import React, { useState } from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [searchTerm, setSearchTerm] = useState(""); // สร้าง state เพื่อเก็บคำค้นหา

  return (
    <SessionProvider session={session}> {/* ให้ session ใช้งานได้ทั่วทั้งแอป */}
      <Toaster /> {/* แสดง toast บนทุกหน้า */}
      <div className="h-screen overflow-y-scroll bg-slate-200"> {/* layout พื้นหลังและ scroll */}
        <Header onSearch={setSearchTerm} /> {/* ส่งฟังก์ชัน setSearchTerm ไปยัง Header เพื่อให้แก้ไข searchTerm ได้ */}
        <Component {...pageProps} searchTerm={searchTerm} /> {/* ส่ง props รวมถึง searchTerm ไปให้ทุกหน้าที่ถูก render */}
      </div>
    </SessionProvider>
  );
}

export default MyApp;
