/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Formik, Form, Field } from "formik";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
    Button,
    Box,
    Typography,
    makeStyles,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { UserSelector } from "../../Store/User";
import FormikRadioGroup from "../../components/FormikRadioGroup";
import API from "../../Api";
import { setStatusBar } from "../../Store/Site/ActionCreator";
import { store } from "../..";
import ProfileHeaderView from ".";
import { Auth } from "aws-amplify";


const useStyles = makeStyles((theme) => ({
    mainContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(3),
        padding: theme.spacing(10),
        border: "1px solid black",
        borderRadius: "5px",
        boxShadow: "2px 2px black",
    },
    FieldContainer: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(3),
        padding: theme.spacing(1),
    },
    FieldItems: {
        marginLeft: theme.spacing(2),
    }
}));



const CurrentUserSettings = props => {
    const classes = useStyles();
    let initial = {
        twoFactorAuthentication: "Disable",
        password: "",
        newPassword: "",
        confirmPassword: "",
    };
    // to get User details and fill up the initial with new details.
    const editableUser = UserSelector.getCurrentUser();
    if (editableUser === undefined || editableUser.UserId === undefined) {
        props.history.push("/");
    }

    const cognitoUser = UserSelector.getCognitoUser();
    if (cognitoUser === undefined || cognitoUser === null) {
        props.history.push("/");
    }
    else {
        initial.UserId = editableUser.UserId;
        initial.twoFactorAuthentication = editableUser.twoFactorAuthentication ? editableUser.twoFactorAuthentication : "Disable";
    }


    const EditUser = (values) => {
        /*editableUserId*/
        let UserDetails = editableUser;
        let newTwoFact = values.twoFactorAuthentication ? values.twoFactorAuthentication : "Disable";

        let oneChange = false;
        if (values.newPassword !== "" && values.newPassword !== undefined) {
            oneChange = true;
            Auth.currentAuthenticatedUser()
                .then(user => {
                    return Auth.changePassword(user, values.password, values.newPassword);
                })
                .then(data => store.dispatch(setStatusBar(true, "Success", data)))
                .catch(err => store.dispatch(setStatusBar(true, "Error", err)))
        }

        if (newTwoFact !== editableUser.twoFactorAuthentication) {
            oneChange = true;
            Auth.currentAuthenticatedUser()
                .then(user => {
                    UserDetails.twoFactorAuthentication = newTwoFact;
                    if (UserDetails.twoFactorAuthentication === "Enable") {
                        return Auth.setPreferredMFA(user,"SMS");
                    }
                    else {
                        return Auth.setPreferredMFA(user, "NOMFA");
                    }
                })
                .then(data => {
                    store.dispatch(setStatusBar(true, "Success", data));
                    API.UpdateUser(UserDetails, UserDetails.UserId).then(() => {
                        store.dispatch(setStatusBar(true, "Success", "User Details Submitted"));
                    }).catch((error) => {
                        store.dispatch(setStatusBar(true, "Error", "Some Error in submitting user details, try again!"));
                        console.error(error);
                    })
                })
                .catch(err => store.dispatch(setStatusBar(true, "Error", err)))
        }

        if (!oneChange) {
            store.dispatch(setStatusBar(true, "Info", "Nothing to Submit!"));
        }
    }



    return (
        <div>
            <ProfileHeaderView />
            <div className={classes.mainContainer} >
                <Formik
                    initialValues={initial}
                    validate={(values) => {
                        const errors = {};

                        if (values.newPassword === "") {
                        }
                        else if (!(/[A-Z]/.test(values.newPassword))) {
                            errors.newPassword = "Password must Have a Uppercase Character";
                        }
                        else if (!(/[a-z]/.test(values.newPassword))) {
                            errors.newPassword = "Password must Have a Lower Character";
                        }
                        else if (!(/[0-9]/.test(values.newPassword))) {
                            errors.newPassword = "Password must Have a Number Character";
                        }
                        else if (!(/^(?=.*?[#?!@$%^&*-])/.test(values.newPassword))) {
                            errors.newPassword = "Password must Have a Special Character";
                        }
                        else if (values.newPassword.length < 8) {
                            errors.newPassword = "Password should be more than 8 characters.";
                        }

                        if (values.newPassword !== values.confirmPassword) {
                            errors.confirmPassword = "Password Doesn't match";
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(true);
                        EditUser(values);
                        setSubmitting(false);
                    }}

                // onReset={(values) => {
                //     values.twoFactorAuthentication = EditUser.twoFactorAuthentication ? EditUser.twoFactorAuthentication : "Disable";
                // }}
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Form>

                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="password"
                                        type="password"
                                        id="currentPassword"
                                        label="Current Password"
                                        helperText="Please Enter Current Password"
                                    />
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="newPassword"
                                        type="password"
                                        id="password"
                                        label="New Password"
                                        helperText="Please Enter a Valid new Password"
                                    />
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="confirmPassword"
                                        type="password"
                                        label="Confirm New Password"
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
                                            x = document.getElementById("currentPassword");
                                            if (x.type === "password") {
                                                x.type = "text";
                                            } else {
                                                x.type = "password";
                                            }
                                        }}
                                    />
                                    <Typography>Show Password</Typography>
                                </Box>
                                <div className={classes.FieldContainer} >
                                    <Box className={classes.FieldContainer}>
                                        <Typography>TwoFactorAuthentication</Typography>
                                        <Field
                                            className={classes.FieldItems}
                                            name="twoFactorAuthentication"
                                            options={["Enable", "Disable"]}
                                            component={FormikRadioGroup}
                                        />
                                        <div>

                                            {/* <Button variant="contained" color="secondary"
                                                className={classes.FieldItems}
                                                type="reset"
                                            >
                                                Reset
                                    </Button> */}
                                        </div>
                                    </Box>
                                </div>

                                <Box className={classes.FieldContainer}>
                                    <Button
                                        className={classes.FieldItems}
                                        variant="contained"
                                        color="secondary"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        Update
                                </Button>
                                </Box>
                            </Form>
                        </MuiPickersUtilsProvider>
                    )}
                </Formik>
            </div>
        </div>
    );

}

export default CurrentUserSettings;
