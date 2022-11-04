/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Box,
    Typography,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { withStyles } from "@material-ui/core/styles";
import { store } from "../..";
import { UserSelector } from '../../Store/User';

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { result } from "lodash";
import { Auth } from "aws-amplify";

import { setStatusBar } from "../../Store/Site/ActionCreator";

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
        background: "#ff9900",
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

class ResetPasswordSet extends Component {

    constructor(props) {
        super(props);
        if (UserSelector.isUserAuthenticated()) {
            this.props.history.push("/");
        }

        let userName = UserSelector.getEditableUser();
        if (userName === null || userName === undefined || userName === "") {
            store.dispatch(setStatusBar(true, "error", "User Not Selected Properly!."));
            this.props.history.push("/Login");
        }
        this.state = {
            userName: userName,
            password: "",
            confirmPassword: "",
            code: ""
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    onStateChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    onSubmit = async (event) => {
        Auth.forgotPasswordSubmit(
            this.state.userName,
            this.state.code,
            this.state.password,
        ).then(() => {
            const message = "Hi " + this.state.userName + ", You're Password was Reset SuccessFully, Login In!";// user type
            store.dispatch(setStatusBar(true, "success", message));
            this.props.history.push("/Login");
        }).catch((error) => {
            const message = "Login Fail, " + error.message;// user type
            store.dispatch(setStatusBar(true, "error", message));
        })

    };

    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.mainContainer}>

                <div className={classes.loginContainer} >
                    <Formik
                        initialValues={{
                            password: this.state.password,
                            confirmPassword: this.state.confirmPassword,
                            code: this.state.code
                        }}
                        validate={(values) => {
                            const errors = {};
                            if (!values.password) {
                                errors.password = "Required";
                            }
                            if (values.password && !(/[A-Z]/s.test(values.password))) {
                                errors.password = "Password must Have a Uppercase Character";
                            }
                            else if (values.password && !(/[a-z]/s.test(values.password))) {
                                errors.password = "Password must Have a Lower Character";
                            }
                            else if (values.password && !(/^(?=.*?[0-9])/s.test(values.password))) {
                                errors.password = "Password must Have a Number Character";
                            }
                            else if (values.password && !(/^(?=.*?[#?!@$%^&*-])/s.test(values.password))) {
                                errors.password = "Password must Have a Special Character";
                            }
                            else if (values.password && values.password.length < 8) {
                                errors.password = "Password should be more than 8 characters.";
                            }
                            if (values.password !== values.confirmPassword) {
                                errors.confirmPassword = "Password Doesn't match";
                            }
                            if (!values.code) {
                                errors.code = "Required";
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);
                            this.setState({
                                password: values.password,
                                confirmPassword: values.confirmPassword,
                                code: values.code,
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
                                        Set New Password
                                    </Typography>
                                </Box>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="password"
                                        id="password"
                                        type="password"
                                        label="New Password"
                                    />
                                </Box>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="confirmPassword"
                                        id="password"
                                        type="password"
                                        label="Confirm Password"
                                    />
                                </Box>
                                <Box className={classes.FieldContainer} style={{ "display": "flex" }}>
                                    <Field type="checkbox"
                                        style={{ width: "20px", height: "20px" }}
                                        name="showPassword" label="Show Password"
                                        onClick={() => {
                                            var x = document.getElementById("password");
                                            if (x.type === "password") {
                                                x.type = "text";
                                            } else {
                                                x.type = "password";
                                            }
                                        }}
                                    />
                                    <Typography>Show Password</Typography>
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Field className={classes.FieldItems}
                                        component={TextField}
                                        name="code"
                                        id="code"
                                        type="text"
                                        label="Verification Code"
                                    />
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Link to={"/Login"}> Back to Login</Link>
                                    <Button
                                        className={classes.menuButton}
                                        variant="contained"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </div >
            </div >
        );
    }

}

export default withStyles(styles)(ResetPasswordSet);
