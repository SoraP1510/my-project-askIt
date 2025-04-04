import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient"; 
import Post from "../components/Post";

function SearchPage() {
  const router = useRouter(); // ใช้เข้าถึง query string จาก URL
  const { q } = router.query; // ดึงค่าการค้นหาจาก query parameter ชื่อว่า q
  const [posts, setPosts] = useState([]); // สร้าง state เพื่อเก็บผลลัพธ์การค้นหา

  useEffect(() => {
    if (!q) return; // ถ้ายังไม่มี query ไม่ต้องทำอะไร

    const fetchSearchResults = async () => {
      // ดึงข้อมูลจากตาราง post พร้อมข้อมูล categories
      const { data, error } = await supabase
        .from("post")
        .select("*, categories(*)")
        .or(`title.ilike.%${q}%,categories.topic.ilike.%${q}%`); // ค้นหา title หรือ categories.topic ที่มีข้อความตรงกับ q

      if (error) {
        console.error("Search error:", error); // แสดง error ถ้ามีปัญหา
      } else {
        setPosts(data); // เซ็ตข้อมูลโพสต์ที่ค้นเจอ
      }
    };

    fetchSearchResults(); // เรียกฟังก์ชันเมื่อ q เปลี่ยนค่า
  }, [q]); // ทำงานทุกครั้งที่ q มีการเปลี่ยนแปลง

  return (
    <div className="max-w-4xl mx-auto px-4 py-6"> {/* คอนเทนเนอร์ตรงกลางหน้าจอ */}
      <h1 className="text-2xl font-bold mb-4">
        Search results for: <span className="text-blue-600">"{q}"</span> {/* แสดงข้อความค้นหาที่ใช้ */}
      </h1>

      {posts.length === 0 ? ( // ถ้าไม่พบโพสต์
        <p className="text-gray-500">No results found.</p> // แสดงข้อความไม่มีผลลัพธ์
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />) // แสดงรายการโพสต์ที่ค้นเจอ
      )}
    </div>
  );
}

export default SearchPage;
