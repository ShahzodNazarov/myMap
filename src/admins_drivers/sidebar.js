import React, { useState } from "react";
import { SuperContex } from "./contex/supercontex";
import { FiAlignJustify } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { HiTruck } from "react-icons/hi2";

export const Sidebar = () => {
  const isOpen = SuperContex().isOpen;
  const setIsOpen = SuperContex().setIsOpen;
  const setDriverAdmins = SuperContex().setDriverAdmins;
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  let navigate = useNavigate();

  function makeDriverTrue() {
    setDriverAdmins(true);
    setIsOpen(!isOpen);
  }

  function makeDriverFalse(params) {
    setDriverAdmins(false);
    setIsOpen(!isOpen);
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <h5>Dashboard</h5>{" "}
        <h5>
          <FiAlignJustify />
        </h5>
      </button>
      <ul>
        <li onClick={makeDriverTrue}>
          <h5>
            <HiTruck />
          </h5>
          Haydovchilar
        </li>
        <li onClick={makeDriverFalse}>
          <h5>
            <RiAdminFill />
          </h5>
          Adminlar
        </li>
      </ul>
      <p>©2024 EGS Group</p>
    </div>
  );
};
