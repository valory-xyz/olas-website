import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-dark-hexagons2 bg-repeat bg-size-25 p-24">
      <footer class="bg-white rounded-lg border-2 p-24">
        <a href="https://olas.network/">
          <Image
            src="/images/olas-logo.svg"
            alt="Olas logo"
            width="158"
            height="88"
            className="mx-auto"
          />
        </a>
      </footer>
    </div>
  );
};

export default Footer;
