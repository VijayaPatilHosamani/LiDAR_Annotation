import { UserState, UserActionTypes, Action } from './types';


const initialState: UserState = {
    currentUser: null,
    isAuthenticated: false,
    cognitoUser: null,
    editableUserId: null,
    editableUser: null,
    allUsers: null
}

export function UserReducer(
    state: UserState = initialState,
    action: UserActionTypes
): UserState {
    switch (action.type) {
        case Action.UPDATE_IS_AUTHENTICATED: {
            return {
                ...state,
                isAuthenticated: action.isAuthenticated,
            }
        }

        case Action.UPDATE_COGNITO_USER: {
            return {
                ...state,
                cognitoUser: action.cognitoUser
            }
        }
        case Action.UPDATE_CURRENT_USER: {
            return {
                ...state,
                currentUser: action.currentUser
            }
        }

        case Action.UPDATE_EDITABLE_USER_ID: {
            return {
                ...state,
                editableUserId: action.editableUserId
            }
        }
        case Action.UPDATE_EDITABLE_USER: {
            return {
                ...state,
                editableUser: action.editableUser
            }
        }
        case Action.UPDATE_ALL_USERS: {
            return {
                ...state,
                allUsers: action.allUsers
            }
        }
        default:
            return state;
    }
}
