import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { HiOutlineXMark } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { GoCircle, GoCheckCircleFill } from "react-icons/go";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoIosCloseCircle } from "react-icons/io";

function Welcome() {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [todoloading, setTodoLoading] = useState(false);
  const [doneTodoloading, setDoneTodoloading] = useState(false);
  const [userData, setUserData] = useState("");
  const [taskModal, setTaskModal] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const [isDoneHovering, setIsDoneHovering] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [accordionDoneOpen, setAccordionDoneOpen] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [doneTodoList, setDoneTodoList] = useState([]);
  const [formValues, setFormValues] = useState({
    todo_heading: "",
    todo_desc: "",
    todo_date: "",
  });
  const [formErrors, setFormErrors] = useState({
    todo_heading: "",
    todo_desc: "",
    todo_date: "",
  });

  useEffect(() => {
    //   close the modal on pressing ESC
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setTaskModal(false);
      }
    };
    //   close the modal on clicking outside of it

    const handleClick = (e) => {
      if (
        document.querySelector(".add-task-modal").contains(e.target) ||
        document.querySelector(".toggle-modal").contains(e.target)
      ) {
      } else {
        setTaskModal(false);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  //   get the user data when the page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
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
    if (token) {
      axios
        .get(`${API}/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setUserData(response.data.user);
            getTodo(response.data.user.id);
            getDoneTodo(response.data.user.id);
          } else {
            console.log("error in fetching user details");
          }
        })
        .catch((error) => {
          console.log("Error in getting user");
        });
    } else {
      navigate("/login");
    }
  }, []);

  // Create a simple function to check token regularly
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;

          if (tokenData.exp && tokenData.exp < currentTime) {
            localStorage.removeItem("token");
            alert("Session expired. Please login again.");
            navigate("/login");
          }
        } catch (error) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);
  //   get the user todos
  function getTodo(id) {
    setTodoLoading(true);
    axios
      .get(`${API}/getAllTodos`, {
        headers: {
          userid: id,
        },
      })
      .then((response) => {
        setTodoLoading(false);
        if (response.data.success) {
          setTodoList(response.data.todoList || []);
        } else {
          setTodoList([]);
        }
      })
      .catch((error) => {
        setTodoLoading(false);
        console.log("Failed to get TODOS");
        setTodoList([]);
      });
  }
  //   get the user's done todos
  function getDoneTodo(id) {
    setDoneTodoloading(true);

    axios
      .get(`${API}/getDoneTodos`, {
        headers: {
          userid: id,
        },
      })
      .then((response) => {
        setDoneTodoloading(false);
        if (response.data.success) {
          setDoneTodoList(response.data.doneTodoList || []);
        } else {
          setDoneTodoList([]);
        }
      })
      .catch((error) => {
        setDoneTodoloading(false);
        console.log("Failed to get done TODO");
        setDoneTodoList([]);
      });
  }
  //   mark the task as done
  function taskDoneHandle(todo_id) {
    console.log(todo_id);

    axios
      .post(`${API}/handleTaskDone`, { todo_id })
      .then((response) => {
        if (response.data.success) {
          getTodo(userData.id);
          getDoneTodo(userData.id);
        } else {
          console.log("Some error in getting task done");
        }
      })
      .catch((error) => {
        console.log("Error checking task");
      });
  }
  //   mark the task as done
  function taskDeleteHandle(todo_id) {
    console.log(todo_id);

    axios
      .post(`${API}/handleTaskDelete`, { todo_id })
      .then((response) => {
        if (response.data.success) {
          getDoneTodo(userData.id);
        } else {
          console.log("Error in deleting task");
        }
      })
      .catch((error) => {
        console.log("Error in deleting task");
      });
  }
  //   toggle the modal
  function toggleModal() {
    if (!taskModal) {
      setTaskModal(true);
    } else {
      setTaskModal(false);
    }
  }

  //   form handeling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var todo_heading = formValues.todo_heading;
    var todo_desc = formValues.todo_desc;
    var todo_date = formValues.todo_date;
    var errors = {};
    if (!todo_heading) {
      errors.todo_heading = "Heading is required";
    }
    if (!todo_desc) {
      errors.todo_desc = "Description is required";
    }
    if (!todo_date) {
      errors.todo_date = "Date is required";
    } else if (todo_date) {
      const givenDate = new Date(todo_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (givenDate < today) {
        errors.todo_date = "Date is in the past";
      }
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      const data = {
        todo_heading: todo_heading,
        todo_desc: todo_desc,
        todo_deadline: todo_date,
        todo_userId: userData.id,
      };

      axios
        .post(`${API}/addTodo`, data)
        .then((response) => {
          if (response.data.success) {
            setFormErrors({});
            setMessage(response.data.message);
            setTaskModal(false);
            getTodo(userData.id);
            setFormValues({
              todo_heading: "",
              todo_desc: "",
              todo_date: "",
            });
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.log("Failed");
        });
    }
  };

  useEffect(() => {
    if (message || errorMessage) {
      const timer = setTimeout(() => {
        setMessage("");
        setErrorMessage("");
      }, 5000); // Clear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, errorMessage]);
  return (
    <>
      <div className="bg-neutral-100 min-h-screen  relative pb-10">
        <Navbar />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mt-3 tracking-wide">
            Welcome {userData ? userData.username : ""}
          </h1>

          <div className="main-content">
            <div className="px-4">
              <a
                onClick={toggleModal}
                className="flex gap-1 items-center justify-center bg-blue-800 w-max p-3 sm:ps-2 sm:pe-2 sm:py-1 md:ps-4 md:pe-3 md:py-2 my-5 md:my-2 text-sm md:text-md font-semibold text-white rounded-full sm:rounded-xl hover:bg-blue-500 cursor-pointer toggle-modal fixed  bottom-0 right-0 sm:static me-4"
              >
                <span className="hidden sm:inline">Add Todo</span>
                <FiPlus className="hover:rotate-90 origin-center transition-all duration-300 size-4  md:size-5" />
              </a>
            </div>
            <div
              onClick={() => {
                setTaskModal(false);
              }}
              className="flex flex-col justify-center items-center w-screen "
            >
              <div className="heading">
                <h2 className="text-3xl text-blue-400 py-3 sm:py-0 font-extrabold mb-3 tracking-wide uppercase">
                  To Do
                </h2>
              </div>
              <div className="tasks">
                <ul className="max-h-[40vh] px-4  overflow-y-auto">
                  {todoloading ? (
                    <li
                      className={`border-1 border-blue-200  mb-4 rounded-lg bg-blue-100   shadow-lg shadow-blue-200   w-[90vw] md:w-[60vw]  cursor-pointer `}
                    >
                      <div className="flex items-center justify-between px-3 py-1">
                        <div className="flex items-center justify-center w-full  gap-3">
                          <span className="font-semibold text-gray-700">
                            <svg
                              className="animate-spin h-5 w-5 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </li>
                  ) : todoList.length > 0 ? (
                    todoList.map((todo, index) => (
                      <li
                        className="border-1 border-blue-200  mb-4 rounded-lg bg-blue-100 hover:bg-blue-200  shadow-lg shadow-blue-200  w-[90vw] md:w-[60vw]   cursor-pointer"
                        key={index}
                      >
                        <div className="flex items-center justify-between px-3 py-1">
                          <div
                            className="flex items-center  gap-3"
                            onMouseEnter={() => {
                              setIsHovering(index);
                            }}
                            onMouseLeave={() => {
                              setIsHovering(null);
                            }}
                            onClick={() => {
                              taskDoneHandle(todo.id);
                            }}
                          >
                            <div>
                              {isHovering === index ? (
                                <GoCheckCircleFill className="fill-green-700" />
                              ) : (
                                <GoCircle className="fill-green-500" />
                              )}
                            </div>
                            <span className="capitalize text-sm md:text-md font-semibold">
                              {todo.heading}
                            </span>
                            <span className="text-[10px] md:text-xs">
                              {new Date(todo.deadline)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(/ /g, " / ")}
                            </span>
                          </div>
                          <div
                            className="hover:rotate-90 origin-center transition-all duration-200  font-bold"
                            onClick={() => {
                              setAccordionDoneOpen(
                                accordionDoneOpen === index ? null : index
                              );
                            }}
                          >
                            <FiPlus className="hover:stroke-blue-600" />
                          </div>
                        </div>

                        {accordionDoneOpen === index && (
                          <div className="bg-white/80 ms-0 rounded-b-lg p-3">
                            {todo.description}
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="border-1 border-blue-200  mb-4 rounded-lg bg-blue-100  shadow-lg shadow-blue-200    w-[90vw] md:w-[60vw]  cursor-pointer">
                      <div className="flex items-center justify-between px-3 py-1">
                        <div className="flex items-center justify-center w-full  gap-3">
                          <AiOutlineInfoCircle className="fill-blue-500 size-5" />
                          <span className="font-semibold text-xs md:text-base text-gray-700">
                            No Todos Found Yet , Create some to Show{" "}
                          </span>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <div>
          <div className="main-content">
            <div
              onClick={() => {
                setTaskModal(false);
              }}
              className="flex flex-col justify-center items-center w-screen "
            >
              <div className="heading">
                <h2 className="text-3xl text-blue-400 font-extrabold py-3 sm:py-0  mb-3 tracking-wider uppercase">
                  Done
                </h2>
              </div>
              <div className="tasks">
                <ul className="max-h-[40vh]  overflow-y-auto">
                  {doneTodoloading ? (
                    <li
                      className={`border-1 border-gray-200  mb-4 rounded-lg bg-gray-100  shadow-lg shadow-gray-200    w-[90vw] md:w-[60vw]  cursor-pointer `}
                    >
                      <div className="flex items-center justify-between px-3 py-1">
                        <div className="flex items-center justify-center w-full  gap-3">
                          <span className="font-semibold text-gray-700">
                            <svg
                              className="animate-spin h-5 w-5 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </li>
                  ) : doneTodoList.length > 0 ? (
                    doneTodoList.map((todo, index) => (
                      <li
                        className="border-1 border-gray-200  mb-4 rounded-lg bg-gray-200 hover:bg-gray-300  shadow-lg shadow-gray-200  w-[90vw] md:w-[60vw]   cursor-pointer"
                        key={index}
                      >
                        <div className="flex items-center justify-between px-3 py-1">
                          <div
                            className="flex items-center  gap-3"
                            onMouseEnter={() => {
                              setIsDoneHovering(index);
                            }}
                            onMouseLeave={() => {
                              setIsDoneHovering(null);
                            }}
                            onClick={() => {
                              taskDeleteHandle(todo.id);
                            }}
                          >
                            <div>
                              {isDoneHovering === index ? (
                                <IoIosCloseCircle
                                  size="18px"
                                  className="fill-red-400"
                                />
                              ) : (
                                <GoCircle className="fill-red-500" />
                              )}
                            </div>
                            <span className="capitalize font-semibold text-sm md:text-md text-gray-500">
                              {todo.heading}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(todo.deadline)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(/ /g, " / ")}
                            </span>
                          </div>
                          <div
                            className="hover:rotate-90 origin-center transition-all duration-200  font-bold"
                            onClick={() => {
                              setAccordionOpen(
                                accordionOpen === index ? null : index
                              );
                            }}
                          >
                            <FiPlus className="stroke-gray-500" />
                          </div>
                        </div>

                        {accordionOpen === index && (
                          <div className="bg-white/80 ms-0 rounded-b-lg p-3 text-gray-500">
                            {todo.description}
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="border-1 border-gray-200  mb-4 rounded-lg bg-gray-200  shadow-lg shadow-gray-200    w-[90vw] md:w-[60vw]  cursor-pointer">
                      <div className="flex items-center justify-between px-3 py-1">
                        <div className="flex items-center justify-center w-full  gap-3">
                          <AiOutlineInfoCircle className="fill-gray-500 size-5" />
                          <span className="font-semibold text-xs md:text-base text-gray-700">
                            No Todos Done Yet
                          </span>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <div
          className={`${
            taskModal ? "visible" : "hidden"
          } add-task-modal  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 `}
        >
          <form
            className="modal  bg-blue-200/95  rounded-lg px-4 py-10 relative min-w-[80vw]  md:min-w-[40vw] md:min-h-[40vh] shadow-lg"
            onSubmit={handleSubmit}
          >
            <div
              onClick={toggleModal}
              className="text-end font-extrabold text-2xl absolute right-0 top-0 mr-4 mt-3 cursor-pointer
                    hover:rotate-180 origin-center transition-all duration-200    
                "
            >
              <HiOutlineXMark size="30px" stroke="blue" strokeWidth="2px" />
            </div>
            <h2 className="font-extrabold text-2xl text-center ">
              Add <span className="text-blue-600"> Todo </span>
            </h2>
            {message && (
              <div className="text-green-500 text-center w-full font-semibold">
                {message}
              </div>
            )}
            {errorMessage && (
              <div className="text-red-500 text-center w-full font-semibold">
                {errorMessage}
              </div>
            )}
            <div className="mb-3">
              <label
                className="font-semibold text-lg text-blue-900"
                htmlFor="todo_heading"
              >
                Title :
              </label>
              <br />
              <input
                className={`bg-blue-50 rounded-2xl px-3 py-2 mt-1 shadow-sm w-full focus:outline-0 focus:bg-white   text-sm font-semibold ${
                  formErrors.todo_heading
                    ? "border-1 border-red-600 "
                    : "focus:border-b-2 border-b-blue-500"
                }`}
                type="text"
                id="todo_heading"
                name="todo_heading"
                value={formValues.todo_heading}
                onChange={handleInputChange}
              />
              {formErrors.todo_heading && (
                <span className="text-red-500">{formErrors.todo_heading}</span>
              )}
            </div>
            <div className="mb-3">
              <label
                className="font-semibold text-lg text-blue-900"
                htmlFor="todo_desc"
              >
                Description :
              </label>{" "}
              <br />
              <textarea
                className={`bg-blue-50 rounded-2xl px-3 py-2 mt-1 shadow-sm w-full focus:outline-0 focus:bg-white text-sm  font-semibold ${
                  formErrors.todo_desc
                    ? "border-1 border-red-600 "
                    : "focus:border-b-2 border-b-blue-500"
                }`}
                name="todo_desc"
                id="todo_desc"
                value={formValues.todo_desc}
                onChange={handleInputChange}
              ></textarea>
              {formErrors.todo_desc && (
                <span className="text-red-500">{formErrors.todo_desc}</span>
              )}
            </div>
            <div className="mb-3">
              <label
                className="font-semibold text-lg text-blue-900"
                htmlFor="todo_date"
              >
                Date :
              </label>
              <br />
              <input
                className={`bg-blue-50 rounded-2xl px-3 py-2 mt-1 shadow-sm w-full focus:outline-0 focus:bg-white text-sm  font-semibold ${
                  formErrors.todo_date
                    ? "border-1 border-red-600 "
                    : "focus:border-b-2 border-b-blue-500"
                }`}
                type="date"
                name="todo_date"
                value={formValues.todo_date}
                id="todo_date"
                onChange={handleInputChange}
              />
              {formErrors.todo_date && (
                <span className="text-red-500">{formErrors.todo_date}</span>
              )}
            </div>
            <div className="text-end mt-5 ">
              <button
                type="submit"
                className="bg-blue-500 px-7 py-1 text-white font-semibold hover:bg-blue-600 rounded-xl"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default Welcome;
