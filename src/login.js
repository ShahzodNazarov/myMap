import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoEyeSharp } from "react-icons/io5";
import { SuperContex } from "./admins_drivers/contex/supercontex";

export function LoginPage() {
  const BaseUrl = SuperContex().BaseUrl;
  let [differUser, setDifferUser] = useState("");
  let [showPassword, setShowPassword] = useState("password");
  let [classesSMall1, SetclassesSmall1] = useState("correctSmall");
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  function onSubmit(data) {
    let newData = { ...data, type: "admin" };
    // post request to the axios
    axios 
      .post(`${BaseUrl}/admin/login`, newData)
      .then((res) => {
        //  console.log(res.data.token.token);
        let token = res.data.token.token;
        // take role from admin user
        let adminRole = res.data.token.admin.type;
        localStorage.setItem("token", token);

       
        if (adminRole == "admin") {
          navigate("/map");
        }
         
        if (adminRole == "superadmin") {
          navigate("/adminpage");
        }

        SetclassesSmall1("correctSmall");
      })
      .catch((error) => {
        console.error("Error making post request:", error);
        SetclassesSmall1("errorSmall");
        reset();
      });
  }

  return (
    <div className="loginContainer">
      <div className="container">
        <h2 className="text-white">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email" className="text-white">
            Email:
          </label>
          <input
            {...register("login", {
              type: "email",
              required: "Email is required",
            })}
            id="email"
            placeholder="enter your email here"
            className="form-control"
          />

          <label htmlFor="password" className="text-white">
            Password:
          </label>
          <input
            {...register("password", {
              required: "password is required",
            })}
            id="password"
            type={showPassword}
            placeholder="enter your password here"
            className="form-control"
          />
          <small className={classesSMall1}> invalid email or password </small>
          <button
            className="btnShowPassword"
            type="button"
            onClick={() =>
              setShowPassword(showPassword == "password" ? "text" : "password")
            }
          >
            <IoEyeSharp />
          </button>
          <button className="buttonSubmit">submit</button>
        </form>
      </div>
    </div>
  );
}
