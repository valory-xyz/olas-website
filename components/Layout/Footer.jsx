import Image from "next/image";

const Footer = () => {
  return (
    <footer class="bg-white rounded-lg m-12 dark:bg-gray-800 border border-2 p-24">
          <a href="https://olas.network/">
            <Image src="/images/olas-logo.svg" alt="Olas logo"  width="158" height="88" className="mx-auto" />
          </a>
    </footer>
  );
};

export default Footer;
