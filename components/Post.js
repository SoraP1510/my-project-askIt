import React, { useEffect, useState } from "react";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleBottomCenterIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { Jelly } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import supabase from "../lib/supabaseClient";
import EditPost from "./EditPost"; // ✅ เปลี่ยนชื่อ component ที่ import

function Post({ post }) {
  const [vote, setVote] = useState(null);
  const [votes, setVotes] = useState([]);
  const [showEdit, setShowEdit] = useState(false); // ✅ ใช้ EditPost popup
  const { data: session } = useSession();

  useEffect(() => {
    fetchVotes();
  }, [post.id, session]);

  const fetchVotes = async () => {
    const { data } = await supabase
      .from("vote")
      .select("*")
      .eq("post_id", post.id);
    setVotes(data || []);
    const userVote = data?.find((v) => v.username === session?.user?.name);
    setVote(userVote?.upvote);
  };

  const handleVote = async (isUpvote) => {
    if (!session) return toast.error("You need to sign in to vote!");
    if ((vote === true && isUpvote) || (vote === false && !isUpvote)) return;

    const existingVote = votes.find((v) => v.username === session.user.name);
    const { error } = existingVote
      ? await supabase
          .from("vote")
          .update({ upvote: isUpvote })
          .eq("id", existingVote.id)
      : await supabase
          .from("vote")
          .insert([
            { post_id: post.id, username: session.user.name, upvote: isUpvote },
          ]);

    if (error) {
      toast.error("Error voting!");
    } else {
      toast.success(existingVote ? "Vote updated!" : "Vote placed!");
      fetchVotes(); // ✅ ดึงคะแนนใหม่
    }
  };

  const handlePostUpdate = () => {
    fetchVotes();
    if (typeof window !== "undefined") window.location.reload(); // ✅ reload หน้า
  };

  const displayVotes = () => {
    if (!votes || votes.length === 0) return 0;
    const total = votes.reduce((acc, v) => acc + (v.upvote ? 1 : -1), 0);
    return total === 0 ? (votes[0]?.upvote ? 1 : -1) : total;
  };

  return (
    <>
      {/* ✅  Edit */}
      {showEdit && (
        <EditPost
          post={post}
          onClose={() => setShowEdit(false)}
          onPostUpdated={handlePostUpdate}
        />
      )}

      {/* ✅ Post Card */}
      <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-600 relative">
        {/* Votes */}
        <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
          <HandThumbUpIcon
            onClick={() => handleVote(true)}
            className={`voteButtons hover:text-red-400 ${
              vote === true && "text-red-400"
            }`}
          />
          <p className="text-black text-xs font-bold">{displayVotes()}</p>
          <HandThumbDownIcon
            onClick={() => handleVote(false)}
            className={`voteButtons hover:text-blue-400 ${
              vote === false && "text-blue-400"
            }`}
          />
        </div>

        {/* Content */}
        <div className="p-3 pb-1 flex-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post.username} />
            <p className="text-xs text-gray-400">
              <Link href={`/categories/${post.categories?.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  {post.categories?.topic}
                </span>
              </Link>{" "}
              • Posted by {post.username} <TimeAgo date={post.created_at} />
            </p>

            {/* ✅ Three-dot menu */}
            {session?.user?.name === post.username && (
              <Menu as="div" className="ml-auto relative">
                <Menu.Button className="p-1 hover:bg-gray-100 rounded-full">
                  <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setShowEdit(true)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={async () => {
                            const confirm = window.confirm(
                              "Are you sure you want to delete this post?"
                            );
                            if (!confirm) return;

                            const { error } = await supabase
                              .from("post")
                              .delete()
                              .eq("id", post.id);

                            if (error) {
                              toast.error("Failed to delete post.");
                            } else {
                              toast.success("Post deleted!");
                              if (typeof window !== "undefined") {
                                window.location.reload(); // ✅ reload หน้า
                              }
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            active ? "bg-gray-100 text-red-600" : "text-red-500"
                          }`}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            )}
          </div>

          {/* Body */}
          <div className="py-4">
            <Link href={`/post/${post.id}`}>
              <h2 className="text-xl font-semibold hover:underline">
                {post.title}
              </h2>
            </Link>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>

          {/* Image */}
          {post.image && (
            <img
              className="w-full max-h-64 object-contain rounded"
              src={post.image}
              alt=""
            />
          )}

          {/* Footer */}
          <div className="flex space-x-4 text-gray-400 mt-2">
            <div className="postButtons">
              <ChatBubbleBottomCenterIcon className="h-6 w-6" />
              <Link href={`/post/${post.id}`}>
                <p>
                  {Array.isArray(post.comments)
                    ? post.comments.length
                    : post.comments || 0}{" "}
                  Comments
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
