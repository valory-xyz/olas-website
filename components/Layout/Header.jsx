import Image from "next/image";
import Link from "next/link";
import React from "react";

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
          <div class="flex items-center lg:order-2">
            <a
              href="https://contribute.olas.network/"
              class="text-purple-950 border border-purple-950  hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2  focus:outline-none "
              target="_blank"
              rel="noopener noreferrer"
            >
              Get involved
            </a>
          </div>
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
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
