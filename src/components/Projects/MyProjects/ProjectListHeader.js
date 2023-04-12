import React from "react";
import export2excel from "../../../assets/images/export2excel.svg";
import searchMyProjects from "../../../assets/images/searchMyProjects.svg";
import filter from "../../../assets/images/filter.svg";
import customizedFields from "../../../assets/images/customizedFields.svg";
import renameMyProjects from "../../../assets/images/renameMyProjects.svg";
import save from "../../../assets/images/save.svg";

const ProjectListHeader = ({
  header,
  clearFilter,
  clearFilters,
  setVisible,
  saveSettings,
  onSearchClick,
  exportCSV,
}) => {
  return (
    <div className="actions">
      <div className="project-title">{header}</div>

      <div className="action-buttons">
        <i>
          <img
            src={filter}
            alt="filter logo"
            style={{
              cursor: "pointer",
              padding: 10,
              fontSize: "2rem",
              color: "#003DA5",
              // <img src={ExpandImg} alt="logos" />
            }}
            onClick={clearFilter}
            // className="pi pi-filter-slash"
          />
        </i>
        <i>
          <img
            src={save}
            alt="save settings"
            style={{
              cursor: "pointer",
              padding: 10,
              fontSize: "2rem",
              color: "#003DA5",
            }}
            onClick={saveSettings}
            className="pi pi-save"
          />
        </i>
        <i>
          <img
            src={searchMyProjects}
            alt="search field"
            style={{
              cursor: "pointer",
              padding: 10,
              fontSize: "2rem",
              color: "#003DA5",
              // width: "100%",
            }}
            // onClick={saveSettings}
            onClick={onSearchClick}
            // className="pi pi-search"
          />
        </i>

        <i>
          <img
            src={export2excel}
            alt="download file"
            style={{
              cursor: "pointer",
              padding: 10,
              fontSize: "2rem",
              color: "#003DA5",
            }}
            // onClick={saveSettings}
            onClick={() => exportCSV(false)}
            className="pi pi-file-excel"
          />
        </i>
        <i>
          <img
            src={customizedFields}
            alt="alternate image"
            style={{
              cursor: "pointer",
              padding: 10,
              fontSize: "2rem",
              color: "#003DA5",
            }}
            onClick={() => setVisible(true)}
            // className="pi pi-pencil"
          />
        </i>
        {/* <Button> */}
        {/* <button> */}
        <img
          src={renameMyProjects}
          alt="Reset to P&G Default"
          // className="button-layout"
          // style={{ fontSize: 14 }}
          onClick={clearFilters}
        />
        {/* </button> */}
        {/* </Button> */}
      </div>
    </div>
  );
};

export default ProjectListHeader;
