import { Action, UserActionTypes } from "./types";

export function updateUserIsAuthenticated(isAuthenticated: boolean): UserActionTypes {
    return {
        type: Action.UPDATE_IS_AUTHENTICATED,
        isAuthenticated: isAuthenticated,
    }
}

export function updateCognitoUser(cognitoUser: any): UserActionTypes {
    return {
        type: Action.UPDATE_COGNITO_USER,
        cognitoUser: cognitoUser,
    }
}

export function updateCurrentUser(currentUser: any): UserActionTypes {
    return {
        type: Action.UPDATE_CURRENT_USER,
        currentUser: currentUser,
    }
}


export function updateEditableUserId(editableUserId: string | null): UserActionTypes {
    return {
        type: Action.UPDATE_EDITABLE_USER_ID,
        editableUserId: editableUserId,
    }
}

export function updateEditableUser(editableUser: string | null): UserActionTypes {
    return {
        type: Action.UPDATE_EDITABLE_USER,
        editableUser: editableUser,
    }
}

export function updateAllUsers(allUsers: any): UserActionTypes {
    return {
        type: Action.UPDATE_ALL_USERS,
        allUsers: allUsers,
    }
}
