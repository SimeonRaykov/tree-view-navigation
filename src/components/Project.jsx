import React, { useState } from "react";
import { removeEmployeeFromProject, addEmployeeToProject } from "../api";
import Select from "react-select";
import FontAwesome from "react-fontawesome";

export default function Project(props) {
  const [selectedEmployee, setSelectedEmployee] = useState();
  const removeEmployeeEvent = function (e, employeeID) {
    removeEmployeeFromProject(props.project.projectID, employeeID);
    props.onChange();
  };

  function handleSelection(e) {
    setSelectedEmployee(e);
  }

  const addEmployeeEvent = function () {
    addEmployeeToProject(props.project.projectID, selectedEmployee.value);
    if (props.nonParticipatingEmployees.length > 1) {
      if (selectedEmployee.value !== props.nonParticipatingEmployees[0].value) {
        setSelectedEmployee(props.nonParticipatingEmployees[0]);
      } else {
        setSelectedEmployee(props.nonParticipatingEmployees[1]);
      }
    }
    props.onChange();
  };

  const employeesJsx =
    props.project &&
    Array.isArray(props.project.employees) &&
    props.project.employees.map((employee, i) => (
      <div className="employee-container" key={`${employee.id} - ${i}`}>
        <div className="div-btn-remove">
          <button
            onClick={(e) => removeEmployeeEvent(e, employee.id)}
            className="btn-remove-employee"
          >
            <FontAwesome
              className="fas-window-close"
              name="close"
              size="2x"
              style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)", color: "red" }}
            />
          </button>
        </div>
        <div>
          {employee.firstName} - {employee.lastName}
        </div>
      </div>
    ));

  return (
    <div key={props.id}>
      <div>
        <div className="employees-header">
          {props.project.employees && props.project.employees.length
            ? "Employees"
            : "There are no employees for this project"}
        </div>
        {employeesJsx}
        <Select
          className={"select-employees"}
          value={selectedEmployee}
          onChange={(event) => handleSelection(event)}
          options={props.nonParticipatingEmployees}
        />
        {selectedEmployee ? (
          <button
            onClick={(e) => addEmployeeEvent(e)}
            className="btn-add-employee btn"
          >
            <FontAwesome
              className="fas-window-check"
              name="check"
              size="2x"
              style={{
                textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                color: "green",
              }}
            />
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
