import { DOCS_BASE_URL } from "@/common-util/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Menu } from "./Menu";

const Header = () => {
  return (
    <header>
      <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 ">
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
          <Button asChild className="flex items-center md:order-2" size="xl" variant="outline">
            <Link
              href="/#get-involved"
            >
              Get involved
            </Link>
          </Button>
          <Menu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
