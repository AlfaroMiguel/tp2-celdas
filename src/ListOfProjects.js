import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";

// Material imports
import MaterialTable from "material-table";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import Button from "@material-ui/core/Button";
import SendDialog from "./SendDialog";

const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "white",
    border: "4px solid #FFF",
    color: "black",
    top: "40%",
    left: "40%",
    padding: "20 20 20 20"
  },
  table: {
    minWidth: 650
  },
  button: {
    margin: 10,
    height: 40,
    marginTop: 20
  },
  modal: {
    top: "50%",
    left: "50%"
  }
});

class ListOfProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: undefined,
      sendModalOpen: false
    };
  }

  componentWillUpdate() {
    const { projects } = this.state;
    if (!projects) {
      this.loadProjectsData();
    }
  }

  async loadProjectsData() {
    if (!window.contract) {
      // Contract not found (nothing we can do)
      console.log("Contract not found");
      return;
    }

    let projects = [];
    const projectCount = Number(
      await window.contract.methods.getProjectCount().call()
    );
    let indexes;
    if (projectCount === 0) {
      indexes = [];
    } else {
      indexes = Array.from(Array(projectCount), (_, index) => index);
    }
    const promises = indexes.map(async index => {
      const project = await window.contract.methods.projects(index).call();
      projects.push(project);
    });
    await Promise.all(promises);
    projects = projects.map((project, index) => ({ ...project, index }));
    console.log("projects", projects);
    this.setState({ projects });
  }

  handleOnClickSend = async index => {
    this.setState({ sendModalOpen: true, index });
    // await window.contract.methods
    //   .contribute(index, 1)
    //   .send({ from: window.account, gas: 5000000 });
  };

  audit = async index => {
    console.log("audit", index);
    await window.contract.methods
      .verifyProject(index)
      .send({ from: window.account, gas: 5000000 });
  };

  getProjectState(projectStateNumber) {
    switch (projectStateNumber) {
      case "0":
        return "Closed";
      case "1":
        return "Open";
      case "2":
        return "Canceled";
      default:
        return "";
    }
  }

  createData = project => {
    console.log("project", project);
    const createdDate = new Date(0);
    createdDate.setUTCSeconds(project.creationDate);

    const endDate = new Date(0);
    endDate.setUTCSeconds(project.endDate);

    return {
      index: project.index,
      name: project.name,
      created: createdDate.toDateString(),
      end: endDate.toDateString(),
      requested: project.amount,
      obtained: project.moneyFunded,
      state: this.getProjectState(project.state)
    };
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      sendModalOpen: false
    });
  };

  handleSubmit = async amount => {
    const index = this.state.index;

    if (!amount) {
      this.setState({
        ...this.state,
        sendModalOpen: false
      });
      return;
    }

    await window.contract.methods
      .contribute(index, amount)
      .send({ from: window.account, gas: 5000000, value: 10000 });

    await this.loadProjectsData();
    this.setState({
      ...this.state,
      sendModalOpen: false
    });
  };

  renderSendModal() {
    const { classes } = this.props;
    const { sendModalOpen } = this.state;
    return (
      <SendDialog
        sendModalOpen={sendModalOpen}
        classes={classes}
        onClose={this.handleSubmit}
      />
    );
  }

  render() {
    const { classes } = this.props;
    const { projects } = this.state;

    const rows = projects && projects.map(this.createData);

    return (
      <Paper className={classes.root}>
        {this.renderSendModal()}
        <MaterialTable
          title="Projects"
          columns={[
            { title: "Created date", field: "created" },
            { title: "End date", field: "end" },
            { title: "Requested", field: "requested" },
            { title: "Obtained", field: "obtained" },
            { title: "State", field: "state" }
            // {title:"Actions", field:},
          ]}
          actions={[
            {
              icon: "save",
              tooltip: "Save User",
              onClick: (_, rowData) => {
                this.handleOnClickSend(rowData.index);
              }
            },
            {
              icon: "audit",
              tooltip: "audit",
              onClick: (_, rowData) => {
                this.audit(rowData.index);
              }
            }
          ]}
          data={rows}
          options={{
            search: false,
            paging: false
          }}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(ListOfProjects);
