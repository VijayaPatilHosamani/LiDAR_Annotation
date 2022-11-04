import React from 'react';
import { Auth } from "aws-amplify";
import { updateCurrentUser, updateCognitoUser, updateUserIsAuthenticated } from '../../Store/User/ActionCreator';
import { setStatusBar } from "../../Store/Site/ActionCreator";
import { store } from '../..';


const Logout = (props) => {

    Auth.signOut();
    store.dispatch(updateCognitoUser(null));
    store.dispatch(updateUserIsAuthenticated(false));
    store.dispatch(updateCurrentUser(null));
    store.dispatch(setStatusBar(true, "success", "You have been Logged out."));
    props.history.push("/Login");

    return (
        <div>
            <h1> Logging Out...</h1>
        </div>
    )
}

export default Logout;