import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const token = "";
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    var userEmail = formValues.email;
    var userPass = formValues.password;
    // console.log(userEmail);
    // console.log(userPass);
    const errors = {};
    if (!userEmail) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      errors.email = "Email is invalid";
    }
    if (!userPass) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    } else {
      //   console.log(userEmail);
      //   console.log(userPass);
      const data = {
        email: userEmail,
        password: userPass,
      };
      axios
        .post(`${API}/login`, data)
        .then((response) => {
          //   console.log("Success");
          if (response.data.success) {
            setFormErrors({});
            setMessage(response.data.message);
            localStorage.setItem("token", response.data.token);
            navigate("/home");
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.log("Failed");
        });
    }
  };
  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen">
        <form
          className="shadow-lg shadow-gray-300 px-8 py-4  rounded-xl bg-gray-100"
          onSubmit={handleSubmit}
        >
          {message ? (
            <p className="text-center text-green-500 font-semibold">
              {message}
            </p>
          ) : errorMessage ? (
            <p className="text-center text-red-600 font-semibold">
              {errorMessage}
            </p>
          ) : (
            ""
          )}
          <h4 className="text-4xl font-bold text-center mb-10">Login</h4>
          <div className="input-group font-sans font-semibold text-lg gap-3 flex justify-between items-center mb-7 relative">
            <label htmlFor="email">Email : </label>
            <input
              className="border-1 font-normal border-gray-200 px-5 py-3 bg-white rounded-xl focus:outline-0 text-sm shadow"
              //   type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
            {formErrors.email && (
              <span className="text-red-500 absolute top-full right-0 text-sm">
                {formErrors.email}
              </span>
            )}
          </div>
          <div className="input-group font-sans font-semibold text-lg gap-3 flex justify-between items-center mb-7 relative">
            <label htmlFor="password">Password : </label>
            <input
              className="border-1 font-normal border-gray-200 px-5 py-3 bg-white rounded-xl focus:outline-0 text-sm shadow"
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            {formErrors.password && (
              <span className="text-red-500 absolute top-full right-0 text-sm">
                {formErrors.password}
              </span>
            )}
          </div>
          <div className="text-center">
            <button className="py-2 px-10 font-semibold  bg-cyan-800 text-white rounded-2xl ">
              Login
            </button>
          </div>
          <div className="flex gap-2 mt-5 justify-center">
            <p>Don't have an account : </p>
            <a href="/signup" type="submit" className="text-blue-600">
              Signup
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
export default Login;
