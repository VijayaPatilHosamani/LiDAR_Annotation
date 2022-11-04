import { ProjectState, ProjectActionTypes, Action } from './types';


const initialState: ProjectState = {
    DashBoardResponse: null,
    CurrentProjectId: null,
    CurrentProject: null,
    ToBeEditedProject: null,
    TaskType: null,
}

export function ProjectReducer(
    state: ProjectState = initialState,
    action: ProjectActionTypes
): ProjectState {
    switch (action.type) {
        case Action.UPDATE_DASHBOARD_RESPONSE: {
            return {
                ...state,
                DashBoardResponse: action.DashBoardResponse,
            }
        }
        case Action.UPDATE_CURRENT_PROJECTID: {
            return {
                ...state,
                CurrentProjectId: action.CurrentProjectId,
            }
        }
        case Action.UPDATE_CURRENT_PROJECT: {
            return {
                ...state,
                CurrentProject: action.CurrentProject,
            }
        }
        case Action.UPDATE_TO_BE_EDITED_PROJECT: {
            return {
                ...state,
                ToBeEditedProject: action.ToBeEditedProject,
            }
        }
        case Action.UPDATE_TASK_TYPE: {
            return {
                ...state,
                TaskType: action.TaskType,
            }
        }
        default:
            return state;
    }
}
