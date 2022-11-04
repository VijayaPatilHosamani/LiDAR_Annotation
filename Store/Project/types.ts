
export type ProjectState = {
    DashBoardResponse: any,
    CurrentProjectId: string | null,
    CurrentProject: any,
    ToBeEditedProject: any,
    TaskType: any,
};

export interface ProjectType {
    PROJECT: "PROJECT",
    USER: "USER",
    TASK: "TASK"
}

export const ProjectStatus = {
    Active: "Active",
    Paused: "Paused",
    InActive: "InActive",
}

export enum Action {
    UPDATE_DASHBOARD_RESPONSE = "UPDATE_DASHBOARD_RESPONSE",
    UPDATE_CURRENT_PROJECTID = "UPDATE_CURRENT_PROJECTID",
    UPDATE_CURRENT_PROJECT = "UPDATE_CURRENT_PROJECT",
    UPDATE_TO_BE_EDITED_PROJECT = "UPDATE_TO_BE_EDITED_PROJECT",
    UPDATE_TASK_TYPE = "UPDATE_TASK_TYPE",
}

interface UpdateDashBoardResponse {
    type: typeof Action.UPDATE_DASHBOARD_RESPONSE;
    DashBoardResponse: any;
}

interface UpdateCurrentProjectId {
    type: typeof Action.UPDATE_CURRENT_PROJECTID;
    CurrentProjectId: string | null
}

interface UpdateCurrentProject {
    type: typeof Action.UPDATE_CURRENT_PROJECT;
    CurrentProject: any
}

interface UpdateToBeEditedProject {
    type: typeof Action.UPDATE_TO_BE_EDITED_PROJECT;
    ToBeEditedProject: any
}

interface UpdateTaskType {
    type: typeof Action.UPDATE_TASK_TYPE;
    TaskType: any
}


export type ProjectActionTypes =
    | UpdateDashBoardResponse
    | UpdateCurrentProjectId
    | UpdateCurrentProject
    | UpdateToBeEditedProject
    | UpdateTaskType