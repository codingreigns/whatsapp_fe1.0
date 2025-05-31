import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../app/features/userSlice";

const Menu = () => {
  const dispatch = useDispatch();
  return (
    <div className="absolute right-1 z-50 dark:bg-darkBg2 dark:text-darkText1 shadow-md w-52">
      <ul className="py-3 pl-5 cursor-pointer hover:bg-darkBg3">
        <span>New Group</span>
      </ul>
      <ul className="py-3 pl-5 cursor-pointer hover:bg-darkBg3">
        <span>New Community</span>
      </ul>
      <ul className="py-3 pl-5 cursor-pointer hover:bg-darkBg3">
        <span>Starred Messages</span>
      </ul>
      <ul className="py-3 pl-5 cursor-pointer hover:bg-darkBg3">
        <span>Settings</span>
      </ul>
      <ul
        className="py-3 pl-5 cursor-pointer hover:bg-darkBg3"
        onClick={() => dispatch(logout())}
      >
        <span>Logout</span>
      </ul>
    </div>
  );
};

export default Menu;
