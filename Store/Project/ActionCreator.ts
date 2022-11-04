import { Action, ProjectActionTypes } from "./types";

export function updateDashBoardResponse(DashBoardResponse: any): ProjectActionTypes {
    return {
        type: Action.UPDATE_DASHBOARD_RESPONSE,
        DashBoardResponse: DashBoardResponse
    }
}

export function updateCurrentProjectID(CurrentProjectId: string | null): ProjectActionTypes {
    return {
        type: Action.UPDATE_CURRENT_PROJECTID,
        CurrentProjectId: CurrentProjectId
    }
}



export function updateCurrentProject(CurrentProject: any): ProjectActionTypes {
    return {
        type: Action.UPDATE_CURRENT_PROJECT,
        CurrentProject: CurrentProject
    }
}



export function updateToBeEditedProject(ToBeEditedProject: any): ProjectActionTypes {
    return {
        type: Action.UPDATE_TO_BE_EDITED_PROJECT,
        ToBeEditedProject: ToBeEditedProject
    }
}



export function updateTaskType(TaskType: any): ProjectActionTypes {
    return {
        type: Action.UPDATE_TASK_TYPE,
        TaskType: TaskType
    }
}
