import { PhotoIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { useForm } from "react-hook-form";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function PostBox({ categories }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [imageBoxOpen, setImageBoxOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const notification = toast.loading("Creating new post...");

    try {
      let { data: existingcategoriess } = await supabase
        .from("categories")
        .select("*")
        .eq("topic", categories || formData.categories);

      let categories_id;

      if (!existingcategoriess || existingcategoriess.length === 0) {
        const { data: newSub, error: subError } = await supabase
          .from("categories")
          .insert([{ topic: formData.categories }])
          .select()
          .single();

        if (subError) throw subError;
        categories_id = newSub.id;
      } else {
        categories_id = existingcategoriess[0].id;
      }

      const { error: postError } = await supabase.from("post").insert([
        {
          title: formData.postTitle,
          body: formData.postBody,
          image: formData.PostImage || "",
          categories_id,
          username: session?.user?.name,
        },
      ]);

      if (postError) throw postError;

      setValue("postBody", "");
      setValue("PostImage", "");
      setValue("postTitle", "");
      setValue("categories", "");

      toast.success("New Post Created!", { id: notification });

      setTimeout(() => {
        router.reload(); // ✅ Reload หลัง toast ขึ้น
      }, 1000);
    } catch (error) {
      toast.error("Whoops, something went wrong!", { id: notification });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="sticky top-20 z-50 border rounded-md border-gray-300 bg-white p-2"
    >
      <div className="flex items-center space-x-3">
        <Avatar />
        <input
          {...register("postTitle", { required: true })}
          type="text"
          disabled={!session}
          className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
          placeholder={
            session
              ? categories
                ? `Create a post in ${categories}`
                : "Create a post by entering a title!"
              : "Sign in to post"
          }
        />
        <PhotoIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && "text-blue-300"
          }`}
        />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              type="text"
              placeholder="Text (optional)"
              {...register("postBody")}
            />
          </div>

          {!categories && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Category:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                type="text"
                placeholder="i.e Games"
                {...register("categories", { required: true })}
              />
            </div>
          )}

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                type="text"
                placeholder="Optional..."
                {...register("PostImage")}
              />
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle && <p>• A post title is required</p>}
              {errors.categories && <p>• A categories is required</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-blue-400 p-2 text-white"
          >
            Create Post
          </button>
        </div>
      )}
    </form>
  );
}

export default PostBox;
