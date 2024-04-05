import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import reactDom from "react-dom/client";
import "./style.scss";
import App from "./app";
import MyContex from "./admins_drivers/contex/mycontex";

let root = reactDom.createRoot(document.getElementById("root"));
root.render(
  <div>
    <MyContex>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MyContex>
  </div>
);
