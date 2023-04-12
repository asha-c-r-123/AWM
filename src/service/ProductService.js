import pegaJsonData from "../pega.json";

const filterProjectData =
[
{"Record ID#" : {"frozen":true , "width":50}},
{"Group Name" : {"sort":"desc", "frozen":true , "width":100}},
{"Category" : []},
]

export const ProductService = {
  getProductsData() {
    return pegaJsonData.ArtworkAgilityProjects;
  },

  getFilterData(){
  return filterProjectData;
  }

};
