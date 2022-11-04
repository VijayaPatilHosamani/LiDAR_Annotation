import { store } from "../.."

export class UserSelector {

    public static isUserAuthenticated(): boolean {
        return store.getState().User.isAuthenticated;
    }

    public static gotoLoginIfNotAuth(history: any): void {
        if (!store.getState().User.isAuthenticated) {
            history.push("/Login");
        }
    }

    public static getCognitoUser(): any {
        return store.getState().User.cognitoUser;
    }

    public static getCurrentUser(): any | null {
        return store.getState().User.currentUser;
    }

    public static getEditableUserId(): string | null {
        return store.getState().User.editableUserId;
    }
    public static getEditableUser(): string | null {
        return store.getState().User.editableUser;
    }

    public static getAllUsers(): any {
        return store.getState().User.allUsers;
    }

}
