import React from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { MultiSelect } from "primereact/multiselect";

const ConfirmationPopUp = ({
  op,
  onSort,
  selectedCities,
  onGlobalFilterChange,
  setProjectFrozen,
  addFrozenColumns,
  ProjectFrozen,
  projectData,
  selectedColumnName,
  setFrozenColumn,
  frozenCoulmns,
  sortData,
  setSortData,
  setFilters,
  filters,
}) => {
  const multiselectOptions = (colName) => {
    let optionList = [];
    optionList = projectData?.filter(
      (ele) =>
        colName !== "" && colName && colName !== null && ele[colName] && ele
    );
    return optionList;
  };

  const confirmPopData = () => {
    return (
      <div>
        <div
          style={{ padding: "5px", cursor: "pointer" }}
          onClick={onSort(selectedColumnName, "desc")}
        >
          {" "}
          Sort z to a
        </div>
        <div
          style={{ padding: "5px", cursor: "pointer" }}
          onClick={onSort(selectedColumnName, "asc")}
        >
          {" "}
          Sort a to z
        </div>
        <div
          style={{ padding: "5px", cursor: "pointer" }}
          onClick={() => {
            addFrozenColumns(selectedColumnName);
            setProjectFrozen(!ProjectFrozen);
          }}
        >
          {" "}
          Frozen{" "}
        </div>
        <div style={{ padding: "5px", cursor: "pointer" }}>
          <MultiSelect
            value={selectedCities}
            onChange={(e) => onGlobalFilterChange(e)}
            options={multiselectOptions(selectedColumnName)}
            optionLabel={selectedColumnName}
            filter
            placeholder="Select "
            maxSelectedLabels={3}
            className="p-column-filter"
          />
        </div>
        <div
          style={{ padding: 3, cursor: "pointer" }}
          onClick={() => {
            let jsonFrozenItem = localStorage.getItem("frozenData");
            const frozenItem = JSON.parse(jsonFrozenItem);
            if (
              frozenItem &&
              frozenItem.length &&
              frozenItem.includes(selectedColumnName)
            ) {
              const index = frozenItem.indexOf(selectedColumnName);
              frozenItem.splice(index, 1);
              localStorage.setItem("frozenData", JSON.stringify(frozenItem));
              setFrozenColumn(frozenItem);
            }
            if (frozenCoulmns.includes(selectedColumnName)) {
              const index = frozenCoulmns.indexOf(selectedColumnName);
              frozenCoulmns.splice(index, 1);
              setFrozenColumn(frozenCoulmns);
              setProjectFrozen(!ProjectFrozen);
            }
            let jsonSortItem = localStorage.getItem("sortingData");
            const sortItem = JSON.parse(jsonSortItem);
            if (
              sortItem &&
              sortItem.length &&
              sortItem[0] === selectedColumnName
            ) {
              localStorage.setItem("sortingData", JSON.stringify([]));
            }
            if (
              sortData &&
              sortData.length &&
              sortData[0] === selectedColumnName
            ) {
              setSortData([]);
            }
            if (filters && filters.length) {
              setFilters([]);
            }
          }}
        >
          Clear all filter
        </div>
      </div>
    );
  };

  return (
    <span>
      <OverlayPanel ref={op}>{confirmPopData()}</OverlayPanel>
    </span>
  );
};
export default ConfirmationPopUp;
