import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SiGoogletasks } from "react-icons/si";
import { IoMdLogOut } from "react-icons/io";

function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <>
      <nav className="flex justify-between px-3 md:px-10 py-5 bg-blue-100 items-center">
        <div className="nav-brand ">
          <a
            href="/"
            className="text-3xl font-extrabold text-shadow-lg flex items-center gap-2"
          >
            <SiGoogletasks />
            Task <span className="text-blue-600">Flow</span>
          </a>
        </div>
        <div className="nav-ul">
          <ul>
            <li>
              <a
                onClick={logout}
                className="bg-blue-500 hover:bg-blue-600 rounded-full md:rounded-2xl px-2 py-2 md:px-3 md:py-2 shadow-lg text-sm md:text-md text-white font-semibold cursor-pointer flex items-center gap-1"
              >
                <span className="hidden md:inline">Logout</span>{" "}
                <IoMdLogOut className="fill-red-500 size-5 md:size-7" />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
