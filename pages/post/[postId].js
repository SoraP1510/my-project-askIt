import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Post from "../../components/Post";
import Avatar from "../../components/Avatar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TimeAgo from "react-timeago";
import { Jelly } from "@uiball/loaders";
import Head from "next/head";
import supabase from "../../lib/supabaseClient";

function PostPage() {
  const router = useRouter(); // ใช้เข้าถึง URL params
  const { data: session } = useSession(); // ดึง session ของผู้ใช้
  const [post, setPost] = useState(null); // state เก็บข้อมูลโพสต์
  const [loading, setLoading] = useState(true); // state สำหรับสถานะโหลด

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm(); // ตั้งค่า react-hook-form

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("post")
      .select("*, comment(*), categories(*)") // ดึงข้อมูลโพสต์ พร้อม comment และ category
      .eq("id", router.query.postId) // filter จาก postId ที่ได้จาก URL
      .single(); // เอาแค่ตัวเดียว

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost({
        ...data,
        categories: Array.isArray(data.categories)
          ? data.categories[0]
          : data.categories, // แปลงให้เป็น object ถ้าเป็น array
        comments: data.comment, // เก็บ comment ไว้ใน post.comments
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady) {
      fetchPost(); // โหลดโพสต์เมื่อ router พร้อมและมี postId
    }
  }, [router.isReady, router.query.postId]);

  const onSubmit = async (formData) => {
    const notification = toast.loading("Posting your comment..."); // แสดง loading ขณะส่ง comment

    const { error } = await supabase.from("comment").insert([
      {
        post_id: router.query.postId, // เชื่อมกับโพสต์นี้
        username: session?.user?.name,
        text: formData.comment,
      },
    ]);

    if (error) {
      toast.error("Failed to post comment", { id: notification });
    } else {
      setValue("comment", ""); // ล้าง input
      toast.success("Comment posted!", { id: notification });
      fetchPost(); // โหลดโพสต์ใหม่เพื่ออัปเดต comment
    }
  };

  if (loading || !post) {
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#9C5BCC" /> {/* แสดง spinner ระหว่างโหลด */}
      </div>
    );
  }

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Head>
        <title>AskIt</title>
      </Head>

      <Post post={post} /> {/* แสดงโพสต์ */}

      {/* กล่องสำหรับพิมพ์ comment */}
      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <textarea
            {...register("comment", { required: true })}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
            placeholder={
              session ? "What are your thoughts?" : "Please sign in to comment"
            }
          />

          {errors.comment && (
            <p className="text-red-500 text-sm">• Comment is required</p>
          )}

          <button
            disabled={!session}
            type="submit"
            className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>

      {/* แสดงรายการ comment */}
      <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10">
        <hr className="py-2" />

        {Array.isArray(post?.comments) && post.comments.length === 0 && (
          <p className="text-gray-400 text-sm">
            No comments yet. Be the first!
          </p>
        )}

        {Array.isArray(post?.comments) &&
          post.comments.map((comment) => (
            <div
              className="relative flex items-center space-x-2 space-y-5"
              key={comment.id}
            >
              <hr className="absolute top-10 left-7 z-0 h-16 border" />
              <div className="z-50">
                <Avatar seed={comment.username} /> {/* แสดง avatar ของผู้คอมเมนต์ */}
              </div>
              <div className="flex flex-col">
                <p className="py-2 text-xs text-gray-400">
                  <span className="font-semibold text-gray-600">
                    {comment.username}
                  </span>{" "}
                  • <TimeAgo date={comment.created_at} /> {/* แสดงเวลาย้อนหลัง */}
                </p>
                <p>{comment.text}</p> {/* แสดงข้อความคอมเมนต์ */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PostPage;
