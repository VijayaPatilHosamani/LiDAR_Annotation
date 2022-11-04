/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { connect } from "react-redux";

import { Box, Input, Typography } from '@material-ui/core'
import Grid from "@material-ui/core/Grid";
import {
    addImagesData,
    updateActiveImageIndex,
} from "../../../Store/Label/ActionCreators";
import EditorView from "../../EditorView/EditorView";
import { DoState } from "../../../Store/Editor/ActionCreators";
import ProjectViewHeader from "../ProjectViewHeader";
import { store } from "../../..";
import { updateTaskType } from "../../../Store/Project/ActionCreator";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import API from "../../../Api";
import { ProjectSelector } from "../../../Store/Project";
import { UserSelector } from "../../../Store/User";
import { setStatusBar } from "../../../Store/Site/ActionCreator";


const styles = (theme) => ({
    workButton: {
        background: theme.palette.primary,
        color: theme.palette.common.white,
        float: "right",
        fontWeight: "bold",
        padding: theme.spacing(2),
        marginRight: theme.spacing(3),
    },
    SubmitButton: {
        background: theme.palette.primary,
        color: theme.palette.common.white,
        float: "right",
        fontWeight: "bold",
        padding: theme.spacing(2),
        marginRight: theme.spacing(3),
    },
    textView: {
        margin: theme.spacing(2),
    },
    FieldContainer: {
        margin: theme.spacing(1),
        padding: theme.spacing(2),
    },
    FieldItem: {
        display: "inline"
    },
});

class ReviewView extends React.Component {
    constructor(props) {
        super(props);

        const TaskType = "Review";
        store.dispatch(updateTaskType(TaskType))
        let user = UserSelector.getCurrentUser();
        const ProjectId = ProjectSelector.GetCurrentProjectId();
        if (ProjectId === null) {
            this.props.history.push("/projects");
        }
        const currentProject = ProjectSelector.GetCurrentProject();
        if (currentProject && currentProject.Status !== "Active") {
            store.dispatch(setStatusBar(true, "Error", "Project is not Active, Cannot work on non-Active project!"))
            this.props.history.push("/projects");
            this.state = {
                workStarted: false,
                TaskType: TaskType,
            }
        }
        else{
            this.state = {
                ProjectId: ProjectId,
                currentProject: undefined,
                UserId: user.UserId,
                UserName: user.UserName,
                workStarted: false,
                submitting: false,
                TaskType: TaskType,
                startTime: new Date(),
                endTime: new Date(),
                imageURL: "",
                fileName: "",
                fileSize:0,
                editorKey: '',
                taskId: "",
                trainingmaterial: "",
                comment: "",
                ProjectDetails: undefined,
                imageData: {
                    id: uuidv1(),
                    fileData: undefined,
                    loaded: false,
                    labelPoints: [],
                    labelLines: [],
                    labelRects: [],
                    labelCircles: [],
                    labelPolygon: [],
                    labelArrow: [],
                    labelCuboid: [],
                    labelFreeHand: [],
                    labelPaintBrush: [],
                    labelSegmentation: []
                },
            };
            API.GetProject(ProjectId)
                .then((response) => {
                    return new Promise((resolve, reject) => {
                        if (response.projectOutput === undefined) {
                            reject({ message: "Project Output Details Not Available" })
                        }
                        this.setState({
                            currentProject: response,
                            trainingmaterial: response.clientInfo.TrainingMaterial ? response.clientInfo.TrainingMaterial : "No Training Materials Available",
                            ProjectDetails: response.projectOutput,
                        })
                        resolve({ message: "Done" });
                    })
                }).catch(error => {
                    store.dispatch(setStatusBar(true, "error", "Server error in getting project details, Try Again!"))
                    console.error(error);
                    this.props.history.push("/projects")
                })
        }
    }

    handleStart = () => {
        store.dispatch(setStatusBar(true, "Load", "Loading..."))
        API.StartNewTask({ TaskType: this.state.TaskType, ProjectId: this.state.ProjectId })
            .then(response => {
                return new Promise((resolve, reject) => {
                    if (response && response.URL && response.TaskId) {
                        let startTime = new Date()

                        this.setState({
                            startTime: startTime,
                            imageURL: response.URL,
                            taskId: response.TaskId,
                            fileName: response.Name
                        })
                        let imageData = this.state.imageData;
                        imageData.ImageURL = this.state.imageURL;
                        imageData.loaded = false;
                        let imageURL = imageData.ImageURL;
                        this.setState({
                            imageData: imageData,
                        })
                        resolve(API.GetImageData(this.state.imageURL));
                    }
                    else {
                        this.setState({
                            workStarted: false
                        })
                        reject({ message: "No Tasks are available for now, Try Later!" })
                    }
                })
            }).then(response => {
                return new Promise((resolve, reject) => {
                    if (response) {
                        if (response.type !== "text/html") {
                            let imageData = this.state.imageData;
                            imageData.fileData = response;
                            imageData.loaded = false;
                            this.setState({
                                imageData: imageData,
                                fileSize: response.size
                            })
                            resolve(API.GetTaskLogsById(this.state.taskId));
                        }
                        else {
                            this.setState({
                                workStarted: false
                            })
                            reject({ message: "Could Not Get Image, Check submitted ImageURL"});
                        }
                    }
                    else {
                        this.setState({
                            workStarted: false
                        })
                        reject({ message: "Could Not Get Image, Check submitted ImageURL" });
                    }
                })
            }).then(response => {
                return new Promise((resolve, reject) => {
                    if (response){
                        if (response.AnnotationJSon) {
                            let imageData = JSON.parse(response.AnnotationJSon);
                            if (imageData && imageData.length > 0) {
                                imageData[0].fileData = this.state.imageData.fileData;
                                imageData[0].loaded = false;
                                this.setState({
                                    imageData: imageData[0],
                                })
                            }
                        }
                        if (response.comment) {
                            this.setState({
                                comment: response.comment
                            })
                        }
                    }
                    this.props.addImagesData([this.state.imageData]);
                    this.props.updateActiveImageIndex(0);
                    this.props.DoState(JSON.stringify(this.state.imageData))
                    this.setState({
                        workStarted: true
                    })
                    resolve(response);
                    store.dispatch(setStatusBar(true, "success", "Task Loaded."))
                })
            })
            .catch(error => {
                this.setState({
                    workStarted: false
                })
                store.dispatch(setStatusBar(true, "error", error.message));
                console.error(error);
            })
    }

