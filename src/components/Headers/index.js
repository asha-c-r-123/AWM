import React from "react";
import "./index.scss";
import Notificaitons from "../../assets/images/notification.svg";
import user from "../../assets/images/user.svg";
const Header = () => {
  return (
    <div className="header">
      <div>
        <h1>Welcome Back, Audrey!</h1>
        <div className="user-date-time">
          <p>14th, March, 2023</p>
          <p>03:10 pm (GMT+5:30)</p>
        </div>
      </div>
      <div className="user-profile">
        <img src={Notificaitons} alt="notificaitons" />
        <p>
          Audrey
          <span>@audrey24</span>
        </p>
        <img src={user} alt="user profile" />
      </div>
    </div>
  );
};
export default Header;
