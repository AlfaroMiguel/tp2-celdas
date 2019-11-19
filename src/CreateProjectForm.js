import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";

// Material imports
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "white"
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: 200
  },
  button: {
    margin: 10,
    height: 40,
    marginTop: 20
  }
});

class CreateProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: undefined,
      amount: undefined,
      duration: undefined
    };
  }

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
    console.log("name", name);
    console.log("value", value);
  };

  createProject = async () => {
    const { projectName, amount, duration } = this.state;
    console.log("createProject");
    console.log("projectName, amount, duration");
    console.log(projectName, amount, duration);
    await window.contract.methods
      .createProject(projectName, amount, duration)
      .send({ from: window.account, gas: 5000000 });
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Complete your project information below and press the Create button.
        </Typography>
        <div>
          <TextField
            id="projectName"
            name="projectName"
            className={classes.textField}
            label="Project's Name"
            margin="normal"
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <TextField
            id="amount"
            name="amount"
            className={classes.textField}
            label="Amount Needed (ETH)"
            margin="normal"
            type="number"
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <TextField
            id="duration"
            name="duration"
            className={classes.textField}
            label="Duration (days)"
            margin="normal"
            type="number"
            onChange={this.handleInputChange}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.createProject}
        >
          Create
        </Button>
      </Paper>
    );
  }
}

export default withStyles(styles)(CreateProjectForm);
