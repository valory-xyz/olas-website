import { DOCS_BASE_URL } from "@/common-util/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Menu } from "./Menu";


const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b">
      <nav class="bg-white px-4 lg:px-6 py-2.5 ">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/">
            <Image
              src="/images/olas-logo.svg"
              alt="logo"
              width="120"
              height="60"
              className="mx-auto"
            />
          </Link>
          <Menu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
