/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Formik, Form, Field } from "formik";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker } from "formik-material-ui-pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
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
import { updateEditableUser } from "../../Store/User/ActionCreator";
import { store } from "../..";
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


async function confirmSignUp(username, code) {
    return Auth.confirmSignUp(
        username,
        code
    );
}


const ConfirmCreateUser = props => {
    const classes = useStyles();
    let userName = UserSelector.getEditableUser();
    if (userName === null || userName === undefined || userName === "") {
        props.history.push("/users");
    }
    const initial = {
        code: ""
    };

    const ConfirmUser = (values) => {
        if (values) {
            confirmSignUp(userName, values.code)
                .then(
                    data => {
                        store.dispatch(setStatusBar(true, "success", "The User " + userName + " is confirmed successfully."));
                        store.dispatch(updateEditableUser(null));
                        props.history.push("/users");
                    }
                ).catch(error => {
                    store.dispatch(setStatusBar(true, "error", error.message));
                })
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
                        </Form>
                    </MuiPickersUtilsProvider>
                )}
            </Formik>
        </div>
    );

}

export default ConfirmCreateUser;
