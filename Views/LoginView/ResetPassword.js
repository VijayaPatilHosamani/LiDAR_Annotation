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
import { updateEditableUser } from "../../Store/User/ActionCreator";

import { Formik, Field, Form, ErrorMessage } from "formik";

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

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        store.dispatch(setStatusBar(true, "Load", "Loading..."));
        if (UserSelector.isUserAuthenticated()) {
            this.props.history.push("/");
        }
        this.state = {
            userName: "",
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    onStateChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    onSubmit = async (event) => {
        Auth.forgotPassword(
            this.state.userName
        ).then((response) => {
            const message = "Hi " + this.state.userName + ", You are reset instructions are sent to your " + response.CodeDeliveryDetails.AttributeName;// user type
            store.dispatch(setStatusBar(true, "success", message));
            store.dispatch(updateEditableUser(this.state.userName));
            this.props.history.push("/resetpassword/set");
        }).catch((error) => {
            const message = "Password Reset Request Failed: " + error.message;// user type
            store.dispatch(setStatusBar(true, "error", message));
            this.props.history.push("/Login");
        });
    };

    render() {
        store.dispatch(setStatusBar(false, "Load", "Loaded."));
        const classes = this.props.classes;
        return (
            <div className={classes.mainContainer}>

                <div className={classes.loginContainer} >
                    <Formik
                        initialValues={{
                            userName: this.state.userName,
                        }}
                        validate={(values) => {
                            const errors = {};
                            if (!values.userName) {
                                errors.email = "Required";
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);
                            this.setState({
                                userName: values.userName,
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
                                        Reset password
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
                                        Reset
                                </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </div >
            </div>
        );
    }

}

export default withStyles(styles)(ResetPassword);
