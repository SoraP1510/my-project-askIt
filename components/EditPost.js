import { Dialog } from "@headlessui/react";
import { useState } from "react";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function EditPost({ post, onClose, onPostUpdated }) {
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [image, setImage] = useState(post.image);

  const handleSave = async () => {
    const { error } = await supabase
      .from("post")
      .update({ title, body, image })
      .eq("id", post.id);

    if (error) {
      toast.error("Failed to update post");
    } else {
      toast.success("Post updated!");
      onPostUpdated();
      onClose();
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">
            Edit Post
          </Dialog.Title>
          <input
            className="w-full mb-2 border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className="w-full mb-2 border px-3 py-2 rounded"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
          />
          <input
            className="w-full mb-2 border px-3 py-2 rounded"
            value={image || ""}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-48 object-contain mb-4 rounded"
            />
          )}
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="text-gray-500">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
