/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Formik, Form, Field } from "formik";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Link } from "react-router-dom";
import {
    Button,
    MenuItem,
    Box,
    Typography,
    makeStyles,
    ThemeProvider
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { UserSelector, UserType } from "../../Store/User";
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel'
import Grid from "@material-ui/core/Grid";
import FormikRadioGroup from "../../components/FormikRadioGroup";
import API from "../../Api";
import { setStatusBar } from "../../Store/Site/ActionCreator";
import { store } from "../..";
import { Auth } from "aws-amplify";
import { updateUserIsAuthenticated, updateCognitoUser, updateCurrentUser, updateAllUsers, updateEditableUser } from "../../Store/User/ActionCreator"


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

const ConfirmUser = props => {
    const classes = useStyles();
    let user = UserSelector.getCognitoUser();
    if (user === null || user === undefined || user === "") {
        props.history.push("/Login");
    }
    let authenticated = UserSelector.isUserAuthenticated();
    if(authenticated){
        props.history.push("/");
    }

    const initial = {
        code: ""
    }

    async function ConfirmUser(values){
        if (values) {
            try{
                await Auth.confirmSignIn(
                    user,
                    values.code,
                    user.challengeName
                    );
                user = await Auth.currentAuthenticatedUser();
                store.dispatch(setStatusBar(true, "success", "The User " + user.username + " is confirmed successfully."));
                store.dispatch(updateEditableUser(null));
                let apiUsers = await  API.GetAllUsers()
                store.dispatch(updateAllUsers(apiUsers.data))
                let currentUser = apiUsers.data.find(_user => _user.CognitoId === user.attributes.sub)
                if (currentUser === undefined) {
                    store.dispatch(setStatusBar(true, 'error', "Cannot Get Current User"));
                    return;
                }
                else if (currentUser.isActive === false) {
                    store.dispatch(setStatusBar(true, 'Error', `${currentUser.UserName} is not Activated!`));
                    Auth.signOut();
                    return;
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
                    props.history.push("/");
                }
            }
            catch(error) {
                store.dispatch(setStatusBar(true, "error", error.message));
            }
        }
    };

    return (
        <div className={classes.mainContainer} >
            <Formik
                initialValues={initial}
                validate={(values) => {
                    const errors = {};
                    if (!values.code) {
                        errors.code = "Required";
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    ConfirmUser(values);
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
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Form>
                            <Typography variant="h5"> User Verification:</Typography>
                            <Typography variant="h7"> Enter Confirmation code Sent to your Email or Phone.</Typography>
                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="code"
                                    type="text"
                                    label="Verification Code"
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Button
                                    className={classes.FieldItems}

                                    variant="contained"
                                    color="secondary"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    Submit Code
                                </Button>
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Link to={"/Login"}>Back to Login</Link>
                            </Box>
                        </Form>
                    </MuiPickersUtilsProvider>
                )}
            </Formik>
        </div>
    );

}

export default ConfirmUser;
