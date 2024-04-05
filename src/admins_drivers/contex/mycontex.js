import React, { createContext, useState } from "react";
export const contex = createContext();

export default function MyContex(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [driverAdmins, setDriverAdmins] = useState(true);
  const BaseUrl = "http://204.12.199.7:9999";
  let sendChildren = {
    isOpen,
    setIsOpen,
    driverAdmins,
    setDriverAdmins,
    BaseUrl,
  };

  return (
    <contex.Provider value={sendChildren}>{props.children}</contex.Provider>
  );
}
