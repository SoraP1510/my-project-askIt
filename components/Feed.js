import React, { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Post from "./Post";

function Feed({ searchTerm }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("post")
        .select(
          `
          *,
          comment(id),
          categories(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
        return;
      }

      // กรองโพสต์โดยใช้ searchTerm จาก title หรือ categories.topic
      const filtered = searchTerm
        ? data.filter((post) => {
            const titleMatch = post.title
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
            const categoryMatch = post.categories?.topic
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
            return titleMatch || categoryMatch;
          })
        : data;

      // เพิ่มจำนวนคอมเมนต์
      const postsWithCounts = filtered.map((post) => ({
        ...post,
        comments: post.comment?.length || 0,
      }));

      setPosts(postsWithCounts);
      setLoading(false);
    };

    fetchPosts();
  }, [searchTerm]);

  return (
    <div className="mt-5 space-y-4">
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p className="text-center text-gray-400">No posts found.</p>
      )}
    </div>
  );
}

export default Feed;
