import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import SetupProject from "./SetupProject";
import SetupProjectInput from "./Input";
import SetupProjectOutput from "./Output";
import SetupProjectApi from "./Api";
import SeedUpload from "./SeedUpload";
import { lightBlue } from "@material-ui/core/colors";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`
      }
      {...other}
    >
      { value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div >
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  selectionBar: {
    background: lightBlue[200],
    color: theme.palette.common.black,
    fontSize: "1.2em",
    fontWeight: "Bold",
  },
  grid: {
    flexGrow: 1,
  },
}));

export default function ProjectSetup(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  let projectId = props.projectId;


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };


  return (
    <React.Fragment >
      <Grid justify="center" container >
        <Paper elevation={5} className={classes.root}>
          <AppBar position="static" className={classes.selectionBar}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="#ffffff"
              variant="centered"
              aria-label="full width tabs example"
              centered
            >
              <Tab label="Client Info" {...a11yProps(0)} />
              <Tab label="Input" {...a11yProps(1)} />
              <Tab label="Output" {...a11yProps(2)} />
              <Tab label="API" {...a11yProps(3)} />
              <Tab label="Seed Upload" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <SetupProject projectID={projectId} />
            </TabPanel>

            <TabPanel value={value} index={1} dir={theme.direction}>
              <SetupProjectInput projectID={projectId} />
            </TabPanel>

            <TabPanel value={value} index={2} dir={theme.direction}>
              <SetupProjectOutput projectID={projectId} />
            </TabPanel>

            <TabPanel value={value} index={3} dir={theme.direction}>
              <SetupProjectApi projectID={projectId} handleSubmitProject={props.handleSubmitProject} />
            </TabPanel>

            <TabPanel value={value} index={4} dir={theme.direction}>
              <SeedUpload projectID={projectId} />
            </TabPanel>

          </SwipeableViews>
        </Paper>
      </Grid>
    </React.Fragment >
  );
}
