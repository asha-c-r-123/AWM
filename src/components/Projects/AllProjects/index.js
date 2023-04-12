import React, { useEffect, useState } from "react";

import PageLayout from "../../PageLayout";
import { ProjectService } from "../../../service/PegaService";
import ProjectList from "../MyProjects/ProjectList";

function AllProjects() {
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
setLoading(false);
      } catch (err) {
        console.log("error", err);
      }
    })();
    
  }, []);

  console.log("Pega data", loading);

  return (
    <PageLayout>
      <div className="content-layout" id="tableDiv">
        <div className="tabular-view">

            {!loading && 
          <ProjectList pegadata={pegadata} header="All Projects" /> }
        </div>
      </div>
    </PageLayout>
  );
}

export default AllProjects;
