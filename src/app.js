import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import Test from "./test";
import React from "react";
import { YandexMap } from "./map";
import { LoginPage } from "./login";
import { ErrorPage } from "./error";
import AdminPage from "./superadmin";
import { createContext, useEffect, useState } from "react";
import { SuperContex } from "./admins_drivers/contex/supercontex";

export let MyContex = createContext();

export default function App() {
  let navigate = useNavigate();
  let location = useLocation();
  const BaseUrl = SuperContex().BaseUrl;
  let [show, setShow] = useState(false);

   useEffect(() => {
    let tokenLocal = localStorage.getItem("token");
    setShow(false);
    if (tokenLocal === null && location.pathname == "/map") {
      navigate("/error");
    }
    if (tokenLocal === null && location.pathname == "/adminpage") {
      navigate("/error");
    }
    
    if (tokenLocal != null) {
      axios
        .get(`${BaseUrl}/admin/get/info`, {
          headers: {
            Authorization: `Bearer ${tokenLocal}`,
          },
        })
        .then((res) => {
          let adminRole = res.data.data.admins[0].type;
           
          if (adminRole == "admin") {
            if (location.pathname == "/adminpage") {
              navigate("/map");
            }
          }
          if (adminRole == "superadmin") {
            if (location.pathname == "/map") {
              navigate("/adminpage/drivers"); 
            }
          }
          setShow(true);
        })
        .catch((error) => {
          setShow(true);
          console.error("Error making post request:", error );
          if (
            location.pathname == "/adminpage" ||
            location.pathname == "/map" 
          ) {
            navigate("/error");
          }
        });
    }
  }, [location.pathname]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/map" element={<YandexMap />} />
        <Route path="/adminpage" element={<AdminPage />} />
      </Routes>
    </div >
  );
}
