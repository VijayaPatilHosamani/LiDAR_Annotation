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
import ProfileHeaderView from ".";

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



const ProfileView = props => {
    const classes = useStyles();
    let initial = {
        userName: "",
        email: "",
        twoFactorAuthentication: "Disable",
        givenName: "",
        middleName: "",
        familyName: "",
        phoneNumber: "",
        gender: "Male",
        dateOfBirth: new Date(),
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        roles: UserType.AGENT,
        password: "",
        newPassword: "",
        confirmPassword: "",
    };
    // to get User details and fill up the initial with new details.
    const editableUser = UserSelector.getCurrentUser();
    if (editableUser === undefined || editableUser.UserId === undefined) {
        props.history.push("/users");
    }
    else {
        initial.UserId = editableUser.UserId;
        initial.userName = editableUser.UserName ? editableUser.UserName : "";
        initial.email = editableUser.EmailId ? editableUser.EmailId : "";
        initial.firstName = editableUser.FirstName ? editableUser.FirstName : "";
        initial.middleName = editableUser.MiddleName ? editableUser.UserName : "";
        initial.lastName = editableUser.LastName ? editableUser.LastName : "";
        initial.phoneNumber = editableUser.PhoneNo ? editableUser.PhoneNo : "";
        initial.gender = editableUser.Gender ? editableUser.Gender : "Male";
        initial.dateOfBirth = editableUser.DOB ? new Date(editableUser.DOB) : new Date();
        initial.address = editableUser.Address ? editableUser.Address : "";
        initial.city = editableUser.City ? editableUser.City : "";
        initial.state = editableUser.State ? editableUser.State : "";
        initial.zipCode = editableUser.ZipCode ? editableUser.ZipCode : "";
        initial.country = editableUser.Country ? editableUser.Country : "";
        initial.roles = editableUser.Role ? editableUser.Role : UserType.AGENT;
        initial.twoFactorAuthentication = editableUser.twoFactorAuthentication ? editableUser.twoFactorAuthentication : "Disable";
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
            twoFactorAuthentication: editableUser.twoFactorAuthentication ? editableUser.twoFactorAuthentication : "Disable"
        }

        if (values.email !== editableUser.email) {
            store.dispatch(setStatusBar(true, "Error", "Changing Email is Not Possible!"));
        }
        API.UpdateUser(UserDetails, UserDetails.UserId).then(() => {
            store.dispatch(setStatusBar(true, "Success", "User Details Submitted"));
            props.history.push("/users");
        }).catch((error) => {
            store.dispatch(setStatusBar(true, "Error", "Some Error in submitting user details, try again!"));
            console.error(error);
        })
    };


    return (
        <div>
            <ProfileHeaderView />
            <div className={classes.mainContainer} >
                <Formik
                    initialValues={initial}
                    validate={(values) => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = "Required";
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
                        ) {
                            errors.email = "invalid email address";
                        }
                        if (!values.firstName) {
                            errors.firstName = "Required";
                        }
                        if (!/^[a-zA-Z]+$/.test(values.firstName)) {
                            errors.firstName = "Name can only have words.";
                        }

                        if (values.middleName && !(/^[a-zA-Z]+$/g.test(values.middleName))) {
                            errors.middleName = "Name can only have words.";
                        }

                        if (values.lastName && !(/^[a-zA-Z]+$/g.test(values.lastName))) {
                            errors.lastName = "Name can only have words.";
                        }

                        if (!values.userName) {
                            errors.userName = "Required"
                        }

                        if (values.zipCode && !(/^[\d]+$/g.test(values.zipCode))) {
                            errors.zipCode = "ZipCode must be a Number";
                        }

                        if (values.country && !(/^[a-zA-Z]+$/g.test(values.country))) {
                            errors.country = "Country name cannot have Number or symbols";
                        }

                        if (values.city && !(/^[a-zA-Z]+$/g.test(values.city))) {
                            errors.city = "City name cannot have Number or symbols";
                        }

                        if (values.state && !(/^[a-zA-Z]+$/g.test(values.state))) {
                            errors.state = "State name cannot have Number or symbols";
                        }


                        return errors;
                    }}
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Form>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="email"
                                        type="email"
                                        label="Email ID"
                                    />
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="userName"
                                        type="text"
                                        label="User Name"
                                    />
                                </Box>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="firstName"
                                        type="text"
                                        label="First Name"
                                    />
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="middleName"
                                        type="text"
                                        label="Middle Name"
                                    />
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="lastName"
                                        type="text"
                                        label="Last Name"
                                    />
                                </Box>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="phoneNumber"
                                        type="number"
                                        label="Phone Number"
                                    />
                                </Box>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
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
                                    />
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        rowsMax={4}
                                        component={TextField}
                                        multiline
                                        name="address"
                                        type="textArea"
                                        label="Address"
                                        fullWidth
                                    />
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="city"
                                        type="text"
                                        label="City"
                                    />
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="state"
                                        type="text"
                                        label="State"
                                    />
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="zipCode"
                                        type="text"
                                        label="Zip Code"
                                    />

                                    <Field
                                        className={classes.FieldItems}
                                        component={TextField}
                                        name="country"
                                        type="text"
                                        label="Country"
                                    />
                                </Box>
                                {editableUser.Role === UserType.PROJECTMANAGER &&
                                    <Box className={classes.FieldContainer}>
                                        <Typography>Roles</Typography>
                                        <Field
                                            className={classes.FieldItems}
                                            name="roles"
                                            options={[UserType.AGENT, UserType.SUPERVISOR, UserType.PROJECTMANAGER]}
                                            component={FormikRadioGroup}
                                        />
                                    </Box>
                                }

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
        </div>
    );

}

export default ProfileView;
