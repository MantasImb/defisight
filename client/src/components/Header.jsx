import React from "react";

export default function Header({ info, title }) {
  return (
    <div className="mb-4 md:mb-10">
      <p className="text-3xl font-extrabold tracking-tight text-slate-900">
        {title}
      </p>
      <p className="text-sm text-gray-400">{info}</p>
    </div>
  );
}
