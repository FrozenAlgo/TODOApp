import { BsGithub, BsLinkedin } from "react-icons/bs";
import { SiGmail } from "react-icons/si";

function Footer() {
  return (
    <>
      <footer className="text-gray-600 bg-white   w-screen body-font z-50">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <span className="ml-3 text-xl font-bold">Task Flow</span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2025 Task Flow —
            <a
              href="https://github.com/FrozenAlgo"
              className="text-gray-600 ml-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              @arhamrehan
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a
              className="text-gray-500"
              href="www.linkedin.com/in/arhamsheikh5661"
            >
              <BsLinkedin />
            </a>

            <a
              className="ml-3 text-gray-500"
              href="https://github.com/FrozenAlgo"
            >
              <BsGithub />
            </a>
            <a
              className="ml-3 text-gray-500"
              href="mailto:arhamrehan427@gmail.com"
            >
              <SiGmail />
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
export default Footer;
