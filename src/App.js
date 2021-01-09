import { useEffect, useState } from 'react';
import { fetchData, getAreaInfo, getProjectInfo, getNonParticipatingEmployees, setProjectName } from './api';
import Project from './components/Project';
import Company from './components/Company';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Card, Button } from "react-bootstrap";

Array.prototype.setAll = function (v) {
  let i, n = this.length;
  for (i = 0; i < n; ++i) {
    this[i] = v;
  }
};

function App() {
  const [data, setData] = useState([]);
  const [currentCompany, setCurrentCompany] = useState({});
  const [currentProject, setCurrentProject] = useState({});
  const [nonParticipatingEmployees, setNonParticipatingEmployees] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [areaInfo, setAreaInfo] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [editModeVals, setEditModeVals] = useState([]);

  const handleChange = (event, i) => {
    let values = [...inputValues];
    let editVals = [...editModeVals];
    values[i] = event.target.value;
    editVals[i] = true;
    setInputValues(values);
    setEditModeVals(editVals);
  }

  const handleChangeNameEvent = (event, i, id) => {
    let editVals = [...editModeVals];
    editVals[i] = false;
    setEditModeVals(editVals);
    setProjectName(id);
  }

  useEffect(() => {
    const fetchAPI = async () => {
      setData(await fetchData());
    }
    fetchAPI();
  }, []);

  function handleModalChange(e, state, company) {
    setOpenModal(state);
    if (company) {
      setCurrentCompany(company);
      setInputValues(company.projects.map(project => project.name));
      let editModeVals = [];
      for (let i = 0; i < company.projects.length; i += 1) {
        editModeVals.push(false);
      }
      setEditModeVals(editModeVals);
    }
  }

  function handleAreaChange(e, currentArea) {
    setTimeout(async () => {
      const getAreaData = await getAreaInfo(currentArea);
      setAreaInfo(getAreaData);
    }, 120);
  }

  async function handleProjectChange(e, currentProject) {
    const getProjectData = await getProjectInfo(currentProject);
    setCurrentProject(getProjectData);
    setNonParticipatingEmployees(
      await getNonParticipatingEmployees(getProjectData)
    );
  }

  const companyJsx = Array.isArray(data.companies) && data.companies.map((company, i) => (
    <Company key={`${company.id} - ${i}`} onClick={e => handleModalChange(e, true, company)} {...company} />
  ));
  const areasJsx =
    Array.isArray(data.areas) &&
    data.areas.map((area, i) => (
      <Card key={`${area} - ${i}`}>
        <Card.Header className="area-name">
          <Accordion.Toggle onClick={e => handleAreaChange(e, area)} as={Button} variant="link" eventKey={i + 1}>
            {area}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey={i + 1}>
          <Card.Body>{areaInfo.employeesCount ? `Employees - ${areaInfo.employeesCount} - Projects - ${areaInfo.projectsCount}` : 'Loading...'}</Card.Body>
        </Accordion.Collapse>
      </Card>
    ));

  const projectsJsx =
    Array.isArray(currentCompany.projects) &&
    currentCompany.projects.map((project, i) => (
      <Card key={`${project.id} - ${project.name}`}>
        <Card.Header className="project-name">
          <Accordion.Toggle as={'<div>'} onClick={e => handleProjectChange(e, project)} as={Button} variant="link" eventKey={i + 1}>
            <input className="project-name-input" onChange={e => handleChange(e, i)} value={inputValues[i]} type="text" />
            {editModeVals[i] ? <button className="btn update-project-name" onClick={e => handleChangeNameEvent(e, i, project.id)}>
            <FontAwesome
                className='fas-window-check'
                name='check'
                size='2x'
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: 'green' }}
              />
            </button> : ''}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey={i + 1}>
          <Card.Body>{project ? <Project onChange={e => handleProjectChange(e, project)} nonParticipatingEmployees={nonParticipatingEmployees} project={currentProject} /> : 'Loading'}</Card.Body>
        </Accordion.Collapse>
      </Card>
    ));

  return (
    <div className="App">
      <div style={{ display: openModal ? 'block' : 'none' }} className="overlay-wrap">
        <div className="overlay-container">
          <div className="div-btn-close">
            <button onClick={e => handleModalChange(e, false)} className="btn-modal-close">
              <FontAwesome
                className='fas-window-close'
                name='close'
                size='2x'
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: 'blue' }}
              />
            </button>
          </div>
          {currentCompany && currentCompany.address ? <>
            <h3>{currentCompany.name}</h3>
            <div className="addresses-container">
              <p className="address-title">
                Address
              </p>
              <p>
                Street - {currentCompany.address.street}
              </p>
              <p>
                State - {currentCompany.address.state}
              </p>
              <p>
                Country - {currentCompany.address.country}
              </p>
            </div>
            <div className="projects-container">
              {currentCompany.projects.length ?
                <>
                  <div className="projects-header">Projects</div>
                  <Accordion defaultActiveKey="1">
                    {projectsJsx}
                  </Accordion>
                </>
                : <div className="empty-projects">Projects are empty</div>}
            </div>
          </> : ''}
        </div>
      </div>
      <div className="wrap">
        <div className="container container-tree-view">
          <header>
            <h3>Tree view navigation</h3>
          </header>
          <div className="companies-header">
            <h5>Companies</h5>
          </div>
          <div className="companies">
            {companyJsx}
          </div>
          <div className="wrap">
            <div className="areas-header">
              <h5>Job areas</h5>
            </div>
            <Accordion defaultActiveKey="0">
              {areasJsx}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
