/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { store } from '../..';
import { updateToBeEditedProject, updateCurrentProjectID } from '../../Store/Project/ActionCreator';

import ProjectSetup from "./ProjectSetup";

import { ProjectSelector } from "../../Store/Project";
import { setStatusBar } from "../../Store/Site/ActionCreator";
import API from "../../Api";

const SetUpNewProject = (props) => {
    const projectId = "";
    const [submitted, setSubmitted] = useState(false);


    store.dispatch(updateToBeEditedProject(null));

    // do a pop up to get name to set project and then allow editing.
    const handleSubmitProject = (event) => {
        if (submitted) {
            store.dispatch(setStatusBar(true, "error", "Already Submitted!"))
        }
        let project = ProjectSelector.GetToBeEditedProject()
        if (project && project.projectName && project.projectName !== "") {
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

                    pointLabels: [],
                    boxLabels: [],
                    circleLabels: [],
                    lineLabels: [],
                    arrowLabels: [],
                    polygonLabels: [],
                    cuboidLabels: [],
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
                ProjectDetails.projectInput = project.ProjectInput;
                let inputNotAvailable = true;
                if (ProjectDetails.projectInput.inputs.length > 0) {
                    inputNotAvailable = false;
                }
                if (inputNotAvailable) {
                    store.dispatch(setStatusBar(true, "error", "Needs at least one input"));
                    return;
                }
            }
            else {
                store.dispatch(setStatusBar(true, "error", "Needs at least one input"));
                return;
            }


            if (project.projectOutput) {
                ProjectDetails.projectOutput = project.projectOutput;
                let projectOutput = ProjectDetails.projectOutput;
            }
            else {
                store.dispatch(setStatusBar(true, "error", "Needs at least one output"));
                return;
            }

            if (project.api) {
                ProjectDetails.api = project.api
            }

            if (ProjectDetails.ProjectID === "") {
                API.CreateNewProject(ProjectDetails)
                    .then(data => {
                        //store.dispatch(updateCurrentProjectID(data));
                        store.dispatch(setStatusBar(true, "success", "Project Details Has been submitted."));
                        setSubmitted(true);
                    })
                    .catch(error => {
                        store.dispatch(setStatusBar(true, "error", "Server error in creating new project, Try Again!"))
                        console.error(error);
                    })
            }
            else {
                store.dispatch(setStatusBar(true, "info", "Already submitted"))
            }

        }
        else {
            store.dispatch(setStatusBar(true, "error", "Please Enter all project details correctly."))
        }
    }

    return (
        <div>
            <ProjectSetup editable={true} projectId={projectId} handleSubmitProject={handleSubmitProject} />
        </div>
    )

}

export default SetUpNewProject;