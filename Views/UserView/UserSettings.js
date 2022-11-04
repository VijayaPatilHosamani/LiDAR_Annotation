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
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { UserSelector } from "../../Store/User";
import FormikRadioGroup from "../../components/FormikRadioGroup";
import API from "../../Api";
import { setStatusBar } from "../../Store/Site/ActionCreator";
import { store } from "../..";
import { UserType } from "../../Store/User";

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



const UserSettings = props => {
    const classes = useStyles();
    let initial = {
        userName: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorAuthentication: "Disable",
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        gender: "Male",
        dateOfBirth: new Date(),
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        roles: UserType.AGENT,
    };
    const editableUserId = UserSelector.getEditableUserId();
    if (editableUserId === null) {
        props.history.push("/users");
    }

    // to get User details and fill up the initial with new details.
    const allUsers = UserSelector.getAllUsers();
    const editableUser = allUsers.find(user => user.UserId === editableUserId)
    if (editableUser === undefined) {
        props.history.push("/users");
    }
    else {
        initial = {
            UserId: editableUserId,
            userName: editableUser.UserName ? editableUser.UserName : "",
            email: editableUser.EmailId ? editableUser.EmailId : "",
            firstName: editableUser.FirstName ? editableUser.FirstName : "",
            middleName: editableUser.MiddleName ? editableUser.UserName : "",
            lastName: editableUser.LastName ? editableUser.LastName : "",
            phoneNumber: editableUser.PhoneNo ? editableUser.PhoneNo : "",
            gender: editableUser.Gender ? editableUser.Gender : "Male",
            dateOfBirth: editableUser.DOB ? new Date(editableUser.DOB) : new Date(),
            address: editableUser.Address ? editableUser.Address : "",
            city: editableUser.City ? editableUser.City : "",
            state: editableUser.State ? editableUser.State : "",
            zipCode: editableUser.ZipCode ? editableUser.ZipCode : "",
            country: editableUser.Country ? editableUser.Country : "",
            roles: editableUser.Role ? editableUser.Role : UserType.AGENT,
            twoFactorAuthentication: editableUser.twoFactorAuthentication ? editableUser.twoFactorAuthentication : "Disable"
        };
    }


    const EditUser = (values) => {
        /*editableUserId*/
        let UserDetails = {
            UserName: values.userName,
            EmailId: values.email,
            FirstName: values.firstName,
            MiddleName: values.middleName,
            LastName: values.lastName,
            PhoneNo: values.phoneNumber,
            Gender: values.gender,
            DOB: values.dateOfBirth,
            Address: values.address,
            City: values.city,
            State: values.state,
            ZipCode: values.zipCode,
            Country: values.country,
            Role: values.roles,
            twoFactorAuthentication: values.twoFactorAuthentication ? values.twoFactorAuthentication : "Disable"
        }


        API.UpdateUser(UserDetails, editableUserId).then(() => {
            store.dispatch(setStatusBar(true, "Success", "User Details Submitted"));
            props.history.push("/users");
        }).catch((error) => {
            store.dispatch(setStatusBar(true, "Error", "Some Error in submitting user details, try again!"));
            console.error(error);
        })
    };


    return (
        <div className={classes.mainContainer} >
            <Formik
                initialValues={initial}
                validate={(values) => {
                    const errors = {};
                    if (values.phoneNumber === "") {
                        errors.phoneNumber = "Required";
                    }
                    else if (values.phoneNumber.length > 13) {
                        errors.phoneNumber = "Size is Wrong Check Number Should be 13(1(+)+2(country code)+10(user number))";
                    }
                    else if (values.phoneNumber.length !== 13) {
                        errors.phoneNumber = "Size is Wrong Check Number Should be 13(1(+)+2(country code)+10(user number))";
                    }
                    else if (!(/^[+]/s.test(values.phoneNumber))) {
                        errors.phoneNumber = "must follow Convention e.g:+919876543210"
                    }

                    if (values.firstName === "") {
                        errors.firstName = "Required";
                    }
                    else if (!(/^[a-zA-Z ]+$/.test(values.firstName))) {
                        errors.firstName = "Name can only have words.";
                    }
                    else if (values.firstName.length > 13) {
                        errors.firstName = " Name is Too Long, use Middle and Last Name field instead";
                    }

                    if (values.middleName !== "" && !(/^[a-zA-Z ]+$/g.test(values.middleName))) {
                        errors.middleName = "Name can only have words.";
                    }
                    else if (values.middleName.length > 13) {
                        errors.middleName = " Name is Too Long";
                    }

                    if (values.lastName !== "" && !(/^[a-zA-Z ]+$/g.test(values.lastName))) {
                        errors.lastName = "Name can only have words.";
                    }
                    else if (values.lastName.length > 13) {
                        errors.lastName = " Name is Too Long";
                    }

                    if (values.zipCode !== "") {
                        if (!(/^[\d]+$/g.test(values.zipCode))) {
                            errors.zipCode = "ZipCode must be Numbers";
                        }
                    }
                    else if (values.zipCode.length > 10) {
                        errors.zipCode = " zip code too long";
                    }

                    if (values.country !== "" && !(/^[a-zA-Z ]+$/g.test(values.country))) {
                        errors.country = "Country name cannot have Number or symbols";
                    }
                    else if (values.country.length > 20) {
                        errors.country = " Country Name is Too Long";
                    }

                    if (values.city !== "" && !(/^[a-zA-Z ]+$/g.test(values.city))) {
                        errors.city = "City name cannot have Number or symbols";
                    }
                    else if (values.city.length > 20) {
                        errors.city = " City Name is Too Long";
                    }

                    if (values.state !== "" && !(/^[a-zA-Z ]+$/g.test(values.state))) {
                        errors.state = "State name cannot have Number or symbols";
                    }
                    else if (values.state.length > 20) {
                        errors.state = " State Name is Too Long";
                    }

                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    store.dispatch(setStatusBar(true, "Load", "Processing"));
                    setSubmitting(true);
                    let old = new Date();
                    let young = new Date();
                    let now = values.dateOfBirth
                    young.setFullYear(young.getFullYear() - 18);
                    old.setFullYear(old.getFullYear() - 60);
                    if (now.getYear() < old.getYear()) {
                        store.dispatch(setStatusBar(true, "error", "Date of birth is too old!"));
                    }
                    else if (now.getYear() > young.getYear()) {
                        store.dispatch(setStatusBar(true, "error", "Date of birth is too young!"));
                    }
                    else {
                        EditUser(values);
                    }
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

                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="firstName"
                                    type="text"
                                    label="First Name"
                                    disabled={isSubmitting}
                                />
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="middleName"
                                    type="text"
                                    label="Middle Name"
                                    disabled={isSubmitting}
                                />
                            </Box>

                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="lastName"
                                    type="text"
                                    label="Last Name"
                                    disabled={isSubmitting}
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    disabled={isSubmitting}
                                    component={TextField}
                                    name="phoneNumber"
                                    type="text"
                                    label="Phone Number"
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    disabled={isSubmitting}
                                    component={TextField}
                                    type="text"
                                    name="gender"
                                    label="Gender"
                                    select
                                    variant="standard"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                >
                                    <MenuItem key="Male" value="Male">
                                        Male
                                                </MenuItem>
                                    <MenuItem key="Female" value="Female">
                                        Female
                                                </MenuItem>
                                    <MenuItem key="Other" value="Other">
                                        Other
                                                </MenuItem>
                                </Field>
                            </Box>

                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={DatePicker}
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    disabled={isSubmitting}
                                />
                            </Box>

                            <Box className={classes.FieldContainer}>
                                <Field
                                    disabled={isSubmitting}
                                    className={classes.FieldItems}
                                    component={TextField}
                                    multiline
                                    rowsMax={4}
                                    name="address"
                                    type="textArea"
                                    label="Address"
                                    fullWidth
                                />
                            </Box>

                            <Box className={classes.FieldContainer}>
                                <Field
                                    disabled={isSubmitting}
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="city"
                                    type="text"
                                    label="City"
                                />
                                <Field
                                    disabled={isSubmitting}
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="state"
                                    type="text"
                                    label="State"
                                />
                            </Box>

                            <Box className={classes.FieldContainer}>
                                <Field
                                    disabled={isSubmitting}
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="zipCode"
                                    type="text"
                                    label="Zip Code"
                                />

                                <Field
                                    disabled={isSubmitting}
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="country"
                                    type="text"
                                    label="Country"
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Typography>Roles</Typography>
                                <Field
                                    className={classes.FieldItems}
                                    disabled={isSubmitting}
                                    name="roles"
                                    options={["Agent", "Supervisor", "Project Manager"]}
                                    component={FormikRadioGroup}
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
                                    Update User
                                </Button>
                            </Box>
                        </Form>
                    </MuiPickersUtilsProvider>
                )}
            </Formik>
        </div>
    );

}

export default UserSettings;
