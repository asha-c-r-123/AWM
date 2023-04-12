import React, { useState, useEffect } from "react";
import PageLayout from "../../PageLayout";
import "./index.scss";
import ProjectList from "./ProjectList";
import { ProjectService } from "../../../service/PegaService";

const MyProjects = (props) => {
  const [pegadata, setPegaData] = useState(null);
    const [loading, setLoading] = useState(false);


  useEffect(() => {
  setLoading(true);
    (async () => {
      try {
        const ProjectData = await ProjectService.getProjectData();
        if (ProjectData.length) {
          setPegaData(ProjectData);
        }
      } catch (err) {
        console.log("error", err);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <PageLayout>
      <div className="content-layout" id="tableDiv">
        <div className="tabular-view">
        {!loading && 
          <ProjectList pegadata={pegadata} header="My Projects" /> }
        </div>
      </div>
    </PageLayout>
  );
};
export default MyProjects;
