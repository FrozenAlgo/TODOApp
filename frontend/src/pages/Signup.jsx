import axios from "axios";
import { useState } from "react";
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Signup() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formValues.username) {
      errors.username = "Username is required";
    }
    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Email address is invalid.";
    }
    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      errors.password = "Password must be atleast 6 charecters long";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    } else {
      console.log(formValues);

      const data = {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      };
      axios
        .post(`${API}/signup`, data)
        .then((response) => {
          if (response.data.success) {
            console.log("Success:", response.data.message);
            setFormErrors({});
            setMessage(response.data.message);
            navigate("/login");
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          setErrorMessage("Error Adding User");
        });
    }
    setFormErrors({});
  };
  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen">
        <form
          className="shadow-lg shadow-gray-300 px-8 py-4 rounded-xl bg-gray-100"
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

          <h4 className="text-4xl font-bold text-center mb-10">Signup</h4>
          <div className="input-group font-sans font-semibold text-lg gap-3 flex justify-between items-center mb-7 relative">
            <label htmlFor="username">Username : </label>
            <input
              className={`border-1 font-normal  px-5 py-3 bg-white rounded-xl focus:outline-0 text-sm shadow ${
                formErrors.username ? "border-red-500" : "border-gray-200"
              }`}
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
            />
            {formErrors.username && (
              <span className="text-red-500 absolute top-full right-0 text-sm">
                {formErrors.username}
              </span>
            )}
          </div>
          <div className="input-group font-sans font-semibold text-lg gap-3 flex justify-between items-center mb-7 relative">
            <label htmlFor="email">Email : </label>
            <input
              className={`border-1 font-normal  px-5 py-3 bg-white rounded-xl focus:outline-0 text-sm shadow ${
                formErrors.email ? "border-red-500" : "border-gray-200"
              }`}
              type="email"
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
              className={`border-1 font-normal  px-5 py-3 bg-white rounded-xl focus:outline-0 text-sm shadow ${
                formErrors.password ? "border-red-500" : "border-gray-200"
              }`}
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
            <button
              type="submit"
              className="py-2 px-10 font-semibold  bg-cyan-800 text-white rounded-2xl "
            >
              Signup
            </button>
          </div>
          <div className="flex gap-2 mt-5 justify-center">
            <p>Already have an account : </p>
            <a href="/login" className="text-blue-600">
              Login
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
export default Signup;
