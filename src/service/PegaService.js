import pegaJsonData from "../pega.json";

const frozenColData = ["Record ID#", "Timestamp", "Status", "SOP"];

const sortingData = ["Record ID#", "desc"];

const allColumnNames = [
  "Record ID#",
    "Project Name",
  "Category",
  "SMO",
"Project State",
"Buffer to work",
"AW @ Printer",
"Full Kit Readiness Tracking",
];

const allColumnNamesAllProjects = [
  "Record ID#",
    "Project Name",
  "Category",
  "SMO",
  "PM",
"Project State",
"Buffer to work",
"AW @ Printer",
"Full Kit Readiness Tracking",
]

const filterProjectData = [
  { "Record ID#": { frozen: true, sort: "desc", width: 50 } },
  { "Group Name": { frozen: true, width: 100 } },
  { Category: {} },
  { "Group Name": {} },
  { Status: { frozen: true } },
];

export const ProjectService = {
  getProjectData() {
    return pegaJsonData.ArtworkAgilityProjects;
  },

  getFilterData() {
    return filterProjectData;
  },

  getSortingData() {
    return sortingData;
  },

  getFrozenData() {
    return frozenColData;
  },

  getAllColumnNames(){
  return allColumnNames;
  },
  
  getAllColumnNamesAllProjects(){
  return allColumnNamesAllProjects;
  }
};
