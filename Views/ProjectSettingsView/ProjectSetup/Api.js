/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FormikRadioGroup from '../../../components/FormikRadioGroup';
import { Button, Box, Typography } from '@material-ui/core';
import { TextField } from "formik-material-ui";
import { withStyles } from "@material-ui/core";
import { ProjectSelector } from "../../../Store/Project"
import { updateToBeEditedProject } from '../../../Store/Project/ActionCreator';
import { store } from "../../..";
import {setStatusBar} from "../../../Store/Site/ActionCreator";

const styles = (theme) => ({
    FieldContainer: {
        justifyContent: "center",
        margin: theme.spacing(1),
        padding: theme.spacing(1),
    },
    SubmitProject: {
        background: "#ff9900",
        color: theme.palette.common.white,
        fontWeight: "bold",
        float: "right",
        padding: theme.spacing(2),
        margin: theme.spacing(3),
    },
    FieldItems: {
        marginLeft: theme.spacing(2),
    },
    menuButton: {
        background: "#ff9900",
        color: theme.palette.common.white,
        fontWeight: "bold",
        float: "left",
        padding: theme.spacing(2),
        margin: theme.spacing(3),
    },
});


class SetupProjectApi extends React.Component {
    constructor(props) {
        super(props);
        let project = ProjectSelector.GetToBeEditedProject();
        if (project === null) {
            project = {
                api: '',
            }
        }
        this.state = {
            value: {
                api: (project.api ? project.api : ""),
            }
        }
    }

    handleSave = (fields) => {
        store.dispatch(setStatusBar(true, "Load", "Project API Details Saving..."));
        const project = ProjectSelector.GetToBeEditedProject();
        store.dispatch(updateToBeEditedProject({
            ...project,
            api: fields.api,
        }))
        store.dispatch(setStatusBar(true, "success", "Project API Details Saved!"));
    }
    componentDidMount = () => {
        const project = ProjectSelector.GetToBeEditedProject();
        if (project) {
            const newstate = {
                api: (project.api ? project.api : ""),
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
                        api: Yup.string()
                            .required('Api is required'),
                    })}
                    onSubmit={(fields, { setSubmitting })=> {
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
                                    id="api"
                                    name="api"
                                    type="text"
                                    label="API"
                                    helperText="Format"
                                    multiline
                                    rowsMax={8}
                                    fullWidth
                                    disabled={isSubmitting}
                                />
                            </Box>
                            <Box className={classes.FieldContainer}>
                                <Button variant="contained" type="submit"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={
                                        classes.menuButton
                                    }>Save</Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
                <Box className={classes.FieldContainer}>
                    <Button variant="contained" className={classes.SubmitProject}
                        onClick={this.props.handleSubmitProject}>
                        Submit Project
                    </Button>
                </Box>

            </div>
        );
    }
}
export default withStyles(styles)(SetupProjectApi);
