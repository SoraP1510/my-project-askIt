import React from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function CategoriesRow({ index, topic }) {
  return (
    <div
      className="flex items-center space-x-2 border-t bg-white px-4 py-2
    last-b"
    >
      <p>{index + 1}</p>
      <ChevronUpIcon className="h-4 w-4 shrink-0 flex text-green-400" />
      <p className="flex-1 truncate">{topic}</p>
      <Link href={`/categories/${topic}`}>
        <div
          className="cursor-pointer rounded-full bg-purple-500 px-3 
text-white"
        >
          View
        </div>
      </Link>
    </div>
  );
}

export default CategoriesRow;
