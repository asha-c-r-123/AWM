import React from "react";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import { Container, Row, Col } from "react-bootstrap";
import "./index.scss";
import SideBar from "../SideBar";
import Header from "../Headers";

const PageLayout = (props) => {
  return (
    <ThemeProvider
      breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      minBreakpoint="xxs"
    >
      <Container fluid>
        <Row className="row-fluid">
          <SideBar />
          <Col sm={8} className="right-grid">
            <div className="header-container">
              <Header />
            </div>
            <div className="main-container">
              <div className="wrapper">{props.children}</div>
            </div>
          </Col>
        </Row>
      </Container>
    </ThemeProvider>
  );
};
export default PageLayout;