    handleStop = () => {
        API.StopTask(this.state.taskId, this.state.ProjectId)
            .then(() => {
                this.setState({
                    workStarted: false
                })
                store.dispatch(setStatusBar(true, "success", "Task Stopped Successfully."))
            })
            .catch(error => {
                store.dispatch(setStatusBar(true, "error", error.message));
                console.error(error);
            })
    }


    handleSubmit = () => {
        this.setState({
            submitting: true,
        })
        let imageData = this.props.imagesData;
        imageData.fileData = this.state.imageURL;
        let json = JSON.stringify(imageData);
        let endTime = new Date();
        let DurationInMilliSec = endTime - this.state.startTime;
        let DurationInSec = ((DurationInMilliSec % 60000) / 1000).toFixed(0);
        let TaskLog = {
            UserId: this.state.UserId,
            UserName: this.state.UserName,
            ProjectId: this.state.ProjectId,
            TaskId: this.state.taskId,
            StartTimeStamp: this.state.startTime.toTimeString(),
            EndTimeStamp: endTime.toTimeString(),
            DurationInSec: DurationInSec,
            Date: endTime.toDateString(),
            AnnotationJSon: json,
            TaskType: this.state.TaskType,
            IsTaskInprogress: false,
            IsTaskcompleted: true,
            IsInreview: false,
            IsReviewComplete: true,
            comment: this.state.comment,
            fileName: this.state.fileName,
            fileSize: this.state.fileSize
        }
        API.SubmitTaskLog(TaskLog)
            .then(data => {
                store.dispatch(setStatusBar(true, "success", "Submitted Task."))
                this.setState({
                    startTime: "",
                    endTime: "",
                    imageURL: "",
                    imageData: {
                        id: uuidv1(),
                        fileData: undefined,
                        loaded: false,
                        labelPoints: [],
                        labelLines: [],
                        labelRects: [],
                        labelCircles: [],
                        labelPolygon: [],
                        labelArrow: [],
                        labelCuboid: [],
                        labelFreeHand: [],
                        labelPaintBrush: [],
                        labelSegmentation: []
                    },
                    fileName: "",
                    editorKey: '',
                    taskId: "",
                    trainingmaterial: "",
                    comment: "",
                    workStarted: false,
                    submitting: false,

                })
                setTimeout(this.handleStart, 1000);
            })
            .catch(error => {
                store.dispatch(setStatusBar(true, "error", "Server error in Submitting TaskLog, Try Again!"))
                console.error(error);
                this.setState({
                    submitting: false,
                })
            })
    };

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }

    encodeImage = (data) => {
        var str = data.reduce(function (a, b) {
            return a + String.fromCharCode(b);
        }, "");
        return btoa(str).replace(/.{76}(?=.)/g, "$&\n");
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <ProjectViewHeader workStarted={this.state.workStarted} tool={true} startHandler={this.handleStart} stopHandler={this.handleStop} />
                {   this.state.ProjectId && !this.state.workStarted &&
                    <Button variant="contained" className={classes.workButton} color="secondary" onClick={this.handleStart} >Start Work</Button>
                }
                {   this.state.ProjectId &&this.state.workStarted &&
                    <Button variant="contained" className={classes.workButton} color="secondary" onClick={this.handleStop}> Stop Work </Button>
                }

                <Grid container justify="center" alignItems="center">
                    <Grid item sm={false} md={false} ></Grid>
                    <Grid item container sm={12} md={12} direction={"column"}>
                        {this.state.workStarted && <>
                            <TextField name="input" label="Input Field" value={" None For Now"} disabled className={classes.textView} variant="outlined" />
                            <TextField name="TaskID" label="TASK ID" value={this.state.taskId} disabled className={classes.textView} variant="outlined" />
                        </>
                        }
                        {!this.state.workStarted &&
                            <TextField name="TrainingMaterial" label="Training Material" value={this.state.trainingmaterial} disabled variant="outlined" className={classes.textView} />
                        }

                        <div>
                            {this.state.workStarted ? (
                                <EditorView key={this.state.editorKey} imagesData={[this.state.imageData]} ProjectDetails={this.state.ProjectDetails} readonly={false} />
                            ) : (
                                    <Typography variant="h6" align="center">
                                        Start Work
                                    </Typography>
                                )
                            }
                        </div>
                        {this.state.workStarted &&
                            <TextField name="comment" label="Comment" value={this.state.comment} className={classes.textView} variant="outlined" onChange={this.handleChange} />
                        }
                    </Grid>
                    <Grid item sm={false} md={false}></Grid>
                </Grid>
                { this.state.workStarted &&
                    <Button variant="contained" className={classes.SubmitButton}
                        onClick={this.handleSubmit} color="secondary"
                    > Submit Answer
                </Button>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    imagesData: state.labels.imagesData,
});
const mapDispatchToProps = {
    updateActiveImageIndex,
    addImagesData,
    DoState
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReviewView));
