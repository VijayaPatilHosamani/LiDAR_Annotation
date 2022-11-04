import React from 'react';
import { Button } from '@material-ui/core'
import { connect } from "react-redux";

import { store } from "../../../..";
import { setStatusBar } from "../../../../Store/Site/ActionCreator";
import API from "../../../../Api";
import {
    addImagesData,
    updateActiveImageIndex,
} from "../../../../Store/Label/ActionCreators";
import EditorView from "../../../EditorView/EditorView";
import { DoState } from "../../../../Store/Editor/ActionCreators";


class SampleViewer extends React.Component {

    constructor(props) {
        super(props);
        let taskIds = props.taskIds;
        this.state = {
            taskIds: taskIds,
            taskLogs: undefined,
            projectId: props.projectId,
            currentIndex: 0,
            taskAvailable: false,
            ProjectDetails: undefined,
            imageData: undefined,
        }
        this.getTaskLogsById = this.getTaskLogsById.bind(this);
        this.nextTask = this.nextTask.bind(this);
        this.previousTask = this.previousTask.bind(this);

        if (props.projectId === "" || props.projectId === undefined){
            store.dispatch(setStatusBar(true, "No Project Id selected!"))
            props.unselectSample();
        }
        else{
            API.GetProject(props.projectId)
                .then((response) => {
                    return new Promise((resolve, reject) => {
                        if (response.projectOutput === undefined) {
                            reject({ message: "Project Output Details Not Available" })
                        }
                        debugger;
                        this.setState({
                            ProjectDetails: response.projectOutput,
                        })
                        resolve({ message: "Done" });
                    })
                }).catch(error => {
                    store.dispatch(setStatusBar(true, "error", "Server error in getting project details, Try Again!"))
                    console.error(error);
                    props.unselectSample();
                })
        }
        if (taskIds.length > 0){
            this.getTaskLogsById(taskIds[0]);
        }
        else{
            store.dispatch(setStatusBar(true,"Selected Sample doesn't have any tasks!"))
            props.unselectSample();
        }
    }

    nextTask= () => {
        let index = this.state.currentIndex

        if (this.state.taskIds.length - 1 === index) {
            store.dispatch(setStatusBar(true, "info", "Reached end of sample tasks"));
            return;
        }
        index = index + 1
        this.setState({ currentIndex: index, taskAvailable: false})
        this.getTaskLogsById(this.state.taskIds[index]);
    }

    previousTask = () => {
        let index = this.state.currentIndex

        if(index===0){
            store.dispatch(setStatusBar(true, "info", "Reached beginning of sample tasks"));
            return;
        }
        index = index - 1
        this.setState({ currentIndex: index, taskAvailable: false})
        this.getTaskLogsById(this.state.taskIds[index]);
    }

    getTaskLogsById =(taskId) =>{
        API.GetTaskLogsById(taskId)
            .then(response => {
                return new Promise((resolve, reject) => {
                    if (response && response.AnnotationJSon) {
                        let imageData = JSON.parse(response.AnnotationJSon);
                        if (imageData && imageData.length > 0) {
                            imageData[0].loaded = false;
                            this.setState({
                                imageData: imageData[0],
                            })
                        }
                        store.dispatch(setStatusBar(true, "success", "Task Loaded."))
                        resolve(API.GetImageData(imageData[0].ImageURL));
                    }
                    else{
                        reject({ message:"no response from server for task id"});
                        this.setState({
                            taskAvailable: false
                        })
                    }
                })
            })
            .then(response => {
                return new Promise((resolve, reject) => {
                if (response) {
                    debugger;
                    if (response.type !== "text/html") {
                        let imageData = this.state.imageData;
                        imageData.fileData = response;
                        imageData.loaded = true;
                        this.setState({
                            imageData: imageData,
                            taskAvailable: true
                        })
                        this.props.addImagesData([imageData]);
                        this.props.updateActiveImageIndex(0);
                        this.props.DoState(JSON.stringify(imageData))
                        resolve(imageData);
                    }
                    else {
                        reject({ message: "Could Not Get Image, Check submitted ImageURL" });
                    }
                }
                else {
                    this.setState({
                        taskAvailable: false
                   })
                    reject({ message: "Could Not Get Image, Check submitted ImageURL" });
                }
            })
            .catch(error => {
                store.dispatch(setStatusBar(true, "error", error.message));
                console.error(error);
            })
        })

    }

    render= () =>{
        return (
            <div>
                <div style={{ "justify-content": "space-around",
                                "flex-direction": "row",
                                "display": "flex" }}>

                <Button variant="contained" onClick={this.previousTask} >Previous</Button>
                {this.state.taskIds[this.state.currentIndex]}
                    <Button variant="contained" onClick={this.nextTask}>Next</Button>
                </div>

                {this.state.taskAvailable && this.state.ProjectDetails &&(
                    <>
                        {this.state.taskIds[this.state.currentIndex]}
                        <EditorView imagesData={[this.state.imageData]} ProjectDetails={this.state.ProjectDetails} readonly={true}/>
                    </>
            )}
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

export default (connect(mapStateToProps, mapDispatchToProps)(SampleViewer));
