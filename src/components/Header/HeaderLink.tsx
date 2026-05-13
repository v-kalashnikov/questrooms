"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

function HeaderLink({
  linkName,
  children,
}: {
  linkName: string;
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = linkName === segment;

  return (
    <Link
      href={`/${linkName.toLowerCase()}`}
      className={`
        font-semibold text-sm hover:text-brandMagenta bg-opacity-75 uppercase
        ${isActive ? "font-medium text-brandMagenta bg-opacity-45" : "text-textWhite"}
      `}
    >
      {children}
    </Link>
  );
}

export default HeaderLink;
