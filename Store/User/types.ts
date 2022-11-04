
export type UserState = {

    currentUser: any,
    isAuthenticated: boolean,
    cognitoUser: any,
    editableUserId: string | null,
    editableUser: string | null,
    allUsers: any
};

export const UserType = {
    SUPERVISOR: "Supervisor",
    PROJECTMANAGER: "Project Manager",
    AGENT: "Agent"
}


export enum Action {
    UPDATE_IS_AUTHENTICATED = "UPDATE_IS_AUTHENTICATED",
    UPDATE_COGNITO_USER = "UPDATE_COGNITO_USER",
    UPDATE_CURRENT_USER = "UPDATE_CURRENT_USER",
    UPDATE_EDITABLE_USER_ID = "UPDATE_EDITABLE_USER_ID",
    UPDATE_EDITABLE_USER = "UPDATE_EDITABLE_USER",
    UPDATE_ALL_USERS = "UPDATE_ALL_USERS"
}

interface UpdateIsAuthenticated {
    type: typeof Action.UPDATE_IS_AUTHENTICATED;
    isAuthenticated: boolean;
}

interface UpdateCognitoUser {
    type: typeof Action.UPDATE_COGNITO_USER;
    cognitoUser: any;
}

interface UpdateCurrentUser {
    type: typeof Action.UPDATE_CURRENT_USER;
    currentUser: any;
}

interface UpdateEditableUserId {
    type: typeof Action.UPDATE_EDITABLE_USER_ID;
    editableUserId: string | null;
}

interface UpdateEditableUser {
    type: typeof Action.UPDATE_EDITABLE_USER;
    editableUser: string | null;
}

interface UpdateAllUsers {
    type: typeof Action.UPDATE_ALL_USERS;
    allUsers: any;
}


export type UserActionTypes =
    | UpdateIsAuthenticated
    | UpdateCognitoUser
    | UpdateCurrentUser
    | UpdateEditableUserId
    | UpdateEditableUser
    | UpdateAllUsers