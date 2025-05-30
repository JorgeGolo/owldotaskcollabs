import React from "react";
//import { Link } from "react-router-dom";
import Link from "next/link";

const Breadcrumb = ({ segments }) => {
  return (
    <nav className="text-sm text-gray-600 mb-2">
      <ul className="flex flex-wrap">
        {segments.map((segment, index) => (
          <li key={segment.path} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <Link href={segment.path} className="text-blue-500 hover:underline">
              {segment.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
