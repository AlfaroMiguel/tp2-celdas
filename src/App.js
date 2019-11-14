import React, { Component } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./config";
import Web3 from "web3";
import "./App.css";

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    console.log("web3", web3);
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);
    this.setState({ account: accounts[0] });
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    window.contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    this.setState({ contract });
    let projects = [];
    const projectCount = Number(
      await contract.methods.getProjectCount().call()
    );
    let indexes;
    if (projectCount === 0) {
      indexes = [];
    } else {
      indexes = Array.from(Array(projectCount - 1), (_, index) => index);
    }
    const promises = indexes.map(async index => {
      const project = await contract.methods.projects(index).call();
      projects.push(project);
    });
    await Promise.all(promises);
    projects = projects.map((project, index) => ({ ...project, index }));
    this.setState({ projects });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      projects: [],
      projectName: undefined,
      amount: undefined,
      days: undefined
    };
  }

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  };

  createProject = async () => {
    const { projectName, amount, days } = this.state;
    await window.contract.methods
      .createProject(projectName, amount, days)
      .send({ from: this.state.account, gas: 5000000 });
    console.log(projectName, amount, days);
  };

  pay = async index => {
    console.log("pay", index);
    await window.contract.methods
      .contribute(index, 1)
      .send({ from: this.state.account, gas: 5000000 });
  };

  audit = async index => {
    console.log("audit", index);
    await window.contract.methods.verifyProject(index).send({ from: this.state.account, gas: 5000000 });
  };

  renderCreateProject() {
    return (
      <div>
        <h2>Create Project</h2>
        <div>
          <input
            id="projectName"
            name="projectName"
            fullWidth
            className="input"
            placeholder="Project's name"
            onChange={this.handleInputChange}
            autoFocus
          />
        </div>
        <div>
          <input
            id="amount"
            name="amount"
            fullWidth
            type="number"
            className="input"
            placeholder="Requested amount"
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <input
            id="days"
            name="days"
            fullWidth
            type="number"
            className="input"
            placeholder="Duration"
            onChange={this.handleInputChange}
          />
        </div>
        <button
          variant="contained"
          color="primary"
          onClick={this.createProject.bind(this)}
        >
          Create Project
        </button>
      </div>
    );
  }

  getProjectState(projectStateNumber){
    switch (projectStateNumber){
      case "0":
        return "Closed"
      case "1":
        return "Open"
      case "2":
        return "Canceled"
      default:
          return ""
    }
    ;
  }

  renderProjectItem(project) {
    console.log("project", project);

    const creationDate = new Date(0);
    creationDate.setUTCSeconds(project.creationDate);

    const endDate = new Date(0);
    endDate.setUTCSeconds(project.endDate);

    return (
      <tr key={project.index}>
        <td>{project.index}</td>
        <td>{project.name}</td>
        <td>{creationDate.toDateString()}</td>
        <td>{endDate.toDateString()}</td>
        <td>{project.amount}</td>
        <td>{project.moneyFunded}</td>
        <td>{this.getProjectState(project.state)}</td>
        <td>
          <button onClick={() => this.pay(project.index)}>Contribute</button>
        </td>
        <td>
          <button onClick={() => this.audit(project.index)}>Audit</button>
        </td>
      </tr>
    );
  }

  renderProjectList() {
    const { projects } = this.state;
    console.log("projects", projects);
    return (
      <div>
        <h2>Project List</h2>
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>Created</th>
              <th>End</th>
              <th>Requested</th>
              <th>Obtained</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => this.renderProjectItem(project))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <h1>TP2 Celdas</h1>
        {this.renderCreateProject()}
        {this.renderProjectList()}
      </div>
    );
  }
}

export default App;
