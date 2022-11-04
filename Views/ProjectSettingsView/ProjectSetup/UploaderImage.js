/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { store } from "../../..";
import { id } from 'date-fns/locale';
import { setStatusBar } from '../../../Store/Site/ActionCreator';
import { ProjectSelector } from '../../../Store/Project';
import API from "../../../Api";

const Uploader = (props) => {

    const [file, setFile] = useState(null);
    const [BatchItem, setBatchItem] = useState([]);
    let uploadButtonState = true;
    const { username, loadBatchData } = props;

    const projectID = ProjectSelector.GetCurrentProjectId();
    const project = ProjectSelector.GetToBeEditedProject();
    if (projectID === null || projectID === undefined || projectID === "" || project === undefined || project === null) {
        uploadButtonState = false;
        store.dispatch(setStatusBar(true, "error", "No Project Selected"))
    }


    const handleRead = (event) => {
        let result = event.target.result.split("\n");
        if (result) {
            let items = []
            for (let i = 1; i < result.length; i++) {
                if (result[i] !== "") {
                    const spval = result[i].split(",");
                    items.push({ Name: spval[0], URL: spval[1] });
                }
            }
            setBatchItem(items);
        }
    }

    const handlefileChange = (event) => {
        if (event.target.files.length > 0) {
            try {
                let newfile = event.target.files[0];
                var reader = new FileReader();
                reader.addEventListener('load', handleRead);
                reader.readAsText(newfile);
                setFile(event.target.files[0])
            }
            catch {
                store.dispatch(setStatusBar(true, "error", "File Not Correct type!"));
            }
        }
    }


    const handleSubmit = () => {
        if (projectID && BatchItem.length > 0) {
            const projectDetails = {
                UpLoadedBy: username ? username : "",
                ProjectID: projectID,
                BatchItem: BatchItem,
                Tasks: BatchItem.length
            }
            API.UploadBatch(projectDetails).then(data => {
                setBatchItem([]);
                setFile(null);
                store.dispatch(setStatusBar(true, "success", "Data Uploaded Successfully"))
                props.loadBatchData();
            }).catch(error => {
                store.dispatch(setStatusBar(true, "error", "Server error Uploading Batch Details, Try Again!"))
                console.error(error);
            })
        }
        else if (!projectID) {
            store.dispatch(setStatusBar(true, "error", "No Project Selected"))
        }
        else {
            store.dispatch(setStatusBar(true, "error", "No Batch Data to upload."))
        }
    }
    return (
        <React.Fragment>
            <input type="file" onChange={handlefileChange} accept=".csv" disabled={!uploadButtonState} />
            {file &&
                (
                    <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={!uploadButtonState}>
                        Upload Batch File
                    </Button>
                )
            }
        </React.Fragment>
    );
}

export default withRouter(Uploader);