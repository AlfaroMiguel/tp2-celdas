import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";

// Material imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  button: {
    margin: 10,
    height: 40,
    marginTop: 20
  }
});

class ListOfProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: undefined
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
      indexes = Array.from(Array(projectCount - 1), (_, index) => index);
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

  send = async index => {
    console.log("send", index);
    await window.contract.methods
      .contribute(index, 1)
      .send({ from: window.account, gas: 5000000 });
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

  render() {
    const { classes } = this.props;
    const { projects } = this.state;

    const rows = projects && projects.map(this.createData);

    return (
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell align="right">Created date</TableCell>
              <TableCell align="right">End date</TableCell>
              <TableCell align="right">Requested</TableCell>
              <TableCell align="right">Obtained</TableCell>
              <TableCell align="right">State</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.created}</TableCell>
                  <TableCell align="right">{row.end}</TableCell>
                  <TableCell align="right">{row.requested}</TableCell>
                  <TableCell align="right">{row.obtained}</TableCell>
                  <TableCell align="right">{row.state}</TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Send
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Audit
                  </Button>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(ListOfProjects);
