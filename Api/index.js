import Axios from "axios";

const API_URL = "https://la4e1jybji.execute-api.us-east-2.amazonaws.com/Prod/"; //config.json API_URL
export class API {
    // Dashboards
    static GetDashBoardData() {
        return new Promise((resolve, reject) => {
            Axios.get(API_URL + '/Dashboard/GetDashboard/DashboardName')
                .then((response) => {
                    if (response === null) {
                        reject({ message: `Connection Error no response!` })
                    }
                    else if (response.status !== 200) {
                        reject({ message: `Server Error, Try Again Later!`, status: response.status })
                    }
                    else if (response.data === null) {
                        reject({ message: "No data!" })
                    }
                    let data = response.data
                    data = data.map((rows, index) => {
                        return {
                            id: index,
                            ...rows,
                            Available: (rows.Total - rows.Completed)
                        }
                    })
                    resolve(data);
                }).catch((error) => {
                    error.serverMessage = error.message;
                    error.message = "Server Error in fetching Project Metrics, Try Again!"
                    reject(error)
                });
        })
    };

    // User
    static GetUser(UserId) {
        return new Promise((resolve, reject) => {
            if (UserId === undefined) {
                reject({ message: "No User Id" });
            }
            else {
                fetch(`${API_URL}User/GetById/${UserId}`)
                    .then((response) => {
                        if (response === null) {
                            reject({ message: `Connection Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else if (response.data === null) {
                            reject({ message: "No data!" })
                        }
                        else {
                            return (response.json())
                        }
                    })
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in fetching User details, Try Again!"
                        reject(error)
                    });
            }
        })
    }

    static CreateUser(UsersDetails) {
        return new Promise((resolve, reject) => {
            if (UsersDetails === undefined) {
                reject({ message: "No data, cannot submit nothing!" });
            }
            else {
                fetch(API_URL + "User/Create", {
                    method: 'POST',
                    headers: {
                        "Accept": "Application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(UsersDetails)
                }).then(response => {
                    if (response === null) {
                        reject({ message: `Connection Error no response!` })
                    }
                    else if (response.status !== 200) {
                        reject({ message: `Server Error, Try Again Later!`, status: response.status })
                    }
                    else if (response.data === null) {
                        reject({ message: "No data!" })
                    }
                    else {
                        resolve(response);
                    }
                }).catch(error => {
                    error.serverMessage = error.message;
                    error.message = "Server Error in Creating User, Try Again!"
                    reject(error);
                })
            }
        })
    }

    static UpdateUser(UsersDetails, UserId) {
        return new Promise((resolve, reject) => {
            if (UsersDetails === undefined) {
                reject({ message: "User Details Not Given!" })
            }
            else if (UserId === undefined || UserId === null || UserId === "") {
                reject({ message: "Invalid User ID!" });
            }
            fetch(`${API_URL}User/Update/${UserId}`, {
                method: 'POST',
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(UsersDetails)
            }).then(response => {
                if (response === null) {
                    reject({ message: `Connection Error no response!` })
                }
                else if (response.status !== 200) {
                    reject({ message: `Server Error, Try Again Later!`, status: response.status })
                }
                else if (response.data === null) {
                    reject({ message: "No data!" })
                }
                else {
                    resolve(response);
                }
            }).catch(error => {
                error.serverMessage = error.message;
                error.message = "Server Error in updating User details, Try Again!"
                reject(error);
            })
        })
    }

    static GetAllUsers() {
        return new Promise((resolve, reject) => {
            Axios.get(API_URL + "/User/GetAllUsers")
                .then(response => {
                    if (response === null) {
                        reject({ message: `Connection Error no response!` })
                    }
                    else if (response.status !== 200) {
                        reject({ message: `Server Error, Try Again Later!`, status: response.status })
                    }
                    else if (response.data === null) {
                        reject({ message: "No data!" })
                    }
                    else {
                        resolve(response);
                    }
                }).catch(error => {
                    error.serverMessage = error.message;
                    error.message = "Server Error in fetching User data, Try Again!"
                    reject(error);
                })
        });
    }

    //Tasks
    static StartNewTask(TaskDetails) {
        return new Promise((resolve, reject) => {
            if (TaskDetails === undefined) {
                reject({ message: "No Task Details", });
            }
            else if (TaskDetails.TaskType !== "Production" && TaskDetails.TaskType !== "Review") {
                reject({ message: "Unknown Task type", });
            }
            else if (TaskDetails.ProjectId === undefined || TaskDetails.ProjectId === null) {
                reject({ message: "No project ID" });
            }
            else {
                fetch(API_URL + "Agent/StartTask", {
                    method: 'POST',
                    headers: {
                        "Accept": "Application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(TaskDetails)
                }).then(response => {

                    if (response === null) {
                        reject({ message: `Connection Error no response!` })
                    }
                    else if (response.status !== 200) {
                        reject({ message: `Server Error, Try Again Later!`, status: response.status });
                    }
                    else if (response.data === null) {
                        reject({ message: "No More Tasks Available!" })
                    }
                    else {
                        return (response.json());
                    }
                }).then(data => {
                    resolve(data)
                }).catch(error => {
                    error.serverMessage = error.message;
                    error.message = "Server Error in fetching new tasks, Try Again!";
                    reject(error);
                })
            }
        });
    }

    static StopTask(TaskId, ProjectId) {
        return new Promise((resolve, reject) => {
            if (TaskId === undefined || TaskId === null || TaskId === "") {
                reject({ message: "No Task Id specified!", });
            }
            else if (ProjectId === undefined || ProjectId === null || ProjectId === "") {
                reject({ message: "No ProjectID specified!", });
            }
            else {
                fetch(API_URL + "Agent/StopTask", {
                    method: 'POST',
                    headers: {
                        "Accept": "Application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ TaskId: TaskId, ProjectId: ProjectId })
                }).then(response => {
                    if (response === null) {
                        reject({ message: `Connection Error no response!` })
                    }
                    else if (response.status !== 200) {
                        reject({ message: `Server Error, Try Again Later!`, status: response.status })
                    }
                    else if (response.data === null) {
                        reject({ message: "No data!" })
                    }
                    else {
                        return (response.json());
                    }
                }).then(data => {
                    resolve(data)
                }).catch(error => {
                    error.serverMessage = error.message;
                    error.message = "Server Error in Stopping Task, Try Again!"
                    reject(error);
                })
            }
        });
    }

    static SubmitTaskLog(TaskDetails) {
        return new Promise((resolve, reject) => {
            if (TaskDetails === undefined) {
                reject({ message: "No Task Details", });
            }
            else if (TaskDetails.TaskType !== "Production" && TaskDetails.TaskType !== "Review") {
                reject({ message: "Unknown Task type", });
            }
            else if (TaskDetails.ProjectId === undefined || TaskDetails.ProjectId === null) {
                reject({ message: "No project ID" });
            }
            else {
                let body = JSON.stringify(TaskDetails);
                fetch(API_URL + "Agent/TaskLog", {
                    method: 'POST',
                    headers: {
                        "Accept": "Application/json",
                        "Content-Type": "application/json",
                    },
                    body: body
                }).then(response => {
                    if (response === null) {
                        reject({ message: `Connection Error no response!` })
                    }
                    else if (response.status !== 200) {
                        reject({ message: `Server Error, Try Again Later!`, status: response.status })
                    }
                    else if (response.data === null) {
                        reject({ message: "No data!" })
                    }
                    else {
                        resolve(response);
                    }
                }).catch(error => {
                    error.serverMessage = error.message;
                    error.message = "Server Error in Submitting TaskLog, Try Again!"
                    reject(error);
                })
            }
        });
    }

    static GetTasksByProjectID(ProjectId) {
        return new Promise((resolve, reject) => {
            if (ProjectId === undefined || ProjectId === null | ProjectId === "") {
                reject({ message: "No project ID" });
            }
            else {
                fetch(`${API_URL}Task/GetTaskByProjectId/${ProjectId}`)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Connection Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else if (response.data === null) {
                            reject({ message: "No data!" })
                        }
                        else {
                            return (response.json());
                        }
                    })
                    .then(response => resolve(response))
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in fetching Tasks, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    static GetTasksLogByProjectID(ProjectId) {
        return new Promise((resolve, reject) => {

            if (ProjectId === undefined || ProjectId === null | ProjectId === "") {
                reject({ message: "No project ID" });
            }
            else {
                fetch(`${API_URL}Project/GetTaskLogByProjectId/${ProjectId}`)
                    .then(response => {

                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else if (response.data === null) {
                            reject({ message: "No data!" })
                        }
                        else {
                            return (response.json());
                        }
                    })
                    .then(response => resolve(response))
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in fetching TaskLog, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    static GetTaskLogsById(TaskId) {
        return new Promise((resolve, reject) => {
            if (TaskId === undefined || TaskId === null | TaskId === "") {
                reject({ message: "No project ID" });
            }
            else {
                fetch(`${API_URL}/Project/GetTaskLogByTaskId/${TaskId}`)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else if (response.data === null) {
                            reject({ message: "No data!" })
                        }
                        else {
                            return (response.json());
                        }
                    })
                    .then(response => {
                        let index = response.length - 1;
                        resolve(response[index])
                    }) //For getting the latest task log
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in fetching TaskLog, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    static GetImageData(URL) {
        return new Promise((resolve, reject) => {
            if (URL === undefined || URL === "") {
                reject({ message: "No Task Details", });
            }
            else {
                fetch(URL)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else if (response.data === null) {
                            reject({ message: "No data!" })
                        }
                        else {
                            return (response.blob());
                        }
                    }).then(data => {
                        resolve(data)
                    }).catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in fetching image data, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    // Project

    static CreateNewProject(ProjectDetails) {
        return new Promise((resolve, reject) => {
            if (ProjectDetails === undefined || ProjectDetails.ProjectName === undefined) {
                reject({ message: "No Project Details given.", });
            } else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Contest-Type': 'application/json' },
                    body: JSON.stringify(ProjectDetails),
                }
                fetch(`${API_URL}/Project/Create?Name=${ProjectDetails.ProjectName}`, requestOptions)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else if (response.data === null) {
                            reject({ message: "No data!" })
                        }
                        else {
                            resolve(response);
                        }
                    })
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in Creating new Project, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    static GetProject(ProjectId) {
        return new Promise((resolve, reject) => {
            if (ProjectId === undefined || ProjectId === null || ProjectId === "") {
                reject({ message: "No Project ID given.", });
            }
            else {
                fetch(`${API_URL}Project/GetById/${ProjectId}`)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else if (response.data === null || response.data === []) {
                            reject({ message: "No data!" })
                        }
                        else {
                            return (response.json());
                        }
                    }).then(data => {
                        if (data && data.length > 0) {
                            resolve(data[0])
                        }
                    })
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in fetching Project Details, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    static EditProject(ProjectDetails) {
        return new Promise((resolve, reject) => {
            if (ProjectDetails === undefined || ProjectDetails.ProjectID === undefined) {
                reject({ message: "No Project Details given.", });
            }
            else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Contest-Type': 'application/json' },
                    body: JSON.stringify(ProjectDetails),
                }
                fetch(`${API_URL}Project/Update`, requestOptions)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else if (response.data === null) {
                            reject({ message: "No data!" })
                        }
                        else {
                            resolve(response);
                        }
                    }).catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in Updating Project Details, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    static UploadBatch(ProjectDetails) {
        return new Promise((resolve, reject) => {
            if (ProjectDetails === undefined || ProjectDetails.ProjectID === null) {
                reject({ message: "No Project Details given.", });
            }
            else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Contest-Type': 'application/json' },
                    body: JSON.stringify(ProjectDetails),
                }
                fetch(`${API_URL}Project/UploadBatch`, requestOptions)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else {
                            return response.json();
                        }
                    })
                    .then(response => resolve(response))
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in uploading Batch, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    static GetBatchDetails(ProjectId) {
        return new Promise((resolve, reject) => {
            if (ProjectId === "") {
                reject({ message: "No Project ID given." });
            }
            else {
                fetch(`${API_URL}Project/GetBatchDetails/${ProjectId}`)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else {
                            return response.json();
                        }
                    }).then(data => {
                        resolve(data)
                    })
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in fetching Batch Details, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    //Samples
    static CreateNewSample(ProjectId, TaskIds) {
        return new Promise((resolve, reject) => {
            if (ProjectId === "") {
                reject({ message: "No Project ID given." });
            }
            else if (TaskIds === undefined || TaskIds.length === 0) {
                reject({ message: "No Task IDs given." });
            }
            else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Contest-Type': 'application/json' },
                    body: JSON.stringify({
                        projectId: ProjectId,
                        taskIds: TaskIds,
                        created: new Date(),
                        size: TaskIds.length,
                        quality: 0, // TODO: calculate this
                    }),
                }
                fetch(`${API_URL}SamplingPlan/Create`, requestOptions)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else {
                            return response.text();
                        }
                    }).then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in Creating Sampling Plan, Try Again!"
                        reject(error);
                    })
            }
        });
    }

    static GetSamplesForProject(ProjectId) {
        return new Promise((resolve, reject) => {
            if (ProjectId === "") {
                reject({ message: "No Project ID given." });
            }
            else {
                fetch(`${API_URL}SamplingPlan/GetByProjectId/${ProjectId}`)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else {

                            return response.json();
                        }
                    })
                    .then(response => {

                        resolve(response)
                    })
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in fetching Sampling Plan, Try Again!"
                        reject(error);
                    })
            }
        });
    }


    static DeleteSample(ProjectId, sampleId) {
        return new Promise((resolve, reject) => {
            if (ProjectId === undefined || ProjectId === "") {
                reject({ message: "No Project ID given." });
            }
            else if (sampleId === undefined || sampleId === "") {
                reject({ message: "No Sample ID given." });
            }
            else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Contest-Type': 'application/json' },
                    body: JSON.stringify({
                        ProjectId: ProjectId,
                        SampleId: sampleId
                    })
                }
                fetch(`${API_URL}SamplingPlan/Delete`, requestOptions)
                    .then(response => {
                        if (response === null) {
                            reject({ message: `Server Error no response!` })
                        }
                        else if (response.status !== 200) {
                            reject({ message: `Server Error, Try Again Later!`, status: response.status })
                        }
                        else {
                            resolve(response)
                        }
                    })
                    .catch(error => {
                        error.serverMessage = error.message;
                        error.message = "Server Error in Deleting Sampling Plan, Try Again!"
                        reject(error);
                    })
            }
        });
    }
};

export default API;