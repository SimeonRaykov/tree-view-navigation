import React, { useState, Fragment } from "react";
import Project from "./Project";

export default function Company(props) {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  const showCompanyDetailsModal = function () {
    props.onClick(props.company);
  };

  const projectsJsx =
    Array.isArray(props.projects) &&
    props.projects.map((project, i) => (
      <Project key={`${project.id} - ${i}`} {...project} />
    ));

  const companyAddressJsx = (
    <>
      <span>Company address</span>
      <span key={props.address.id}>State - {props.address.state}</span>
      <span key={props.address.id}>Street - {props.address.street}</span>
    </>
  );
  return (
    <Fragment>
      <div className="company-container">
        <a onClick={showCompanyDetailsModal}>{props.name}</a>
      </div>
      {showCompanyDetails ? (
        <span>
          <span className="projectsDiv">{companyAddressJsx}</span>
          <div className="projectsDiv">{projectsJsx}</div>
        </span>
      ) : (
        ""
      )}
    </Fragment>
  );
}
