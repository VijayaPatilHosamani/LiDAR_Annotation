/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";
import { UserSelector } from './Store/User';
import { store } from ".";
import { setStatusBar } from "./Store/Site/ActionCreator";


const ProtectedRoute = ({ component: Component, ...vars }) => {
    let currentUser;
    return (
        <Route {...vars} render={props => {
            const isAuthenticated = UserSelector.isUserAuthenticated();
            if (isAuthenticated) {
                if (vars.UserAccess && vars.UserAccess.length > 0) {
                    currentUser = UserSelector.getCurrentUser();
                    if (currentUser) {
                        const access = vars.UserAccess.find(role => role === currentUser.Role)
                        if (access === undefined) {
                            const message = "You Are Not Authorized to Access This Page!";
                            store.dispatch(setStatusBar(true, "error", message));
                            return (<Redirect
                                to={
                                    {
                                        pathname: "/",
                                        state: {
                                            from: props.location
                                        }
                                    }
                                } />
                            )
                        }
                    }
                }
                props.cognitoUser = UserSelector.getCognitoUser();
                return (<Component currentUser={currentUser} {...props} />)
            }
            else {

                const message = "You Are Not Logged In, Please Login";
                store.dispatch(setStatusBar(true, "error", message));
                return (<Redirect
                    to={
                        {
                            pathname: "/Login",
                            state: {
                                from: props.location
                            }
                        }
                    } />
                )
            }
        }
        } />
    );
}

export default ProtectedRoute;