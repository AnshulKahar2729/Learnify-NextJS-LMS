

import React from "react";
import { MdOutlineComputer } from "react-icons/md";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className=" flex w-full   items-center gap-3">
      <MdOutlineComputer className=" text-2xl font-bold" />
      <span className=" text-xl font-bold">LEARNIFY</span>
    </Link>
  );
};

export default Logo;
