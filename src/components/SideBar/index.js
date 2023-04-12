import React, { useState } from "react";
import { Nav, NavItem, Button } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import PgLogo from "../../assets/images/logo.svg";
import ReportsImg from "../../assets/images/projects.svg";
import ChartImg from "../../assets/images/reports.svg";
import LogoutImg from "../../assets/images/logout.svg";
import PlusImg from "../../assets/images/plus.svg";
import plusCollapseImg from "../../assets/images/plusCollapse.svg";
import ExpandImg from "../../assets/images/expand.svg";
import ArrowDownImg from "../../assets/images/sort.svg";
import "./index.scss";
import { Col } from "react-bootstrap";

const SideBar = () => {
  const location = useLocation();
  const [isToggle, setIsToggle] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleSidebar = () => {
    setIsToggle(!isToggle);
    //
    if (expandedIndex) {
      setExpandedIndex(null);
    }
  };
  const sidebarWidth = isToggle ? "220px" : "100px";
  function toggleSubMenu(index) {
    setIsToggle(true);

    setExpandedIndex((prevIndex) => {
      // Collapse the currently expanded sub-menu (if any)
      if (index === prevIndex) {
        return null;
      } else {
        setExpandedItems([index]);
        return index;
      }
    });

    setExpandedItems((prevExpandedItems) => {
      // Toggle the expanded state of the clicked sub-menu
      const isExpanded = prevExpandedItems.includes(index);

      if (isExpanded) {
        return [];
      } else {
        return [index];
      }
    });
  }
  const navItems = {
    data: [
      {
        name: "Projects",
        img: ReportsImg,
        arrowUp: ArrowDownImg,
        url: "/myProjects",
        items: [
          { name: "My Projects", url: "/myProjects" },
          { name: "All Projects", url: "/allProjects" },
        ],
      },
      {
        name: "Tasks",
        img: ChartImg,
        arrowUp: ArrowDownImg,
        url: "/tasks",
        items: [
          { name: "My Tasks", url: "tasks/mytasks" },
          { name: "All Tasks", url: "tasks/alltasks" },
        ],
      },
    ],
  };
  return (
    <>
      <Col
        sm={4}
        className="left-grid"
        style={{
          width: sidebarWidth,
          transition: "width 0.3s ease-in-out",
        }}
      >
        <div className="sidebar">
          <img
            src={!isToggle ? ExpandImg : ExpandImg}
            alt="logos"
            onClick={toggleSidebar}
            className={!isToggle ? "toggle-collapsed" : "toggle-expanded"}
          />
          <div className="logo">
            <img
              src={PgLogo}
              alt="PG LOGO"
              className={`pg-logo ${!isToggle && "toggle-logo"}`}
            />
            <p className="logo-title">Artwork Agility Suite</p>
          </div>
          <Nav
            style={{
              paddingTop: !isToggle && "100px",
            }}
          >
            {navItems?.data?.map((item, index) => {
              if (item.items) {
                return (
                  <NavItem
                    key={index}
                    className={
                      location.pathname === item.url ||
                      item.items?.some(
                        (subItem) => location.pathname === subItem.url
                      ) ||
                      expandedItems.includes(index)
                        ? "active"
                        : ""
                    }
                  >
                    <NavLink
                      onClick={() => toggleSubMenu(index)}
                      className={`nav-link ${isToggle && "parent-link"}`}
                      to={item.url}
                    >
                      <img src={item.img} alt="logos" />
                      {isToggle && (
                        <>
                          <span>{item.name}</span>
                          <img
                            src={item.arrowUp}
                            alt="arrows"
                            className={
                              expandedIndex === index
                                ? "arrow-up"
                                : "arrow-down"
                            }
                          />
                        </>
                      )}
                    </NavLink>
                    {expandedIndex === index && isToggle && (
                      <ul>
                        {item.items.map((subItem, subIndex) => (
                          <NavItem
                            key={subIndex}
                            className={
                              location.pathname === subItem.url
                                ? "active subactive"
                                : ""
                            }
                          >
                            <NavLink to={subItem.url} className="nav-link">
                              {subItem.name}
                            </NavLink>
                          </NavItem>
                        ))}
                      </ul>
                    )}
                  </NavItem>
                );
              }
            })}
            <div className="add-project">
              <NavItem to="/addProject">
                {!isToggle ? (
                  <NavLink to="/addProject" className="nav-link">
                    <img
                      src={plusCollapseImg}
                      className="collapse-img"
                      alt=""
                    />
                  </NavLink>
                ) : (
                  <NavLink to="/addProject" className="nav-link">
                    <Button className="button-layout">
                      <img src={PlusImg} alt={PlusImg} />
                      Create Project
                    </Button>
                  </NavLink>
                )}
              </NavItem>
              <NavItem>
                {!isToggle ? (
                  <img src={LogoutImg} className="collapse-img" alt="" />
                ) : (
                  <NavLink to="/logout" className="nav-link">
                    <img src={LogoutImg} alt="logout" />
                    {isToggle && <span className="logout">Logout</span>}
                  </NavLink>
                )}
              </NavItem>
            </div>
          </Nav>
        </div>
      </Col>
      {/* <AddProject visible={visible} setVisible={setVisible} /> */}
    </>
  );
};

export default SideBar;
