import React from "react";
import ChatNavbar from "./ChatNavbar";
import UserChat from "./userChat";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ChatNavbar></ChatNavbar>
      <UserChat></UserChat>
    </div>
  );
};

export default Sidebar;
