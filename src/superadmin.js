import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./admins_drivers/sidebar";
import Drivers from "./admins_drivers/driver";
import { SuperContex } from "./admins_drivers/contex/supercontex";
import Admin from "./admins_drivers/admin";

export default function AdminPage() {
  const driverAdmins = SuperContex().driverAdmins;
  const setDriverAdmins = SuperContex().setDriverAdmins;
  
  return (
    <div className="superAdminPage">
      <div className="container-fluid">
        {/* <button onClick={()=>setIsOpen(!isOpen)}>press</button> */}
        <Sidebar />
        {driverAdmins ? <Drivers /> : <Admin />}
      </div>
    </div>
  );
}
