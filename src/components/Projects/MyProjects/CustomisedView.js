import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Col, Row } from "react-bootstrap";
import { ProjectService } from "../../../service/PegaService";
import PGDefault from "../../../assets/images/PGDefault.svg";
import personalDefault from "../../../assets/images/personalDefault.svg";
import "./index.scss";

export default function CustomisedView({
  visible,
  setVisible,
  allColumnNames,
  projectColumnName,
  setProjectColumnNames,
}) {
  const [checked, setChecked] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // console.log("project name", projectColumnName);
    setSelectedCategories(projectColumnName);
  }, [projectColumnName, selectedCategories, setSelectedCategories]);

  const onCategoryChange = (e) => {
    if (e.checked && !selectedCategories.includes(e.value)) {
      selectedCategories.push(e.value);
      setSelectedCategories(selectedCategories);
      setChecked(!checked);
    }
  };

  const footerContent = (
    <div>
      <img
        src={PGDefault}
        alt="Reset to P&G Default"
        style={{
          width: 234,
          height: 34,
        }}
        onClick={() => {
          const columnNames = ProjectService.getAllColumnNames();
          localStorage.setItem("allColumnNames", JSON.stringify(columnNames));
          setProjectColumnNames(columnNames);
          setVisible(false);
        }}
        className="PGDefault"
      />
      <img
        src={personalDefault}
        alt="Save as personal Default"
        style={{
          width: 264,
          height: 34,
          margin: 15,
        }}
        onClick={() => {
          setProjectColumnNames(selectedCategories);
          const columnNames = JSON.stringify(selectedCategories);
          localStorage.setItem("allColumnNames", columnNames);
          setVisible(false);
        }}
        className="PersonalDefault"
      />
    </div>
  );

  return (
    <div>
      <Dialog
        header="Customise Fields"
        visible={visible}
        style={{
          width: "65vw",
          height: "540px",
        }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <Row>
          {allColumnNames.map((category) => {
            return (
              <Col sm={3} key={category} style={{ marginBottom: 10 }}>
                <Checkbox
                  inputId={category}
                  name="category"
                  value={category}
                  onChange={onCategoryChange}
                  checked={selectedCategories.some((item) => item === category)}
                />
                <label htmlFor={category} className="ml-2">
                  {category}
                </label>
              </Col>
            );
          })}
        </Row>
      </Dialog>
    </div>
  );
}
