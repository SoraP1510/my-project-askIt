import Head from "next/head";
import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import PostBox from "../components/PostBox";
import CategoriesRow from "../components/CategoriesRow";

import supabase from "../lib/supabaseClient";

function Home({ searchTerm }) { // รับ props ที่เป็น searchTerm จาก _app.js
  const [topCategories, setTopCategories] = useState([]); // สร้าง state สำหรับเก็บหมวดหมู่ยอดนิยม

  useEffect(() => {
    const fetchTopCategories = async () => {
      // ดึงข้อมูลโพสต์ทั้งหมด พร้อม categories_id
      const { data: posts, error: postError } = await supabase
        .from("post")
        .select("id, categories_id");

      if (postError) {
        console.error("Error fetching posts:", postError); // แสดง error ถ้ามีปัญหา
        return;
      }

      // นับจำนวนโพสต์ในแต่ละ categories_id
      const countMap = {};
      posts.forEach((post) => {
        countMap[post.categories_id] = (countMap[post.categories_id] || 0) + 1;
      });

      // เรียงตามจำนวนโพสต์จากมากไปน้อย และเก็บแค่ 5 อันดับแรก
      const sortedIds = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

      // ดึงข้อมูล categories ที่ตรงกับ id ใน sortedIds
      const { data: Categories, error: subError } = await supabase
        .from("categories")
        .select("*")
        .in("id", sortedIds);

      if (subError) {
        console.error("Error fetching categories:", subError); // แสดง error ถ้าโหลด categories ไม่สำเร็จ
        return;
      }

      // จัดเรียง categories ให้ตรงกับลำดับของ sortedIds
      const sortedCategories = sortedIds
        .map((id) => Categories.find((s) => s.id === Number(id)))
        .filter(Boolean); // กรองค่าที่ undefined ออก

      setTopCategories(sortedCategories); // เซ็ต state ให้ topCategories
    };

    fetchTopCategories(); // เรียกฟังก์ชันตอนโหลดครั้งแรก
  }, []); // ทำงานแค่ครั้งแรกที่โหลดหน้า

  return (
    <>
      <Head>
        <title>AskIt</title> {/* ตั้งชื่อหน้าในแท็บของเบราว์เซอร์ */}
      </Head>

      <div className="mx-auto my-7 max-w-7xl px-4"> {/* คอนเทนเนอร์หลักของหน้า */}
        <PostBox /> {/* กล่องสำหรับสร้างโพสต์ใหม่ */}

        <div className="mt-5 flex flex-col lg:flex-row gap-6"> {/* แบ่ง layout เป็นสองฝั่ง */}
          <div className="flex-1"> {/* พื้นที่ฝั่งซ้ายสำหรับโพสต์ */}
            <Feed searchTerm={searchTerm} /> {/* แสดงโพสต์ทั้งหมดหรือที่ค้นหา */}
          </div>

          <div className="sticky top-36 h-fit w-full max-w-sm rounded-md border border-gray-300 bg-white p-4 lg:block hidden"> {/* กล่องฝั่งขวาแสดง top categories */}
            <p className="text-md mb-3 font-bold">Top Categories</p>
            <div>
              {topCategories.map((Categories, i) => (
                <CategoriesRow
                  key={Categories.id} // ใช้ id เป็น key
                  topic={Categories.topic} // ส่ง topic ไปแสดงใน row
                  index={i} // ส่ง index เพื่อนำไปแสดงลำดับ
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
