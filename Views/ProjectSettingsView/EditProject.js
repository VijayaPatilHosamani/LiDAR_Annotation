/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { ProjectSelector } from "../../Store/Project";
import ProjectSetup from "./ProjectSetup";

import { store } from '../..';
import { updateToBeEditedProject } from '../../Store/Project/ActionCreator';

import { setStatusBar } from "../../Store/Site/ActionCreator";
import API from "../../Api";

const EditProject = (props) => {
    const [ready, setReady] = useState(false);
    const projectId = ProjectSelector.GetCurrentProjectId();
    if (projectId === "") {
        store.dispatch(setStatusBar(true,"Error", "No Project Selected"))
        props.history.push("/projects");
    }
    const currentProject = ProjectSelector.GetCurrentProject();
    if (currentProject === null) {
        store.dispatch(setStatusBar(true, "Error", "No Project Selected"))
        props.history.push("/projects");
    }

    let editableProject;

    API.GetProject(projectId).then(data => {
        editableProject = {
            projectId: projectId,
            projectName: "",
            clientName: "",
            projectCode: "",
            trainingMaterial: "",
            projectOutput: {},
            projectInput: {},
        }
        if (data) {
            let project = data;
            editableProject.projectName = project.ProjectName;
            // clientInfo
            editableProject.clientName = project.clientInfo.ClientName;
            editableProject.projectCode = project.clientInfo.ProjectCode;
            editableProject.trainingMaterial = project.clientInfo.TrainingMaterial;
            editableProject.type = project.clientInfo.Type;
            // projectInput
            editableProject.projectInput = project.projectInput;
            //projectOutput
            editableProject.projectOutput = project.projectOutput;
            // api
            editableProject.api = project.api;
            store.dispatch(updateToBeEditedProject(editableProject));
        }
        setReady(true);
    }).catch(error => {
        store.dispatch(setStatusBar(true, "error", "Server error in Getting Project Details, Try Again!"))
        console.error(error);
        props.history.push("/");
    })

    const handleSubmitProject = (event) => {
        const currentProject = ProjectSelector.GetCurrentProject();
        if (currentProject === null) {
            store.dispatch(setStatusBar(true, "Error", "No Project Selected"))
            props.history.push("/projects");
            return;
        }
        if (currentProject.Status === "Active") {
            store.dispatch(setStatusBar(true, "Error", "Active Project Cannot be Edited!, Pause First."))
            props.history.push("/projects");
            return;
        }
        store.dispatch(setStatusBar(true, "Load", "Submitting Project Details..."));
        let project = ProjectSelector.GetToBeEditedProject()
        if (project) {
            let ProjectDetails = {
                ProjectID: projectId,
                ProjectName: project.projectName,
                clientInfo: {
                    ClientName: "",
                    ProjectCode: "",
                    TrainingMaterial: "",
                    Type: "",
                },
                ProjectInput: {
                    production: false,
                    review: false,
                    productionRadioGroup: undefined,
                    reviewRadioGroup: undefined,
                    inputs: [],
                },
                projectOutput: {
                    point: false,
                    box: false,
                    circle: false,
                    line: false,
                    arrow: false,
                    polygon: false,
                    cuboid: false,
                    freehand: false,
                    paintBrush: false,
                    segmentation: false,

                    pointLabels: [],
                    boxLabels: [],
                    circleLabels: [],
                    lineLabels: [],
                    arrowLabels: [],
                    polygonLabels: [],
                    cuboidLabels: [],
                    freehandLabels: [],
                    paintBrushLabels: [],
                    segmentationLabels: []
                },
                status: "InActive",
                isPause: false,
                isComplete: false,
            };
            if (project.clientName && project.clientName !== "") {
                ProjectDetails.clientInfo = {
                    ClientName: project.clientName,
                    ProjectCode: project.projectCode,
                    TrainingMaterial: project.trainingMaterial,
                    Type: project.type,
                }
            }

            if (project.ProjectInput) {
                ProjectDetails.projectInput = project.ProjectInput
                let inputNotAvailable = true;
                if(ProjectDetails.projectInput.inputs.length > 0){
                    inputNotAvailable = false;
                }
                if(inputNotAvailable){
                    store.dispatch(setStatusBar(true, "error", "Needs at least one input"));
                    return;
                }
            }
            else{
                store.dispatch(setStatusBar(true, "error", "Needs at least one input"));
                return;
            }


            if (project.projectOutput) {
                ProjectDetails.projectOutput = project.projectOutput;
                let projectOutput = ProjectDetails.projectOutput ;
                let outputNotAvailable = true;
                if (projectOutput.pointLabels.length > 0 || projectOutput.boxLabels.length > 0 || projectOutput.circleLabels.length > 0 || projectOutput.arrowLabels.length > 0 ||      projectOutput.polygonLabels.length > 0 || projectOutput.cuboidLabels.length > 0 || projectOutput.freehandLabels.length > 0 || projectOutput.paintBrushLabels.length > 0 || projectOutput.segmentationLabels >0){
                    outputNotAvailable = false
                }
                if(outputNotAvailable){
                    store.dispatch(setStatusBar(true, "error", "Needs at least one output"));
                    return
                }
            }
            else{
                store.dispatch(setStatusBar(true, "error", "Needs at least one output"));
                return
            }

            if (project.api) {
                ProjectDetails.api = project.api
            }

            if (ProjectDetails.ProjectID !== "") {
                API.EditProject(ProjectDetails).then(data => {
                    store.dispatch(setStatusBar(true, "success", "Project Details Has been submitted."))
                }).catch(error => {
                    store.dispatch(setStatusBar(true, "error", "Server error, Try Again!"))
                    console.error(error);
                })
            }
            else {
                store.dispatch(setStatusBar(true, "error", "No Project Id to be Edited."))
                props.history.push("/projects");
            }
        }
        else {
            store.dispatch(setStatusBar(true, "error", "Please Enter all project details correctly."))
        }
    }



    return (
        <div>
            {ready &&
                <ProjectSetup editable={false} projectId={projectId} handleSubmitProject={handleSubmitProject} />
            }
        </div>
    )

}

export default EditProject;