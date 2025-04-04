import { Dialog } from "@headlessui/react";
import { useState } from "react";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";

// ✅ Component สำหรับแก้ไขโพสต์
export default function EditPost({ post, onClose, onPostUpdated }) {
  // ✅ state สำหรับเก็บข้อมูลที่จะแก้ไข
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [image, setImage] = useState(post.image);

  // ✅ ฟังก์ชันบันทึกข้อมูลเมื่อกด Save
  const handleSave = async () => {
    const { error } = await supabase
      .from("post")
      .update({ title, body, image }) // อัปเดตข้อมูลโพสต์
      .eq("id", post.id); // เฉพาะโพสต์ที่มี id นี้

    if (error) {
      toast.error("Failed to update post"); // ❌ ถ้ามี error
    } else {
      toast.success("Post updated!"); // ✅ แจ้งเตือนว่าอัปเดตสำเร็จ
      onPostUpdated(); // ✅ เรียกฟังก์ชันจาก parent เพื่อรีเฟรชโพสต์
      onClose(); // ✅ ปิด modal
    }
  };

  return (
    <Dialog
      open={true} // ✅ เปิด Dialog ตลอด (เพราะใช้กับ showEdit)
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
          {/* ✅ Title */}
          <Dialog.Title className="text-lg font-bold mb-4">
            Edit Post
          </Dialog.Title>

          {/* ✅ Input สำหรับแก้ไข title */}
          <input
            className="w-full mb-2 border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          {/* ✅ Textarea สำหรับแก้ไข body */}
          <textarea
            className="w-full mb-2 border px-3 py-2 rounded"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
          />

          {/* ✅ Input สำหรับแก้ไข image URL */}
          <input
            className="w-full mb-2 border px-3 py-2 rounded"
            value={image || ""}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />

          {/* ✅ แสดงตัวอย่างรูปภาพถ้ามี URL */}
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-48 object-contain mb-4 rounded"
            />
          )}

          {/* ✅ ปุ่ม Cancel / Save */}
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
