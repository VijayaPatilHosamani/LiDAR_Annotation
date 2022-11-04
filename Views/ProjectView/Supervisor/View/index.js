/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { TableHead, TableRow, TableCell, TableSortLabel, TextField, RadioGroup, Radio } from '@material-ui/core'
import { InputAdornment, Button, Checkbox, Paper, FormControlLabel, Typography, Grid, FormLabel, FormGroup, FormControl, Box } from '@material-ui/core'
import { Label, Search } from "@material-ui/icons"
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { ProjectSelector } from "../../../../Store/Project";
import API from "../../../../Api";
import SupervisorHeader from "..";
import ProjectViewHeader from '../../ProjectViewHeader';
import { store } from "../../../..";
import { setStatusBar } from "../../../../Store/Site/ActionCreator";
import ViewTableHandler from "./ViewTableHandler";
import { GetTasksLogs, GetTasksLogsDifferentFormat, handleJsonDownload, handleCSVDownload } from "../../../../Handlers/downloadHandler";
import { createHashHistory } from 'history';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export class View extends React.Component {
    constructor(props) {
        super(props);
        const ProjectId = ProjectSelector.GetCurrentProjectId();
        if (ProjectId === null) {
            if (this.history) {
                this.history.push(("/projects"));
            }
            else {
                const history = createHashHistory();
                history.push("/projects");
            }
        }
        this.state = {
            ProjectId: ProjectId,
            requestForInProgress: true,
            requestForCompleted: true,
            requestForNew: false,
            tasks: [],
            taskIds: "",
            fromDate: new Date(),
            toDate: new Date(),
            dialogOpen: false
        }
        this.setState({
            fromDate: this.state.fromDate.setDate(this.state.fromDate.getDate() - 1),
            toDate: this.state.toDate.setDate(this.state.toDate.getDate() - 1)
        })
    }

    componentDidMount() {
        API.GetTasksByProjectID(this.state.ProjectId)
            .then((response) => {
                response.forEach(task => {
                    let status = "New";
                    if (task.IsTaskcompleted) {
                        status = "InProgress";
                        if (task.IsReviewComplete) {
                            status = "Completed";
                        }
                    }
                    task["status"] = status;
                })
                this.setState({ tasks: response });
            }).catch(error => {
                store.dispatch(setStatusBar(true, "error", "Server error in Getting Task Log, Try Again!"))
                console.error(error);
            })
    }

    TaskIDFilter = (items) => {
        let tasks = this.state.taskIds.split(',');
        return items.filter((item) => {
            return tasks.filter(task => item.TaskId.toLowerCase().includes(task.trim().toLowerCase())).length > 0;
            //return tasks.filter(task => item.TaskId.toLowerCase() === task.trim().toLowerCase());
        })
    }

    statusFilter = (items) => {
        return items.filter((item) => {

            if (this.state.requestForCompleted && item.status === "Completed") {
                return true;
            }
            if (this.state.requestForInProgress && item.status === "InProgress") {
                return true;
            }
            if (this.state.requestForNew && item.status === "New") {
                return true;
            }
            return false;
        })
    }


    dateRangeFilter = (items) => {
        return items.filter((item) => {
            if (Date(item.date) >= Date(this.state.fromDate) && Date(item.date) <= Date(this.state.toDate)) {
                return true;
            }
            return false;
        })
    }

    handleToDateChange = (date) => {
        if (date >= this.state.fromDate && date <= new Date()) {
            this.setState({ toDate: date });
        }
    }

    handleFromDateChange = (date) => {
        if (date <= this.state.fromDate && date <= new Date()) {
            this.setState({ fromDate: date });
        }
    }

    handleTaskSelection = (taskid) => {
        if (this.state.tasks) {
            this.state.tasks.forEach((task) => {
                if (task.TaskId === taskid) {
                    task.selected = !task.selected;
                }
            })

            this.setState({ tasks: this.state.tasks });
        }
    }

    handleDownloadJSON = () => {
        store.dispatch(setStatusBar(true, "Load", "Processing..."))
        let selected = this.state.tasks.filter((task) => task.selected);
        let taskIds = [];
        selected.forEach((task => taskIds.push(task.TaskId)));

        GetTasksLogs(taskIds, this.state.ProjectId).then(json => {

            handleJsonDownload(json);
            store.dispatch(setStatusBar(true, "success", "Done Processing"))
        })
        this.handleClose();
    }

    handleDownloadJSONOther = () => {
        store.dispatch(setStatusBar(true, "Load", "Processing..."))
        let selected = this.state.tasks.filter((task) => task.selected);
        let taskIds = [];
        selected.forEach((task => taskIds.push(task.TaskId)));
        GetTasksLogsDifferentFormat(taskIds, this.state.ProjectId).then(json => {
            handleJsonDownload(json);
            store.dispatch(setStatusBar(true, "success", "Done Processing"))
        })
        this.handleClose();

    }
    handleDownloadCSV = () => {
        store.dispatch(setStatusBar(true, "Load", "Processing..."))
        let selected = this.state.tasks.filter((task) => task.selected);
        let taskIds = [];
        selected.forEach((task => taskIds.push(task.TaskId)));
        GetTasksLogs(taskIds, this.state.ProjectId).then(json => {
            handleCSVDownload(json);
            store.dispatch(setStatusBar(true, "success", "Done Processing"))
        })
            .catch(err => {
                console.error(err);
                store.dispatch(setStatusBar(true, "error", "Cannot process csv from data."))
            });
        this.handleClose();
    }

    handleClose = () => {
        this.setState({ dialogOpen: false })
    }

    handleOpen = () => {
        this.setState({ dialogOpen: true })
    }

    render() {
        let filteredTasks = this.state.tasks;
        if (this.state.taskIds !== "") {
            filteredTasks = this.TaskIDFilter(filteredTasks);
        }
        filteredTasks = this.statusFilter(filteredTasks);

        filteredTasks = this.dateRangeFilter(filteredTasks);

        return (
            <>
                <ProjectViewHeader />
                <SupervisorHeader />
                <Paper >
                    <Grid container alignItems="center" style={{ padding: '20px' }}>
                        <Grid item sm={true}></Grid>

                        <Grid item sm={2}>
                            <TextField InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} label="Task Id" name="searchBar"
                                value={this.state.taskIds} onChange={(event) => this.setState({ taskIds: event.target.value })} />
                        </Grid>
                        <Grid item sm={2} >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker format="dd/MM/yyyy" id="fromDate" name="fromDate" label="From Date" value={this.state.fromDate} onChange={date => this.handleFromDateChange(date)} />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item sm={2} >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker format="dd/MM/yyyy" id="toDate" name="toDate" label="To Date" value={this.state.toDate} onChange={date => this.handleToDateChange(date)} />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item sm={1}></Grid>
                        <Grid item sm={1}><FormLabel component="legend">Status</FormLabel></Grid>
                        <Grid item sm={2}>
                            <FormGroup>
                                <FormControlLabel control={
                                    <Checkbox checked={this.state.requestForNew} onChange={() => this.setState({ requestForNew: !this.state.requestForNew })} inputProps={{ 'aria-label': 'primary checkbox' }} />} label="New" />
                                <FormControlLabel control={
                                    <Checkbox checked={this.state.requestForInProgress} onChange={() => this.setState({ requestForInProgress: !this.state.requestForInProgress })} inputProps={{ 'aria-label': 'primary checkbox' }} />} label="InProgress" />
                                <FormControlLabel control={
                                    <Checkbox checked={this.state.requestForCompleted} onChange={() => this.setState({ requestForCompleted: !this.state.requestForCompleted })} inputProps={{ 'aria-label': 'primary checkbox' }} />} label="Completed" />
                            </FormGroup>
                        </Grid>
                        <Grid item sm={true}></Grid>
                    </Grid>

                    <Grid container style={{ padding: '20px' }}>
                        <Grid item sm={1}></Grid>
                        <Grid item sm={2}>   <Button variant="contained" color="default" onClick={this.handleOpen}> Download</Button> </Grid>
                        <Grid item sm={true}></Grid>
                    </Grid>


                    <Dialog open={this.state.dialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Download Selector</DialogTitle>
                        <DialogContent>
                            <Box styles={{ margin: '10px' }}>
                                <Button onClick={this.handleDownloadJSON} variant="contained" color="secondary">
                                    Download Json
                                        </Button>
                            </Box>
                            <Box styles={{ margin: '10px' }}>
                                <Button onClick={this.handleDownloadJSONOther} variant="contained" color="secondary">
                                    Download Json Other Types
                                        </Button>
                            </Box>
                            <Box styles={{ margin: '10px' }}>
                                <Button onClick={this.handleDownloadCSV} variant="contained" color="secondary">
                                    Download csv
                                        </Button>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Paper>
                <ViewTableHandler tasks={filteredTasks} taskSelection={this.handleTaskSelection} />
            </>
        )
    }
}

export default View;
