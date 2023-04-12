import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Form, Row, Col, Button } from "react-bootstrap";
import { MultiSelect } from "primereact/multiselect";
import { useForm } from "react-hook-form";
import "./index.scss";
function AddProject(props) {
  const [selectedCities, setSelectedCities] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const handleSelectionChange = (e) => {
    const value = e.value;
    const lastSelectedValue = value[value.length - 1];

    if (value.includes("DI")) {
      setSelectedValues(value.includes("DT") ? ["DI", "PRA"] : ["DI"]);
    } else if (value.includes("DT")) {
      setSelectedValues(value.includes("PRA") ? ["DT"] : ["DT"]);
    } else if (value.includes("PRA")) {
      setSelectedValues(value.includes("DT") ? ["PRA"] : ["PRA"]);
    } else {
      setSelectedValues([]);
    }
  };

  const defaultValues = {
    groupName: "",
    customValue: "",
    kickoffDate: "",
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
      JSON.parse(localStorage.getItem("formDraft")) || defaultValues,
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
    setFormData(formData);
    setFormValid(false); // set formValid to false to show error message again if the form is invalid
  };
  const onSaveAsDraft = () => {
    const formData = {
      groupName: getValues("groupName"),
      customValue: getValues("customValue"),
      selectedCities: selectedCities,
    };
    localStorage.setItem("formDraft", JSON.stringify(formData));
  };
  useEffect(() => {
    const formDraft = JSON.parse(localStorage.getItem("formDraft"));
    if (formDraft) {
      Object.entries(formDraft).forEach(([name, value]) => {
        setValue(name, value);
      });
    }
  }, [setValue]);
  const products = [
    { name: "Vizir", code: "NY" },
    { name: "Ariel", code: "RM" },
    { name: "Tide", code: "LDN" },
    { name: "Lenor", code: "IST" },
    { name: "Pantene", code: "PRS" },
  ];
  const contentTemplate = () => {
    return (
      <div>
        <div className="p-dialog-title">Create Project</div>
        {!formValid && (
          <p className="error-text">Please fill all the details</p>
        )}
      </div>
    );
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
    <Dialog
      visible={props.visible}
      maximizable
      style={{ width: "80vw" }}
      onHide={() => props.setVisible(false)}
      header={contentTemplate}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
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
              className={`mb-3 ${errors.customValue && "error-valid"}`}
              controlId="customValue.ControlInput1"
            >
              <Form.Label>Custom Value #1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Custom Value #1"
                {...register("customValue", { required: true })}
              />
              {errors.customValue && (
                <span className="error-text">This field is required</span>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              controlId="scale.SelectMultiple"
              className={`mb-3 ${
                selectedCities && !selectedCities.length && "error-valid"
              }`}
            >
              <Form.Label>Scale</Form.Label>
              <MultiSelect
                value={selectedCities}
                onChange={(e) => setSelectedCities(e.value)}
                options={products}
                optionLabel="name"
                filter
                placeholder="Select Cities"
                maxSelectedLabels={3}
                name="selectedCities"
                className={
                  errors.selectedCities
                    ? "w-full md:w-20rem p-invalid"
                    : "w-full md:w-20rem"
                }
              />
              {selectedCities && !selectedCities.length && (
                <span className="error-text">
                  Please select at least one city
                </span>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              className={`mb-3 ${errors.kickoffDate && "error-valid"}`}
              controlId="kickoffDate.ControlInput1"
            >
              <Form.Label>Estimated AW Kick off Date *</Form.Label>
              <Form.Control
                type="date"
                placeholder="Kick off Date"
                {...register("kickoffDate", {
                  required: "Please select a kickoff date",
                  validate: {
                    isWeekend: (value) => {
                      if (!value) return true; // Don't validate empty date values
                      const date = new Date(value);
                      const day = date.getDay();
                      if (day === 0 || day === 6) {
                        setValue("kickoffDate", ""); // Clear date field for weekend dates
                        return "Weekends are not allowed";
                      }
                      return true;
                    },
                  },
                })}
              />

              {errors.kickoffDate && (
                <span className="error-text">{errors.kickoffDate.message}</span>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="il.SelectMultiple">
              <Form.Label>IL</Form.Label>
              <div>
                <MultiSelect
                  id="designIntent"
                  value={selectedValues}
                  filter
                  placeholder="Select Design Scope"
                  options={[
                    { label: "Design Intent", value: "DI" },
                    { label: "Design Template", value: "DT" },
                    { label: "Production Ready Art", value: "PRA" },
                    { label: "New Print Feasibility", value: "PF" },
                    { label: "Ink Qualification", value: "IQ" },
                  ]}
                  onChange={handleSelectionChange}
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="customValue2.ControlInput1">
              <Form.Label>Custom Value #2</Form.Label>
              <Form.Control type="text" placeholder="Enter Custom Value #2" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="brand.SelectMultiple">
              <Form.Label>Brand</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Brand"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="bu.SelectMultiple">
              <Form.Label>BU</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select BU"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="projectName.ControlInput1">
              <Form.Label>Project Name * </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Project Name"
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="bve.SelectMultiple">
              <Form.Label>BVE</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select BVE"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="cic.SelectMultiple">
              <Form.Label>Estimated # of CIC’s *</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Estimated # of CIC’s *"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="cic.SelectMultiple">
              <Form.Label>Estimated # of CIC’s *</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Estimated # of CIC’s *"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="pm.SelectMultiple">
              <Form.Label>PM</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Project Manager"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="smo.SelectMultiple">
              <Form.Label>SMO</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select SMO"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="smo.SelectMultiple">
              <Form.Label>SMO</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select SMO"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="status.SelectMultiple">
              <Form.Label>Project Status</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Project Status"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="sop.ControlInput1">
              <Form.Label>Estimated SOP *</Form.Label>
              <Form.Control
                type="date"
                placeholder="SOP Date"
                {...register("sopDate", { required: true })}
              />
              {errors.sopDate && (
                <span className="error-text">Please select a SOP Date</span>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="hardchange.SelectMultiple">
              <Form.Label>Hard Change</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Hard Change"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="scope.SelectMultiple">
              <Form.Label>Scope</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Scope"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="btw.SelectMultiple">
              <Form.Label>Buffer to Work</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Buffer to Work"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="sos.ControlInput1">
              <Form.Label>Estimated SOS</Form.Label>
              <Form.Control
                type="date"
                placeholder="sOS Date"
                {...register("sosDate", { required: true })}
              />
              {errors.sosDate && (
                <span className="error-text">Please select a SOS Date</span>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="artworkPrint.ControlInput1">
              <Form.Label>Estimated AW@Printer *</Form.Label>
              <Form.Control
                type="date"
                placeholder="Printer Date"
                {...register("printerDate", { required: true })}
              />
              {errors.printerDate && (
                <span className="error-text">Please select a Printer Date</span>
              )}
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3" controlId="type.SelectMultiple">
              <Form.Label>Project Type</Form.Label>
              <div>
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={products}
                  optionLabel="name"
                  filter
                  placeholder="Select Project Type"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                  required
                />
              </div>
            </Form.Group>
          </Col>
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
    </Dialog>
  );
}
export default AddProject;
