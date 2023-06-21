import Image from "next/image";

const Footer = () => {
  return (
    <footer class="bg-white rounded-lg border m-4 dark:bg-gray-800 ">
      <div class="w-full mx-auto max-w-screen-xl p-12 md:flex md:items-center md:justify-between">
        <span class="text-base text-gray-500 sm:text-center dark:text-gray-400">
          <a href="https://olas.network/" class="hover:underline">
            <Image src="/images/olas-logo.svg" alt="Olas logo"  width="158" height="88" />
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
