import React, { useState, useEffect, useMemo } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
// import moment from "moment";
import "./index.scss";
import {
  categories,
  regionList,
  designScope,
  scaleList,
  projectType,
  brandList,
  ProductionStrategy,
  Tier,
} from "../../../categories";
const defaultCheckedItems = {
  DI: false,
  DT: false,
  PRA: false,
  PF: false,
  IQ: false,
  CICs: false,
  POAs: true,
};

const defaultTextBoxEnabled = {
  DI: false,
  DT: false,
  PRA: false,
  PF: false,
  IQ: false,
  CICs: false,
  POAs: true,
};

function AddProject(props) {
  const [selectedCities, setSelectedCities] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState(null);

  const [formattedDate, setFormattedDate] = useState("");
  const [readinessDate, setReadinessDate] = useState(null);
  const [sopDate, setSOPDate] = useState(null);
  const [printerDate, setPrinterDate] = useState(null);
  const [sosDate, setSOSDate] = useState(null);
  const [region, setRegion] = useState({});
  const [smo, setSmo] = useState(null);
  const [bu, setBu] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  const [tier, setTier] = useState("");
  const [ps, setPs] = useState("");
  const [pm, setPm] = useState("Pranali");
  const [iL, setIl] = useState("Pranali");
  const [checkedItems, setCheckedItems] = useState(defaultCheckedItems);
  const [textBoxEnabled, setTextBoxEnabled] = useState(defaultTextBoxEnabled);
  const [designScopeList, setDesignScopeList] = useState({
    DI: "",
    DT: "",
    PRA: "",
    PF: "",
    IQ: "",
    CICs: "",
    POAs: "10", // set default value to 10
  });
  const [scale, setScale] = useState([]);
  const getSmoOptions = () => {
    if (!region?.countries) return [];

    return region.countries.map((country) => ({
      label: country.name,
      value: country.code,
    }));
  };

  const handleRegionChange = (e) => {
    const selectedRegion = regionList.find((r) => r.code === e.target.value);
    setRegion(selectedRegion);
    setSmo(null);
  };

  const smoOptions = getSmoOptions();

  const handleBuChange = (e) => {
    setBu(e.target.value);
    setSubCategories([]);
  };

  const bUs = Object.keys(categories).map((bu) => ({ code: bu, name: bu }));
  const handleSubCategoryChange = (e) => {
    setSubCategories(e.value);
  };

  const subCategoriesOptions = useMemo(() => {
    if (bu && categories[bu]) {
      return categories[bu].map((subCat) => ({ label: subCat, value: subCat }));
    }
    return [];
  }, [bu, categories]);

  const form = useForm({ date: null });
  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = month === 0 ? 11 : month - 1;
  let prevYear = prevMonth === 11 ? year - 1 : year;
  let nextMonth = month === 11 ? 0 : month + 1;
  let nextYear = nextMonth === 0 ? year + 1 : year;

  let minDate = new Date();

  minDate.setMonth(prevMonth);
  minDate.setFullYear(prevYear);

  let maxDate = new Date();

  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);

  const handleCheckboxChange = (event) => {
    const { name, value } = event.target;
    const isChecked = event.target.checked;

    if (!isChecked) {
      console.log("checked and unchecked", designScopeList);
      if (designScopeList[value]) {
        console.log("checked and unchecked", designScopeList, value);
        delete designScopeList[value];
        setDesignScopeList((prevScopeList) => ({
          ...designScopeList,
        }));
      }
    }

    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: isChecked ? value : false,
    }));

    // handle inter-dependencies
    switch (name) {
      case "DI":
        // when Design Intent is selected, user must select DT or PRA
        if (isChecked && !checkedItems.DT && !checkedItems.PRA) {
          setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            DT: true,
          }));
        }
        break;
      case "DT":
        // when Design Template is selected, user cannot select PRA
        if (isChecked && checkedItems.PRA) {
          setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            PRA: false,
          }));
        }
        break;
      case "PRA":
        // when Production Ready Art is selected, user cannot select DT
        if (isChecked && checkedItems.DT) {
          setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            DT: false,
          }));
        }
        break;

      default:
        break;
    }

    // enable/disable textbox based on checkbox selection
    setTextBoxEnabled((prevTextBoxEnabled) => ({
      ...prevTextBoxEnabled,
      [name]: isChecked,
    }));
  };

  const defaultValues = {
    groupName: "",
    customValue: "",
    kickoffDate: "",
    PM: "PRanali",
  };
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues:
      // JSON.parse(localStorage.getItem("formDraft")) ||
      defaultValues,
  });

  const checkFormValidity = () => {
    // check if all fields are filled
    const valid = selectedCities && selectedCities.length > 0 && isValid;
    setFormValid(valid);
  };

  useEffect(() => {
    checkFormValidity();
    // check if all fields are filled
    const valid = selectedCities && selectedCities.length > 0 && isValid;
    setFormValid(valid);
  }, [selectedCities, isValid, errors]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  const onSubmit = (data) => {
    const formData = { data, selectedCities };
    console.log("form data", formData);
    setFormData(formData);
    setFormValid(false); // set formValid to false to show error message again if the form is invalid

    //api call
  };
  const onSaveAsDraft = () => {
    const formData = {
      projectName: getValues("projectName"), // 1
      groupName: getValues("groupName"), // 2
      customValue1: getValues("customValue1"),
      bu: bu, // 3
      region: region, //4
      smo: smo, //5
      category: subCategories, //6
      brand: brand, //7
      scale: getValues("scale"), //8
      estimatedPOA: getValues("estimatedPOA"), //9
      estimatedCICs: getValues("estimatedCICs"), //10
      printerDate: printerDate, //11
      readinessDate: readinessDate, //12
      sopDate: sopDate, //13
      sosDate: sosDate, //14
      customValue2: getValues("customValue2"), //15
      projectType: getValues("selectedCities"), //16
      PM: "Pranali", //17
      projectDescription: getValues("projectDescription"), //18
    };
    console.log("form data", formData);
    localStorage.setItem("formDraft", JSON.stringify(formData));
  };

  // this function is to change the date format maybe we will change when pega integration is done.
  const changeDateFormat = (value) => {
    const options = { timeZone: "Asia/Kolkata", hour12: false };
    const outputDateString = value.toLocaleString("en-US", options);
    const outputDate = new Date(outputDateString);
    return outputDate;
  };

  useEffect(() => {
    //get api call
    const formDraft = JSON.parse(localStorage.getItem("formDraft"));
    if (formDraft) {
      Object.entries(formDraft).forEach(([name, value]) => {
        //
        if (name === "sopDate") {
          let outputDate = changeDateFormat(value);
          setSOPDate(outputDate);
        }
        if (name === "sosDate") {
          let outputDate = changeDateFormat(value);
          setSOSDate(outputDate);
        }
        if (name === "readinessDate") {
          let outputDate = changeDateFormat(value);
          setReadinessDate(outputDate);
        }
        if (name === "printerDate") {
          let outputDate = changeDateFormat(value);
          setPrinterDate(outputDate);
        }
        if (name === "bu") {
          setBu(value);
        }
        if (name === "region") {
          setRegion(value);
        }
        if (name === "smo") {
          setSmo(value);
        }
        if (name === "category") {
          setSubCategories(value);
        }
        setValue(name, value);
      });
    }
  }, [setValue]);
  const handleTierChange = (e) => {
    setPs(e.target.value);
  };
  const handlePsChange = (e) => {
    setPs(e.target.value);
  };
  const handlePM = (e) => {
    setPm(e.target.value);
  };
  const handleIL = (e) => {
    setIl(e.target.value);
  };
  useEffect(() => {
    const selectedData = JSON.parse(localStorage.getItem("formDraft"));
    if (selectedData && selectedData.selectedCities) {
      setSelectedCities(selectedData.selectedCities);
    }
  }, []);
  const clearForm = () => {
    setSelectedCities([]);
    props.setVisible(false);
  };

  return (
    <div className="tabular-add-project">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="projectName.ControlInput1">
              <Form.Label>Project Name * </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Project Name"
                {...register("projectName", { required: true })}
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3" controlId="bu.SelectMultiple">
              <Form.Label>BU *</Form.Label>
              <div>
                <Form.Select
                  value={bu}
                  onChange={handleBuChange}
                  placeholder="Select BU"
                >
                  <option value="">Select BU</option>
                  {bUs.map((bu) => (
                    <option key={bu.code} value={bu.code}>
                      {bu.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="sop.readiness">
              <Form.Label>Estimated AW Readiness *</Form.Label>
              <Controller
                name="date"
                control={form.control}
                rules={{ required: "Date is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      inputId={field.name}
                      value={readinessDate}
                      onChange={(e) => setReadinessDate(e.target.value)}
                      dateFormat="d-M-y"
                      showIcon={true}
                      minDate={minDate}
                      maxDate={printerDate}
                      className={classNames({
                        "p-invalid": fieldState.error,
                      })}
                    />
                  </>
                )}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group controlId="projectType.SelectMultiple">
              <Form.Label>Project Type</Form.Label>
              <div>
                <Form.Select
                  // value={selectedCities}
                  // onChange={(e) => setSelectedCities(e.value)}
                  {...register("selectedCities", { required: false })}
                  placeholder="Select Scale"
                >
                  {/* <option value="">Select Pro</option> */}
                  {projectType.map((bu) => (
                    <option key={bu.code} value={bu.code}>
                      {bu.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group
              className={`mb-3 ${errors.groupName && "error-valid"}`}
              controlId="groupName.ControlInput1"
            >
              <Form.Label>Initiative Group Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Initiative Group Name"
                {...register("groupName", { required: true })}
              />
              {errors.groupName && (
                <span className="error-text">This field is required</span>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              controlId="scale.category"
              className="mb-3"
              // className={`mb-3 ${
              //   selectedCities && !selectedCities.length && "error-valid"
              // }`}
            >
              <Form.Label>Category</Form.Label>
              <MultiSelect
                value={subCategories}
                onChange={handleSubCategoryChange}
                options={subCategoriesOptions}
                optionLabel="label"
                filter
                placeholder="Select Categories"
                className="w-full md:w-20rem"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="sop.readiness">
              <Form.Label>Estimated AW@Printer *</Form.Label>
              <Controller
                name="date"
                control={form.control}
                rules={{ required: "Date is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      inputId={field.name}
                      value={printerDate}
                      onChange={(e) => setPrinterDate(e.target.value)}
                      dateFormat="d-M-y"
                      showIcon={true}
                      minDate={readinessDate}
                      maxDate={sopDate}
                      className={classNames({
                        "p-invalid": fieldState.error,
                      })}
                    />
                  </>
                )}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group controlId="projectType.SelectMultiple">
              <Form.Label>PM *</Form.Label>
              <div>
                <Form.Control
                  value={pm}
                  onChange={handlePM}
                  disabled
                ></Form.Control>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="customValue2.ControlInput1">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: "5rem" }}
                placeholder="Add Project description"
                {...register("projectDescription", { required: false })}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="brand.SelectMultiple">
              <Form.Label>Brand *</Form.Label>
              <div>
                <MultiSelect
                  value={brand}
                  onChange={(e) => setBrand(e.value)}
                  options={brandList}
                  optionLabel="name"
                  filter
                  placeholder="Select Brand"
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="sop.readiness">
              <Form.Label>Estimated SOP *</Form.Label>
              <Controller
                name="date"
                control={form.control}
                rules={{ required: "Date is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      inputId={field.name}
                      value={sopDate}
                      onChange={(e) => setSOPDate(e.target.value)}
                      dateFormat="d-M-y"
                      showIcon={true}
                      minDate={printerDate}
                      maxDate={sosDate}
                      className={classNames({
                        "p-invalid": fieldState.error,
                      })}
                    />
                  </>
                )}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group controlId="projectType.SelectMultiple">
              <Form.Label>IL *</Form.Label>
              <div>
                <Form.Control value={iL} onChange={handleIL}></Form.Control>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <Form.Group className="mb-3" controlId="smo.SelectMultiple">
              <Form.Label>Region *</Form.Label>
              <div>
                <Form.Select
                  value={region.code || ""}
                  onChange={handleRegionChange}
                  placeholder="Select Region"
                >
                  <option value="">Select Region</option>
                  {regionList.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="bve.SelectMultiple">
              <Form.Label>Scale </Form.Label>
              <div>
                <Form.Select
                  // value={scale}
                  // onChange={(e) => setScale(e.target.value)}
                  {...register("scale", { required: false })}
                  placeholder="Select Scale"
                >
                  <option value="">Select Scale</option>
                  {scaleList.map((bu) => (
                    <option key={bu.code} value={bu.code}>
                      {bu.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="sop.readiness">
              <Form.Label>Estimated SOS *</Form.Label>
              {/*
                {errors.sopDate && (
                  <span className="error-text">Please select a SOP Date</span>
                )} */}
              <Controller
                name="date"
                control={form.control}
                rules={{ required: "Date is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      inputId={field.name}
                      value={sosDate}
                      onChange={(e) => setSOSDate(e.target.value)}
                      dateFormat="d-M-y"
                      showIcon={true}
                      // minDate={sopDate}
                      className={classNames({
                        "p-invalid": fieldState.error,
                      })}
                    />
                  </>
                )}
              />
            </Form.Group>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="smo.SelectMultiple">
              <Form.Label>SMO *</Form.Label>
              <div>
                <MultiSelect
                  value={smo}
                  onChange={(e) => setSmo(e.value)}
                  options={smoOptions}
                  optionLabel="label"
                  filter
                  placeholder="Select SMO"
                  className="w-full md:w-20rem"
                  required={!!region}
                  disabled={!region}
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="il.SelectMultiple">
              <Form.Label>Design Scope</Form.Label>
              <div className="design-scope">
                {designScope.map((option, index) => (
                  <span key={index} style={{ display: "flex" }}>
                    <Form.Check
                      label={option.label}
                      name={option.value}
                      type="checkbox"
                      value={option.value}
                      onChange={handleCheckboxChange}
                      checked={checkedItems[option.value]}
                      style={{ width: 160 }}
                    />
                    <Form.Control
                      type="number"
                      value={
                        !textBoxEnabled[option.value] && option.value !== "POAs"
                          ? ""
                          : designScopeList[option.value]
                      }
                      onChange={(e) => {
                        designScopeList[option.value] = e.target.value;
                        setDesignScopeList(designScopeList);
                      }}
                      disabled={
                        !textBoxEnabled[option.value] && option.value !== "POAs"
                      }
                      style={{
                        width: 40,
                        height: 27,
                        paddingLeft: "5px",
                        paddingRight: 0,
                        fontSize: "10px",
                      }}
                    />
                  </span>
                ))}
              </div>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3" controlId="bve.SelectMultiple">
              <Form.Label>
                {region?.code === "EUF" && bu === "Baby Care" && "Tier"}
                {region?.code === "EUF" &&
                  bu === "Home Care" &&
                  "Production Strategy"}
              </Form.Label>
              <div>
                {region?.code === "EUF" && bu === "Baby Care" && (
                  <Form.Select
                    {...register("Teir", { required: false })}
                    placeholder="Select Teir"
                    onChange={handleTierChange}
                  >
                    <option value="">Select Teir</option>
                    {Tier.map((tier) => (
                      <option key={tier.code} value={tier.code}>
                        {tier.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {region?.code === "EUF" && bu === "Home Care" && (
                  <Form.Select
                    {...register("Production Strtegy", { required: false })}
                    placeholder="Select PS"
                    onChange={handlePsChange}
                  >
                    <option value="">Select Production Strategy</option>
                    {ProductionStrategy.map((ps) => (
                      <option key={ps.code} value={ps.code}>
                        {ps.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </div>
            </Form.Group>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
        <Row className="form-buttons">
          <Button
            className="cancel-button button-layout"
            type="reset"
            onClick={clearForm}
          >
            Cancel
          </Button>
          <Button
            className="button-layout submit-button"
            onClick={onSaveAsDraft}
          >
            Save as draft
          </Button>
          <Button
            className="button-layout draft-button"
            disabled={!formValid}
            type="submit"
          >
            Save
          </Button>
        </Row>
      </Form>
    </div>
  );
}
export default AddProject;
