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
import { UserSelector } from "../../Store/User";
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel'
import Grid from "@material-ui/core/Grid";
import FormikRadioGroup from "../../components/FormikRadioGroup";
import API from "../../Api";
import { setStatusBar } from "../../Store/Site/ActionCreator";
import { store } from "../..";

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



const UserManage = props => {
    const classes = useStyles();
    let initial = {
        status: "DeActivate",
    };
    const editableUserId = UserSelector.getEditableUserId();
    const allUsers = UserSelector.getAllUsers();

    if (editableUserId === null || allUsers === null) {
        props.history.push("/users");
    }
    const editableUser = allUsers.find(user => user.UserId === editableUserId)

    if (editableUser === undefined) {
        props.history.push("/users");
    }
    else {
        initial = {
            status: editableUser.isActive ? "Activate" : "DeActivate"
        };
    }

    // to get User details and fill up the initial with new details.

    const EditUser = (values) => {
        /*editableUserId*/
        editableUser.isActive = values.status === "Activate" ? true : false;
        API.UpdateUser(editableUser, editableUserId).then(data => {
            store.dispatch(setStatusBar(true, "Success", "User Details Submitted"));
        }).catch((error) => {
            store.dispatch(setStatusBar(true, "Error", "Some Error in submitting user details, try again!"));
            console.error(error);
        })
        props.history.push("/users");
    };


    return (
        <div className={classes.mainContainer} >
            <Formik
                initialValues={initial}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    EditUser(values);
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
                    <Form className={classes.FieldContainer}>
                        <Typography>Status:</Typography>
                        <Field
                            className={classes.FieldItems}

                            name="status"
                            options={["Activate", "DeActivate"]}
                            component={FormikRadioGroup}
                        />
                        <div>

                            <Button
                                className={classes.FieldItems}
                                variant="contained"
                                color="secondary"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                            >
                                Submit
                                </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );

}

export default UserManage;
