/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@material-ui/core';
import { Box } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { withStyles } from "@material-ui/core";
import { ProjectSelector } from "../../../Store/Project"
import { updateToBeEditedProject } from '../../../Store/Project/ActionCreator';
import { store } from "../../..";
import { setStatusBar } from "../../../Store/Site/ActionCreator";

const styles = (theme) => ({
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
        display: "flex",
        justifyContent: "center",
        margin: theme.spacing(1),
        padding: theme.spacing(1),
    },
    FieldItems: {
        marginLeft: theme.spacing(2),
    },
    menuButton: {
        background: "#ff9900",
        color: theme.palette.common.white,
        fontWeight: "bold",
        float: "right",
        padding: theme.spacing(2),
        margin: theme.spacing(3),
    },
});


class SetupProject extends React.Component {
    constructor(props) {
        super(props);
        let project = ProjectSelector.GetToBeEditedProject();
        if (project === null) {
            project = {
                projectName: "",
                clientName: "",
                projectCode: "",
                trainingMaterial: "",
                type: "",
            }
        }
        this.state = {
            value: {
                projectName: (project.projectName ? project.projectName : ""),
                clientName: (project.clientName ? project.clientName : ""),
                projectCode: (project.projectCode ? project.projectCode : ""),
                trainingMaterial: (project.trainingMaterial ? project.trainingMaterial : ""),
                type: (project.type ? project.type : ""),
            }
        }
    }

    handleSave = (fields) => {
        store.dispatch(setStatusBar(true, "Load", "Project Details Saving..."));
        const project = ProjectSelector.GetToBeEditedProject();
        store.dispatch(updateToBeEditedProject({
            ...project,
            projectName: fields.projectName,
            clientName: fields.clientName,
            projectCode: fields.projectCode,
            trainingMaterial: fields.trainingMaterial,
            type: fields.type,
        }))
        store.dispatch(setStatusBar(true, "success", "Project Details Saved!"));
    }
    componentDidMount = () => {
        const project = ProjectSelector.GetToBeEditedProject();
        if (project) {
            const newstate = {
                projectName: (project.projectName ? project.projectName : ""),
                clientName: (project.clientName ? project.clientName : ""),
                projectCode: (project.projectCode ? project.projectCode : ""),
                trainingMaterial: (project.trainingMaterial ? project.trainingMaterial : ""),
                type: (project.type ? project.type : ""),
            }
            this.setState({
                value: newstate,
            })
        }
    }


    render() {
        const classes = this.props.classes;
        return (
            <div>
                <Formik
                    initialValues={this.state.value}
                    validationSchema={Yup.object().shape({
                        projectName: Yup.string()
                            .required('Project Name is required'),
                        clientName: Yup.string()
                            .required('Client Name is required'),
                        projectCode: Yup.string()
                            .required('Project code is required'),
                        trainingMaterial: Yup.string()
                            .required('Training Material is required'),
                        type: Yup.string()
                            .required('Type is required')
                    })}
                    onSubmit={(fields, {setSubmitting}) => {
                        setSubmitting(true);
                        this.handleSave(fields);
                        setSubmitting(false);
                    }}
                >
                    {({ errors, status, touched, handleSubmit, isSubmitting }) => (
                        <Form>
                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    id="projectName"
                                    name="projectName"
                                    type="text"
                                    label="Project Name"
                                    disabled={isSubmitting}
                                    fullWidth
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    id="clientName"
                                    name="clientName"
                                    type="text"
                                    label="Client Name"
                                    disabled={isSubmitting}
                                    fullWidth
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    id="projectCode"
                                    name="projectCode"
                                    type="text"
                                    label="Project Code"
                                    helperText="Project Code like XYZ"
                                    disabled={isSubmitting}
                                    fullWidth
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    id="trainingMaterial"
                                    name="trainingMaterial"
                                    type="text"
                                    label="Training Material"
                                    helperText="Training Material from url"
                                    disabled={isSubmitting}
                                    fullWidth
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Field
                                    className={classes.FieldItems}
                                    component={TextField}
                                    id="type"
                                    name="type"
                                    type="text"
                                    label="Type"
                                    helperText="Project Type"
                                    disabled={isSubmitting}
                                    fullWidth
                                />
                            </Box>

                            <Box className={classes.FieldContainer}>
                                <Button variant="contained" type="submit" className={
                                    classes.menuButton
                                }
                                disabled={isSubmitting}
                                    onClick={handleSubmit}
                                >Save</Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default withStyles(styles)(SetupProject);