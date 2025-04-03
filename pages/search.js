import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Post from "../components/Post"; // ถ้าใช้คอมโพเนนต์ Post เดิม

function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!q) return;

    const fetchSearchResults = async () => {
      const { data, error } = await supabase
        .from("post")
        .select("*, categories(*)")
        .or(`title.ilike.%${q}%,categories.topic.ilike.%${q}%`); // ✅ ค้นจาก title หรือ categories.topic

      if (error) {
        console.error("Search error:", error);
      } else {
        setPosts(data);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        Search results for: <span className="text-blue-600">"{q}"</span>
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
}

export default SearchPage;
