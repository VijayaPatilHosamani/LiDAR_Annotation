/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react'
import { Button, IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import SupervisorHeader from "..";
import { ProjectSelector } from "../../../../Store/Project";
import ProjectViewHeader from '../../ProjectViewHeader';
import { withStyles } from '@material-ui/core/styles';
import { orange } from "@material-ui/core/colors";
import { setStatusBar } from "../../../../Store/Site/ActionCreator";
import { updateTaskType } from "../../../../Store/Project/ActionCreator";
import { SampleTableHandler } from "./SampleTableHandler";
import SampleViewer from "./SampleViewer";
import { store } from "../../../..";
import Autocomplete from '@material-ui/lab/Autocomplete';


import { InputAdornment, Checkbox, Paper, FormControlLabel, Typography,
    Grid, FormLabel, FormGroup, FormControl, TextField, RadioGroup, Radio
 } from '@material-ui/core'
import { Label, Search } from "@material-ui/icons"
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import API from "../../../../Api";
import { GetTasksLogs, handleJsonDownload } from "../../../../Handlers/downloadHandler";

export class Sample extends React.Component {
    constructor(props) {
        super(props);
        const ProjectId = ProjectSelector.GetCurrentProjectId();
        if (ProjectId === null || ProjectId === undefined || ProjectId === "") {
            store.dispatch(setStatusBar(true, "Error", "Couldn't Get Project Id!"));
            this.props.history.push("/projects");
        }
        let currentProject = ProjectSelector.GetCurrentProject();
        if (currentProject === null) {
            store.dispatch(setStatusBar(true, "error", "Couldn't Get Selected Project data"))
            props.history.push("/projects");
        }
        this.state = {
            ProjectId: ProjectId,
            requestForInProgress: false,
            requestForCompleted: true,
            requestForNew: false,
            dialogOpen: false,
            nTasks: 0,
            tasks: [],
            samples: [],
            taskIds: "",
            agentName: "",
            agentNames: [],
            batchId: "",
            sampleType: "everyNtask",
            fromDate: new Date(),
            toDate: new Date(),
            selected: false,
            selectedSampleTasks: [],
        }
        this.setState({
            fromDate: this.state.fromDate.setDate(this.state.fromDate.getDate() - 1),
            toDate: this.state.toDate.setDate(this.state.toDate.getDate() - 1)
        })
        this.handleSampleDelete = this.handleSampleDelete.bind(this);
    }

    GetAllUsersData = () => {
        store.dispatch(setStatusBar(true, "Load", "Loading..."));
        API.GetAllUsers().then(response => {
            let agentNames = []
            response.data.forEach(row => {
                agentNames.push({name: (row.UserName)})
            })
            this.setState({ agentNames: agentNames});
        }).catch((error) => {
            store.dispatch(setStatusBar(true, "Error", "Error in Server Cannot get UserNames, try again"));
            console.error(error);
        })
    }


    handleSelectingSample = (taskIds) => {
        this.setState({
            selected: true,
            selectedSampleTasks: taskIds
        })
    }

    unselectSample = () => {
        this.setState({ selected: false, selectedSampleTasks:[] })
    }

    handleGetData = ()=>{
        store.dispatch(setStatusBar(true, "Load", "Getting samples..."))
        API.GetTasksLogByProjectID(this.state.ProjectId)
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
                store.dispatch(setStatusBar(true, "error", "Server error in Getting TaskLog, Try Again!"))
                console.error(error);
            })
        API.GetSamplesForProject(this.state.ProjectId).then((response) => {
            this.setState({ samples: response });
            store.dispatch(setStatusBar(true, "success", "samples loaded successfully"))
        }).catch(error => {
            store.dispatch(setStatusBar(true, "error", "Server error in Getting Samples, Try Again!"))
            console.error(error);
        })
    }

    componentDidMount() {
        this.handleGetData();
        this.GetAllUsersData();
    }

    handleSampleDelete = (sampleId) =>{
        store.dispatch(setStatusBar(true, "Load", "Deleting..."))
        API.DeleteSample(this.state.ProjectId, sampleId ).then((()=>{
            store.dispatch(setStatusBar(true, "success", "Deleted Successfully."))
            this.handleGetData();
        })).catch((error)=> {
            store.dispatch(setStatusBar(true, "error", "Server Error Couldn't Delete Sample, Try Again! "))
            console.error(error)
        })
    }


    TaskIDFilter = (items) => {
        let tasks = this.state.taskIds.split(',');
        let filteredItems = items.filter((item) => {
            return tasks.filter(task => item.TaskId.toLowerCase().includes(task.trim().toLowerCase())).length > 0; //for similarity match
            //return tasks.filter(task => item.TaskId.toLowerCase() === task.trim().toLowerCase()).length > 0;  //for exact match
        })
        return filteredItems;
    }

    statusFilter = (items) => {
        let filteredItems = items.filter((item) => {
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
        return filteredItems;
    }

    batchIdFilter = (items) => {
        let filteredItems = items.filter((item) =>{
            if (item.BatchId === this.state.batchId){
                    return true;
                }
                return false;
            }
        )
        return filteredItems;
    }


    dateRangeFilter = (items) => {
        let filteredItems = items.filter((item) => {
            debugger;
            let date = new Date(item.Date)
            let moreThanFrom = date >= this.state.fromDate;
            let lessThanTo = date <= this.state.toDate;
            if (lessThanTo && moreThanFrom) {
                return true;
            }
            return false;
        })
        return filteredItems;
    }

    handleToDateChange = (date) => {
        if (date >= this.state.fromDate && date <= new Date()) {
            this.setState({ toDate: date });
        }
    }

    handleFromDateChange = (date) => {
        if (date <= this.state.toDate && date <= new Date()) {
            this.setState({ fromDate: date });
        }
    }

    handleAgentName = (items) => {
        let filteredItems = items.filter((item) => {
            if (item.UserName === this.state.agentName.name) {
                return true;
            }
            return false;
            }
        )
        return filteredItems;
    }

    nTasks = (items) => {
        let filteredItems = items.filter((item, index) => {
            if ((index +1) % this.state.nTasks === 0) {
                return true;
            }
            return false;
        })
        return filteredItems;
    }

    handleClose = () => {
        this.setState({ dialogOpen: false })
    }

    handleClickOpen = () => {
        this.setState({ dialogOpen: true })
    }

    handleCreateSample = () =>{
        this.handleClose()
        store.dispatch(setStatusBar(true, "Load", "Processing..."));
        let sampleTasks = this.state.tasks;
        sampleTasks = this.statusFilter(sampleTasks);
        if (this.state.batchId !== "") {
            sampleTasks = this.batchIdFilter(sampleTasks);
        }
        if(this.state.taskIds !== ""){
            sampleTasks = this.TaskIDFilter(sampleTasks);
        }
        if (this.state.agentName !== ""){
            sampleTasks = this.handleAgentName(sampleTasks);
        }
        sampleTasks = this.dateRangeFilter(sampleTasks);
        if (this.state.sampleType === "everyNtask"){
            if(this.state.nTasks <=0){
                store.dispatch(setStatusBar(true, "Error", "N Number is must be greater than 0."));
                return;
            }
            sampleTasks = this.nTasks(sampleTasks);
        }
        let sampleTaskIds = [];
        if(sampleTasks.length >0){
            sampleTasks.forEach(task => {
                sampleTaskIds.push(task.TaskId);
            });
            API.CreateNewSample(
                this.state.ProjectId,
                sampleTaskIds
            ).then((sampleId) =>{
                store.dispatch(setStatusBar(true,"success","Created New Sample."))
                setTimeout(this.handleGetData, 1000);
            }).catch((error)=>{
                store.dispatch(setStatusBar(true, "Error", "Server Error, Try Again!"))
                console.error(error);
            })
        }
        else{
            store.dispatch(setStatusBar(true, "Error", "Zero Tasks Fit into the Selected Filter, so sample not created."))
        }
    }

    handleDownloadJSON = (tasks) =>{
        store.dispatch(setStatusBar(true, "Load", "Processing."))
        GetTasksLogs(tasks, this.state.ProjectId).then((logs)=>{
            handleJsonDownload(logs)
            store.dispatch(setStatusBar(true, "success", "Processed Successfully."))
        })
        .catch((error)=>{
            console.error(error);
            store.dispatch(setStatusBar(true, "Error", "Error in Getting Logs from Server, Try Again"))
        })
    }


    render =() => {
        return (
        <>
            <ProjectViewHeader />
            <SupervisorHeader />
            {!this.state.selected &&  (
                <div>
                <Paper >
                    <Grid container alignItems="center" style={{ padding: '20px' }}>
                        <Grid item sm={true}></Grid>

                        <Grid item sm={2}>
                            <TextField InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} label="Task Id" name="searchBar" value={this.state.taskIds} onChange={(event) => this.setState({ taskIds: event.target.value })} />
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
                                    <Checkbox checked={this.state.requestForInProgress} onChange={() => this.setState({ requestForInProgress: !this.state.requestForInProgress })} inputProps={{ 'aria-label': 'primary checkbox' }} />} label="InProgress" />
                                <FormControlLabel control={
                                    <Checkbox checked={this.state.requestForCompleted} onChange={() => this.setState({ requestForCompleted: !this.state.requestForCompleted })} inputProps={{ 'aria-label': 'primary checkbox' }} />} label="Completed" />
                            </FormGroup>
                        </Grid>
                        <Grid item sm={true}></Grid>
                    </Grid>

                    <Grid container style={{ padding: '20px' }}>
                        <Grid item sm={true}></Grid>

                        <Grid item sm={2}>
                            <Autocomplete
                                id="AutoAgentName"
                                options={this.state.agentNames}
                                getOptionLabel={(option) => option.name}
                                value={this.state.agentName}
                                onChange={(event, newValue) => {
                                    this.setState({agentName:newValue});
                                }}
                                        renderInput={(params) => <TextField label="AgentName" {...params}/>}
                            />
                        </Grid>
                        <Grid item sm={1}> </Grid>

                        <Grid item sm={2}> <TextField label="BatchID" value={this.state.batchId} onChange={(event) => this.setState({ batchId: event.target.value })}  /> </Grid>
                        <Grid item sm={1}> </Grid>
                        <Grid item sm={2}> <Button variant="contained" color="default" onClick={this.handleClickOpen}> Create Sample </Button>  </Grid>
                        <Grid item sm={true}></Grid>
                    </Grid>

                    <Dialog open={this.state.dialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Sample</DialogTitle>
                        <DialogContent>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Sample Type</FormLabel>
                                <RadioGroup aria-label="sampleType" name="sampleType" value={this.state.sampleType} onChange={(event) => this.setState({ sampleType: event.target.value })} >
                                    <FormControlLabel value="everyNtask" control={<Radio />} label="Every N Tasks" />
                                    <FormControlLabel value="fullBatch" control={<Radio />} label="100% in the Batch" />
                                </RadioGroup>
                                <TextField
                                    autoFocus
                                    id="tasks"
                                    label="Tasks"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={this.state.sampleType === "everyNtask"? this.state.nTasks: 0}
                                    onClick={(event) => this.setState({ nTasks: event.target.value })}
                                    disabled={this.state.sampleType === "everyNtask" ? false : true}
                                    onChange={(event)=>this.setState({nTasks: parseInt(event.target.value) })}
                                />
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                                Cancel
                    </Button>
                            <Button onClick={this.handleCreateSample} color="primary">
                                Create Sample
                    </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
                        <SampleTableHandler data={this.state.samples} handleExport={this.handleDownloadJSON} handleSampleDelete={this.handleSampleDelete} handleSelectingSample={this.handleSelectingSample}/>
                </div>
            )
            }
            { this.state.selected && (
                <div>
                    <SampleViewer unselectSample={this.unselectSample} projectId={this.state.ProjectId} taskIds={this.state.selectedSampleTasks}/>
                </div>

            )}
        </>
        )
    }
}

export default Sample