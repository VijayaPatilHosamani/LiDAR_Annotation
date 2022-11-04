/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Box,
    Typography,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { result } from "lodash";
import { Auth } from "aws-amplify";
import { orange } from "@material-ui/core/colors";

import { withStyles } from "@material-ui/core/styles";
import { store } from "../..";
import { UserSelector, UserType } from '../../Store/User';
import { updateUserIsAuthenticated, updateCognitoUser, updateCurrentUser, updateAllUsers, updateEditableUser } from "../../Store/User/ActionCreator"
import { setStatusBar } from "../../Store/Site/ActionCreator";
import API from "../../Api";

const styles = (theme) => ({
    mainContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(3),
        padding: theme.spacing(10),
    },
    loginContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(3),
        padding: theme.spacing(10),
        border: "1px solid  black",
        borderRadius: "5px",
        boxShadow: "2px 2px #ff9900",
    },
    menuButton: {
        backgroundColor: orange[700],
        color: theme.palette.common.white,
        fontWeight: "bold",
        float: "right",
        padding: theme.spacing(2),
        marginRight: theme.spacing(3),
    },
    FieldContainer: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(3),
        padding: theme.spacing(1),
    },
    FieldItems: {
        marginLeft: theme.spacing(2),
    }
});

class Login extends Component {

    constructor(props) {
        super(props);
        if (UserSelector.isUserAuthenticated()) {
            this.props.history.push("/");
        }
        this.state = {
            userName: "",
            password: "",
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    onStateChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }
    onSubmit = async (event) => {
        let error = false;
        try {
            store.dispatch(setStatusBar(true, "Load", "Loading..."));
            let user = await Auth.signIn({
                username: this.state.userName,
                password: this.state.password
            })

            if (user.challengeName && (user.challengeName === 'SMS_MFA' ||
                user.challengeName === 'SOFTWARE_TOKEN_MFA')) {
                store.dispatch(setStatusBar(true, 'success', `You Have enabled Two Factor Authentication for ${user.challengeParam.CODE_DELIVERY_DELIVERY_MEDIUM}, enter code sent to ${user.challengeParam.CODE_DELIVERY_DESTINATION}`));
                store.dispatch(updateCognitoUser(user));
                this.props.history.push("/Login/confirm");
            }
            else {
                const apiuser = await API.GetAllUsers()
                store.dispatch(updateAllUsers(apiuser.data))
                let currentUser = apiuser.data.find(_user => _user.CognitoId === user.attributes.sub)
                if (currentUser === undefined) {
                    store.dispatch(setStatusBar(true, 'error', "Cannot Get Current User"));
                    error = true;
                }
                else if (currentUser.isActive === false) {
                    store.dispatch(setStatusBar(true, 'Error', `${currentUser.UserName} is not Activated!`));
                    Auth.signOut();
                }
                else {
                    if (currentUser.twoFactorAuthentication === "Enable") {
                        Auth.setPreferredMFA(user, "SMS");
                    }
                    else {
                        Auth.setPreferredMFA(user, "NOMFA");
                    }
                    store.dispatch(setStatusBar(true, 'success', `Hi ${currentUser.UserName}, You are logged in as a ${currentUser.Role}`));
                    store.dispatch(updateUserIsAuthenticated(true));
                    store.dispatch(updateCurrentUser(currentUser));
                    store.dispatch(updateCognitoUser(user));
                    this.props.history.push("/");
                }
            }
        } catch (errorResponse) {
            let message = errorResponse.message ? errorResponse.message : errorResponse
            store.dispatch(setStatusBar(true, 'error', `Login Failed : ${message}`));
            error = true;
        }
        if (error) {
            Auth.signOut();
        }
    };

    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.mainContainer}>

                <div className={classes.loginContainer} >
                    <Formik
                        initialValues={{
                            userName: this.state.userName,
                            password: this.state.password
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);
                            this.setState({
                                userName: values.userName,
                                password: values.password
                            })
                            this.onSubmit()
                            setSubmitting(false);
                        }}
                    >
                        {({
                            values,
                            touched,
                            errors,
                            dirty,
                            isSubmitting,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            handleReset
                        }) => (
                            <Form>
                                <Box className={classes.FieldContainer}>
                                    <Typography variant="h5">
                                        Login
                                        </Typography>
                                </Box>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="userName"
                                        id="userName"
                                        type="text"
                                        label="User Name"
                                        disabled={isSubmitting}
                                    />
                                </Box>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="password"
                                        type="password"
                                        id="password"
                                        label="Password"
                                        disabled={isSubmitting}
                                    />
                                </Box>

                                <Box className={classes.FieldContainer} style={{"display": "flex"}}>
                                    <Field type="checkbox"
                                        style={{ width: "20px", height: "20px" }}
                                        name="showPassword" label="Show Password"
                                        onClick={() => {
                                            var x = document.getElementById("password");
                                            if (x.type === "password") {
                                                x.type = "text";
                                            } else {
                                                x.type = "password";
                                            }}}
                                    />
                                    <Typography>Show Password</Typography>
                                </Box>


                                <Box className={classes.FieldContainer}>
                                    <Button
                                        className={classes.menuButton}
                                        variant="contained"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        Sign In
                                </Button>
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Link to="/resetpassword" className={classes.FieldItems}>
                                        Forgot password
                                    </Link>
                                </Box>
                            </Form>
                        )}
                    </Formik>

                </div >
            </div>

        );
    }

}

export default withStyles(styles)(Login);
