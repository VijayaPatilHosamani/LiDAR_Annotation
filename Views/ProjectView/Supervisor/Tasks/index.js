import React, { Component } from 'react';
import ProjectViewHeader from "../../ProjectViewHeader";
import SupervisorHeader from "..";
import { Typography } from '@material-ui/core';
import { withStyles } from "@material-ui/styles"

import Toolbar from '@material-ui/core/Toolbar';

import { updateTaskType } from "../../../../Store/Project/ActionCreator";

import { store } from "../../../..";
import { setStatusBar } from "../../../../Store/Site/ActionCreator";
import { ProjectSelector } from "../../../../Store/Project";
import {API} from "../../../../Api";
import TaskTimeline from "./TaskTimeline";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const style = (theme) => ({
    title: {
        marginRight: theme.spacing(5),
    },
    DatePicker: {
        marginLeft: theme.spacing(5),
    },
});

class SupervisorTasks extends Component {
    constructor(props) {
        super(props);
        store.dispatch(updateTaskType(null))

        let projectId = ProjectSelector.GetCurrentProjectId()
        if (projectId === null || projectId === undefined || projectId === "") {
            store.dispatch(setStatusBar(true, "error", "No Project Selected"))
            this.props.history.push("/projects");
        }
        let currentProject = ProjectSelector.GetCurrentProject();
        if (currentProject === null) {
            store.dispatch(setStatusBar(true,"error","No Project Selected"))
            this.props.history.push("/projects");
        }

        this.state = {
            projectId: projectId,
            currentProject: currentProject,
            productionDate : new Date(),
            reviewDate : new Date(),
            production: [],
            review: [],
            tasks: []
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        API.GetTasksLogByProjectID(this.state.projectId).then((tasks) =>{
            this.setState({tasks: tasks})
            setTimeout(this.handleChange, 500);
        }).catch(error=>{
            console.error(error);
            store.dispatch(setStatusBar(true, "error", error.message ? error.message : "Server error in getting Tasks logs, try again later!"));
        })
    }

    handleChange(){
        store.dispatch(setStatusBar(true, "Load", "Loading Changes..."));
        let productionData = this.filterData(this.state.tasks, "Production");
        let reviewData = this.filterData(this.state.tasks, "Review");
        this.setState({ production: productionData, review: reviewData });
        store.dispatch(setStatusBar(true, "success", "Loaded User logs"));
    }

    handleProductionDateChange = (date) => {
        this.setState({ productionDate: date });
        setTimeout(this.handleChange, 500);
    }
    handleReviewDateChange = (date) => {
        this.setState({ reviewDate: date });
        setTimeout(this.handleChange, 500);
    }


    filterData = (taskLogs, taskType) => {
        let dateFilter;

        if(taskType === "Production"){
            dateFilter = new Date(this.state.productionDate);
        }
        else if (taskType === "Review"){
            dateFilter = new Date(this.state.reviewDate);
        }
        else{
            return null;
        }
        let dateFilteredTasks = taskLogs.filter(tasks => {
            let taskEndDate = new Date(tasks.Date);
            if (taskEndDate.toDateString() === dateFilter.toDateString()){
                if (tasks.IsTaskcompleted && !tasks.IsReviewComplete && taskType === "Production") {
                    return true;
                }
                else if (tasks.IsReviewComplete && taskType === "Review"){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        });

        let usersList = {};

        dateFilteredTasks.forEach(task=>{
            let userList = {
                agentName : "No User",
                hour1: 0,
                hour2: 0,
                hour3: 0,
                hour4: 0,
                hour5: 0,
                hour6: 0,
                hour7: 0,
                hour8: 0,
                hour9: 0,
                hour10: 0,
                hour11: 0,
                hour12: 0,
                hour13: 0,
                hour14: 0,
                hour15: 0,
                hour16: 0,
                hour17: 0,
                hour18: 0,
                hour19: 0,
                hour20: 0,
                hour21: 0,
                hour22: 0,
                hour23: 0,
                hour24: 0,
                total: 0,
            }
            let userID = task.Userid;
            if (usersList[userID]){
                userList = usersList[userID];
            }
            userList.agentName = task.UserName;

            {
                let taskEndTime = task.EndTimeStamp;
                let taskEndHour = taskEndTime.substring(0,2);
                if (taskEndHour === "00"){
                    userList.hour1 = userList.hour1+1;
                }
                else if (taskEndHour === "01"){
                    userList.hour2 = userList.hour2 +1;
                }
                else if (taskEndHour === "02") {
                    userList.hour3 = userList.hour3 + 1;
                }
                else if (taskEndHour === "03") {
                    userList.hour4 = userList.hour4 + 1;
                }
                else if (taskEndHour === "04") {
                    userList.hour5 = userList.hour5 + 1;
                }
                else if (taskEndHour === "05"){
                    userList.hour6 = userList.hour6 + 1;
                }
                else if (taskEndHour === "06"){
                    userList.hour7 = userList.hour7 + 1;
                }
                else if (taskEndHour === "07"){
                    userList.hour8 = userList.hour8 + 1;
                }
                else if (taskEndHour === "08"){
                    userList.hour9 = userList.hour9 + 1;
                }
                else if (taskEndHour === "09"){
                    userList.hour10 = userList.hour10 + 1;
                }
                else if (taskEndHour === "10") {
                    userList.hour11 = userList.hour11 + 1;
                }
                else if (taskEndHour === "11") {
                    userList.hour12 = userList.hour12 + 1;
                }
                else if (taskEndHour === "12") {
                    userList.hour13 = userList.hour13 + 1;
                }
                else if (taskEndHour === "13") {
                    userList.hour14 = userList.hour14 + 1;
                }
                else if (taskEndHour === "14") {
                    userList.hour15 = userList.hour15 + 1;
                }
                else if (taskEndHour === "15") {
                    userList.hour16 = userList.hour16 + 1;
                }
                else if (taskEndHour === "16") {
                    userList.hour17 = userList.hour17 + 1;
                }
                else if (taskEndHour === "17") {
                    userList.hour18 = userList.hour18 + 1;
                }
                else if (taskEndHour === "18") {
                    userList.hour19 = userList.hour19 + 1;
                }
                else if (taskEndHour === "19") {
                    userList.hour20 = userList.hour20 + 1;
                }
                else if (taskEndHour === "20") {
                    userList.hour21 = userList.hour21 + 1;
                }
                else if (taskEndHour === "21") {
                    userList.hour22 = userList.hour22 + 1;
                }
                else if (taskEndHour === "22") {
                    userList.hour23 = userList.hour23 + 1;
                }
                else if (taskEndHour === "23") {
                    userList.hour24 = userList.hour24 + 1;
                }

                userList.total = userList.hour1 + userList.hour2 + userList.hour3 + userList.hour4 + userList.hour5 + userList.hour6 + userList.hour7 + userList.hour8 + userList.hour9 + userList.hour10 + userList.hour11 + userList.hour12 + userList.hour13 + userList.hour14 + userList.hour15 + userList.hour16 + userList.hour17 + userList.hour18 + userList.hour19 + userList.hour20 + userList.hour21 + userList.hour22 + userList.hour23 + userList.hour24;
            }
            usersList[userID] = userList;
        })

        let data = Object.keys(usersList).map((key)=> usersList[key]);

        return data;
    }


    render() {
        const { classes } = this.props;
        return (
            <div className="animated fadeIn" >
                <ProjectViewHeader />
                <SupervisorHeader />
                <React.Fragment>
                    <div>
                        <Toolbar >
                            <Typography variant="h6" className={classes.title} component="div">
                                Production
                            </Typography>

                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker format="dd/MM/yyyy" value={this.state.productionDate} onChange={this.handleProductionDateChange} />
                            </MuiPickersUtilsProvider>
                        </Toolbar>
                        <TaskTimeline name="Production" rows={this.state.production} />
                    </div>
                    <div>
                        <Toolbar>
                            <Typography variant="h6" className={classes.title} component="div">
                                Review
                            </Typography>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker format="dd/MM/yyyy" value={this.state.reviewDate} onChange={this.handleReviewDateChange} />
                            </MuiPickersUtilsProvider>
                        </Toolbar>
                        <TaskTimeline name="Review" rows={this.state.review} />
                    </div>
                </React.Fragment>
            </div>
        );
    }
}

export default withStyles(style)(SupervisorTasks);