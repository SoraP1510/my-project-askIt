import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import React, { useState } from "react"; // ✅ เพิ่ม useState

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SessionProvider session={session}>
      <Toaster />
      <div className="h-screen overflow-y-scroll bg-slate-200">
        <Header onSearch={setSearchTerm} />
        <Component {...pageProps} searchTerm={searchTerm} />{" "}
        {/* ✅ ส่งไปทุกหน้า */}
      </div>
    </SessionProvider>
  );
}

export default MyApp;
