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


async function signUp(username, password, email, phone_number, userType) {
    return Auth.signUp({
        username,
        password,
        attributes: {
            email,          // optional
            name: username,
            phone_number,   // optional - E.164 number convention
            'custom:userType': userType// other custom attributes
        }
    });
}


const CreateNewUser = props => {
    const classes = useStyles();
    const initial = {
        userName: "",
        email: "",
        password: "",
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
        roles: "Agent"
    };

    const CreateUser = (values) => {
        let UserDetails = {
            FirstName: "",
            MiddleName:"",
            LastName: "",
            EmailId: "",
            PhoneNo: "",
            Gender: "",
            DOB: "",
            Country: "",
            State: "",
            City: "",
            Address: "",
            ZipCode: "",
            Role: "",
            isActive: false,
            UserName: "",
            CognitoId: "",
            TenantID: "1"
        };
        if (values) {
            let role;
            if (values.roles === "Agent") {
                role = UserType.AGENT;
            }
            if (values.roles === "Supervisor") {
                role = UserType.SUPERVISOR;
            }
            if (values.roles === "Project Manager") {
                role = UserType.PROJECTMANAGER;
            }
            UserDetails.FirstName = values.firstName;
            UserDetails.MiddleName = values.middleName;
            UserDetails.LastName = values.lastName;
            UserDetails.EmailId = values.email;
            UserDetails.PhoneNo = values.phoneNumber;
            UserDetails.Gender = values.gender;
            UserDetails.DOB = values.dateOfBirth;
            UserDetails.Country = values.country;
            UserDetails.State = values.state;
            UserDetails.City = values.city;
            UserDetails.Address = values.address;
            UserDetails.ZipCode = values.zipCode;
            UserDetails.Role = role;
            UserDetails.UserName = values.userName;
            UserDetails.CognitoId = "";

            signUp(values.userName, values.password, values.email, values.phoneNumber, role)
                .then(user => {
                    UserDetails.CognitoId = user.userSub
                    API.CreateUser(UserDetails).then(data => {
                        store.dispatch(setStatusBar(true, "Success", "User Details Submitted"));
                    }).catch((error) => {
                        store.dispatch(setStatusBar(true, "Error", "Some Error in submitting User Details, try again"));
                        console.error(error);
                    })
                    store.dispatch(updateEditableUser(values.userName));
                    props.history.push("/user/create/confirm");
                }
                ).catch(error => {
                    store.dispatch(setStatusBar(true, "error", error.message));
                })
        }
        props.history.push("/users");
    };


    return (
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
                    if (!values.password) {
                        errors.password = "Required";
                    }
                    else if (!(/[A-Z]/s.test(values.password))) {
                        errors.password = "Password must Have a Uppercase Character";
                    }
                    else if (!(/[a-z]/s.test(values.password))) {
                        errors.password = "Password must Have a Lower Character";
                    }
                    else if (!(/^(?=.*?[0-9])/s.test(values.password))) {
                        errors.password = "Password must Have a Number Character";
                    }
                    else if (!(/^(?=.*?[#?!@$%^&*-])/s.test(values.password))) {
                        errors.password = "Password must Have a Special Character";
                    }
                    else if (values.password.length < 8) {
                        errors.password = "Password should be more than 8 characters.";
                    }

                    if (values.password !== values.confirmPassword) {
                        errors.confirmPassword = "Password Doesn't match";
                    }

                    if (!values.phoneNumber) {
                        errors.phoneNumber = "Required";
                    }
                    else if (values.phoneNumber.length !== 13) {
                        errors.phoneNumber = "Size is Wrong Check Number Should be 13(1+2+10)";
                    }
                    else if (!(/^[+]/s.test(values.phoneNumber))) {
                        errors.phoneNumber = "must follow Convention e.g:+919876543210"
                    }

                    if (values.firstName === "") {
                        errors.firstName = "Required";
                    }
                    if (!/^[a-zA-Z ]+$/.test(values.firstName)) {
                        errors.firstName = "Name can only have words.";
                    }

                     if (values.middleName !=="" && !(/^[a-zA-Z ]+$/g.test(values.middleName))) {
                        errors.middleName = "Name can only have words.";
                    }

                    if (values.lastName !=="" && !(/^[a-zA-Z ]+$/g.test(values.lastName))) {
                        errors.lastName = "Name can only have words.";
                    }

                    if (values.userName === "") {
                        errors.userName = "Required"
                    }

                    if (values.zipCode!=="" && !(/^[\d]+$/g.test(values.zipCode))) {
                        errors.zipCode = "ZipCode must be a Number";
                    }

                    if (values.country!=="" && !(/^[a-zA-Z ]+$/g.test(values.country))) {
                        errors.country = "Country name cannot have Number or symbols";
                    }

                    if (values.city!=="" && !(/^[a-zA-Z ]+$/g.test(values.city))) {
                        errors.city = "City name cannot have Number or symbols";
                    }

                    if (values.state!=="" && !(/^[a-zA-Z ]+$/g.test(values.state))) {
                        errors.state = "State name cannot have Number or symbols";
                    }

                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    store.dispatch(setStatusBar(true, "Load", "Processing..."));
                    setSubmitting(true);
                    let old = new Date();
                    let young = new Date();
                    let dob = values.dateOfBirth;
                    young.setFullYear(young.getFullYear() - 18);
                    old.setFullYear(old.getFullYear() - 60);
                    if (dob < old) {
                        store.dispatch(setStatusBar(true, "error", "Date of birth is too old!"));
                    }
                    else if (dob > young) {
                        store.dispatch(setStatusBar(true, "error", "Date of birth is too young!"));
                    }
                    else {
                        CreateUser(values);
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
                                    name="password"
                                    type="password"
                                    id="password"
                                    label="Password"
                                    helperText="Please Enter a Valid Password"
                                />
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    name="confirmPassword"
                                    type="password"
                                    label="Confirm the Password"
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
                                    type="text"
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
                            <Box className={classes.FieldContainer}>
                                <Typography>Roles</Typography>
                                <Field
                                    className={classes.FieldItems}

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
                                    Create User
                                </Button>
                            </Box>
                        </Form>
                    </MuiPickersUtilsProvider>
                )}
            </Formik>
        </div >
    );

}

export default CreateNewUser;
