import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer class="p-4 bg-white md:p-8 lg:p-10 ">
      <div class="mx-auto max-w-screen-xl text-center">
        <Link
          href="/"
          class="flex justify-center items-center text-2xl font-semibold text-gray-900 "
        >
          <Image
            src="/images/olas-logo.svg"
            alt="Olas logo"
            width="158"
            height="88"
            className="mx-auto"
          />
        </Link>
        <p class="my-6 text-gray-600 ">
          The unified network for off-chain services
        </p>
        <ul class="flex flex-wrap justify-center items-center mb-6 text-gray-900 ">
          <li>
            <Link href="/#ecosystem" class="mr-4 hover:underline md:mr-6 ">
              Ecosystem
            </Link>
          </li>
          <li>
            <Link href="/#resources" class="mr-4 hover:underline">
              Resources
            </Link>
          </li>
        </ul>
        <div className="text-gray-600">
          © Autonolas DAO 2023 • <Link href="/disclaimer">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
