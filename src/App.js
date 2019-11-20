import React, { Component } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./config";
import Web3 from "web3";

// Material imports
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import PropTypes from "prop-types";
import CreateProjectForm from "./CreateProjectForm";
import ListOfProjects from "./ListOfProjects";
class App extends Component {
  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
    console.log("web3", web3);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    window.web3 = web3;
    window.account = account;
    window.contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    console.log("account", window.account);
    console.log("contract", window.contract);
  }

  render() {
    return <AppTabs />;
  }
}

// Other Material Components

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  title: {
    flexGrow: 1
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  button: {
    margin: theme.spacing(1),
    height: 40,
    marginTop: 20
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

function AppTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            TP2 Celdas
          </Typography>
        </Toolbar>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Create Project" {...a11yProps(0)} />
          <Tab label="Project List" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <CreateProjectForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ListOfProjects />
      </TabPanel>
    </div>
  );
}

export default App;
