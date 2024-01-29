import { DOCS_BASE_URL } from "@/common-util/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

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
          <Button asChild className="flex items-center lg:order-2" size="xl" variant="outline">
            <Link
              href="/#get-involved"
            >
              Get involved
            </Link>
          </Button>
          <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
            <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  href="/#ecosystem"
                  class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0  "
                >
                  Ecosystem
                </Link>
              </li>
              <li>
                <Link
                  href="/#resources"
                  class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0  "
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/whitepaper"
                  class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0  "
                >
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link
                  href="https://contribute.olas.network/roadmap"
                  class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0  "
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Roadmap ↗
                </Link>
              </li>
              <li>
                <Link
                  href={DOCS_BASE_URL}
                  class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0  "
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Docs ↗
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
