import axios from "axios";
import { useEffect, useState } from "react";
import { SiGmail, SiGoogletasks } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiSmartphone,
  FiLock,
  FiClock,
  FiTarget,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";

import Footer from "../components/Footer";

function Home() {
  const API = import.meta.env.VITE_API_URL;

  const features = [
    {
      title: "Simple, clutter-free UI",
      icon: <FiCheckCircle className="sm:w-16 sm:h-16 w-10 h-10" />,
      description:
        "Designed for ease of use with a clean layout that minimizes distractions and maximizes focus on what matters most.",
    },
    {
      title: "Fully responsive (Mobile + Tablet + Desktop)",
      icon: <FiSmartphone className="sm:w-16 sm:h-16 w-10 h-10" />,
      description:
        "Optimized to work seamlessly across all devices—mobile phones, tablets, and desktop screens—for a smooth user experience.",
    },
    {
      title: "Secure Login with JWT",
      icon: <FiLock className="sm:w-16 sm:h-16 w-10 h-10" />,
      description:
        "Implements JSON Web Tokens to ensure secure authentication and protect user sessions from unauthorized access.",
    },
    {
      title: "Real-time status updates (Done / Undone)",
      icon: <FiClock className="sm:w-16 sm:h-16 w-10 h-10" />,
      description:
        "Instantly reflects task changes across the app—whether completed or pending—without needing to refresh the page.",
    },
    {
      title: "Deadline reminders",
      icon: <FiTarget className="sm:w-16 sm:h-16 w-10 h-10" />,
      description:
        "Keeps you on track with automated alerts for upcoming task deadlines, helping you stay organized and efficient.",
    },
    {
      title: "Live token/session checking",
      icon: <FiRefreshCw className="sm:w-16 sm:h-16 w-10 h-10" />,
      description:
        "Continuously verifies token validity and session state to enhance security and ensure uninterrupted access.",
    },
  ];
  const steps = [
    {
      title: "Sign Up / Login",
      subtitle: "STEP ONE",
      description:
        "Create an account or log in securely to get started using your personal dashboard.",
      image: "/sc1.jpg", // You can replace with actual assets
    },
    {
      title: "Add Todos",
      subtitle: "STEP TWO",
      description:
        "Easily add tasks, set deadlines, and organize your day with just a few clicks.",
      image: "/sc2.jpg",
    },
    {
      title: "Mark them as Done",
      subtitle: "STEP THREE",
      description:
        "Stay on top of your goals by marking completed tasks and tracking your progress.",
      image: "/sc3.jpg",
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
    }, 3000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (tokenData.exp && tokenData.exp < currentTime) {
          // Token is expired
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
      } catch (error) {
        // Invalid token format
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      axios
        .get(`${API}/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setIsLoggedIn(response.data.user.isLoggedIn);
          } else {
            console.log("error in fetching user details");
          }
        })
        .catch((error) => {
          console.log("Error in getting user");
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);
  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);
  return (
    <>
      <nav className="bg-blue-100 p-4">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="flex items-center justify-between w-full lg:w-max">
            <div className="text-black font-bold text-3xl mb-4 lg:mb-0 hover:text-gray-600 hover:cursor-pointer">
              <a
                href="/"
                className="text-3xl font-extrabold text-shadow-lg flex items-center gap-2"
              >
                <SiGoogletasks />
                Task <span className="text-blue-600">Flow</span>
              </a>
            </div>

            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-black focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`lg:flex flex-col lg:flex-row lg:space-x-4 lg:mt-0 mt-4 flex  items-center text-xl ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <a
              href="/"
              className="text-black font-bold  px-4 py-2 hover:text-blue-600 "
            >
              Support
            </a>
            <a
              href="#Projects"
              className="text-black font-bold  px-4 py-2  hover:text-blue-600"
            >
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      {/* hero section  */}
      <div className="flex w-screen h-[90vh] items-center justify-center flex-col gap-5 uppercase relative">
        {/* <h2 className="text-3xl md:text-6xl font-extrabold text-wrap text-center">
          Welcome to Task View
        </h2> */}

        <div className="flex w-screen h-[70vh] mb-[10vh] flex-col-reverse md:flex-row">
          <div className="basis-full md:basis-1/2 md:ps-10 text-center flex items-center justify-center">
            <img src="image1.jpeg" className="width-screen" alt="" />
          </div>
          <div className="basis-full md:basis-1/2 md:px-4 text-2xl  md:text-6xl  text-center md:text-start flex flex-col items-center justify-center md:items-start ">
            <h2 className="font-extrabold w-full md:w-[80%]">
              Stay Organized. Anywhere, Anytime.
            </h2>
            <p className="text-xs md:text-2xl  md:font-light w-full md:w-[90%]">
              A minimal, fast and mobile-friendly todo app built for
              productivity
            </p>
          </div>
        </div>
      </div>
      {/* features sections  */}
      <div className="w-screen ">
        <h2 className="text-4xl text-center font-extrabold">Features</h2>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-5 mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center lg:w-3/5 mx-auto ${
                  index < features.length - 1
                    ? "border-b pb-10 mb-10 border-gray-200"
                    : ""
                } sm:flex-row flex-col`}
              >
                <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-2">
                    {feature.title}
                  </h2>
                  <p className="leading-relaxed text-base">
                    {feature.description}
                  </p>
                  <a
                    className="mt-3 text-blue-500 inline-flex items-center"
                    href="#"
                  >
                    Learn More
                    <FiArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* guide section  */}
      <div className="w-screen">
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                Get Started in 3 Easy Steps
              </h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                Follow this simple guide to start organizing your tasks and
                achieving more every day.
              </p>
            </div>
            <div className="flex flex-wrap -m-4 md:w-[90%] md:ms-[5%]">
              {steps.map((step, index) => (
                <div key={index} className="lg:w-1/3 sm:w-1/2 p-4">
                  <h2 className="font-bold">Step {index + 1} :</h2>
                  <div className="flex relative">
                    <img
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-fit object-center"
                      src={step.image}
                    />
                    <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <h2 className="tracking-widest text-sm title-font font-medium text-blue-500 mb-1">
                        {step.subtitle}
                      </h2>
                      <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                        {step.title}
                      </h1>
                      <p className="leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* floating button */}
      <div className="fixed z-20 right-0 bottom-0 md:bottom-10 p-2 md:pr-5 md:pb-5 animate-bounce">
        {isLoggedIn ? (
          <a
            href="/home"
            className="p-3 bg-blue-500/90 hover:bg-blue-500 text-white  rounded-2xl md:font-semibold text-xs md:text-lg"
          >
            View your TODO
          </a>
        ) : (
          <a
            href="/login"
            className="p-3 bg-blue-500/80 hover:bg-blue-500/90 text-white  rounded-2xl md:font-semibold text-xs md:text-lg"
          >
            Login to continue
          </a>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 pt-16">
        {/* Final Call To Action */}
        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8">
          <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Organize your day and boost your productivity.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/home"
              className="px-2 py-1 bg-blue-600/90 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Try it Now
            </a>
            <a
              href="/login"
              className="px-2 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Login to Get Started
            </a>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
export default Home;
