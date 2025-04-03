import Head from "next/head";
import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import PostBox from "../components/PostBox";
import CategoriesRow from "../components/CategoriesRow";
import Header from "../components/Header";
import supabase from "../lib/supabaseClient";

function Home({ searchTerm }) {
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    const fetchTopCategories = async () => {
      const { data: posts, error: postError } = await supabase
        .from("post")
        .select("id, categories_id");

      if (postError) {
        console.error("Error fetching posts:", postError);
        return;
      }

      const countMap = {};
      posts.forEach((post) => {
        countMap[post.categories_id] = (countMap[post.categories_id] || 0) + 1;
      });

      const sortedIds = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

      const { data: Categories, error: subError } = await supabase
        .from("categories")
        .select("*")
        .in("id", sortedIds);

      if (subError) {
        console.error("Error fetching categories:", subError);
        return;
      }

      const sortedCategories = sortedIds
        .map((id) => Categories.find((s) => s.id === Number(id)))
        .filter(Boolean);

      setTopCategories(sortedCategories);
    };

    fetchTopCategories();
  }, []);

  return (
    <>
      <Head>
        <title>AskIt</title>
      </Head>

      <div className="mx-auto my-7 max-w-7xl px-4">
        <PostBox />

        <div className="mt-5 flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Feed searchTerm={searchTerm} />{" "}
            {/* ✅ ส่ง searchTerm เข้าตรงนี้ */}
          </div>

          <div className="sticky top-36 h-fit w-full max-w-sm rounded-md border border-gray-300 bg-white p-4 lg:block hidden">
            <p className="text-md mb-3 font-bold">Top Categories</p>
            <div>
              {topCategories.map((Categories, i) => (
                <CategoriesRow
                  key={Categories.id}
                  topic={Categories.topic}
                  index={i}
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
