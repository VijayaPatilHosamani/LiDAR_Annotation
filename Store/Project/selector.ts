/* eslint-disable @typescript-eslint/no-unused-vars */
import { store } from "../.."
import { updateCurrentProject } from "../../Store/Project/ActionCreator";

export class ProjectSelector {

    public static GetDashBoardResponse(): any {
        return store.getState().Project.DashBoardResponse;
    }

    public static GetCurrentProjectId(): string | null {
        return store.getState().Project.CurrentProjectId;
    }

    public static GetCurrentProject(): any {
        let currentProjectState = store.getState().Project
        if (currentProjectState.CurrentProject === null) {

            const currentProjectId = currentProjectState.CurrentProjectId;
            const AllKnowProjects = currentProjectState.DashBoardResponse;
            if (currentProjectId === null || AllKnowProjects === null) {
                return null;
            }
            else {
                const data = AllKnowProjects.find(project => project.ProjectId === currentProjectId);
                if (data === undefined) {
                    return null;
                }
                currentProjectState.CurrentProject = data;
                store.dispatch(updateCurrentProject(currentProjectState.CurrentProject));
            }
        }
        return currentProjectState.CurrentProject;
    }

    public static GetToBeEditedProject(): any {
        return store.getState().Project.ToBeEditedProject;
    }

    public static GetTaskType(): any {
        return store.getState().Project.TaskType;
    }


}
