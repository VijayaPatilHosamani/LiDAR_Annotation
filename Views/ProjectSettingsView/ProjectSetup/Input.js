/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import * as Yup from 'yup';
import AddIcon from '@material-ui/icons/Add';
import FormikRadioGroup from '../../../components/FormikRadioGroup';
import { Button, Box, Typography, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { withStyles } from "@material-ui/core";
import { ProjectSelector } from "../../../Store/Project"
import { updateToBeEditedProject } from '../../../Store/Project/ActionCreator';
import { store } from "../../..";
import {setStatusBar} from "../../../Store/Site/ActionCreator";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = (theme) => ({
    FieldContainer: {
        display: "flex",
        justifyContent: "center",
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        alignItems: "center",
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


class SetupProjectInput extends React.Component {
    constructor(props) {
        super(props);
        let ProjectInput = {
            production: false,
            review: false,
            productionRadioGroup: "",
            reviewRadioGroup: "",
            inputs: [
                {
                    name: "URL",
                    type: "ImageURL",
                },
            ]
        }
        let project = ProjectSelector.GetToBeEditedProject();
        if (project && project.ProjectInput) {
            let inputs = []
            if (project.ProjectInput !== undefined && project.ProjectInput.inputs !== undefined && project.ProjectInput.inputs.length > 0) {
                inputs = project.ProjectInput.inputs;
            }
            ProjectInput = {
                production: project.ProjectInput.production ? true : false,
                review: project.ProjectInput.review ? true : false,
                productionRadioGroup: (project.ProjectInput.productionRadioGroup ? project.ProjectInput.productionRadioGroup : ""),
                reviewRadioGroup: (project.ProjectInput.reviewRadioGroup ? project.ProjectInput.reviewRadioGroup : ""),
                inputs: inputs,
            }
        }

        this.state = {
            value: ProjectInput
        }
    }

    handleSave = (fields) => {

        store.dispatch(setStatusBar(true, "Load", "Project Input Details Saving..."));
        const project = ProjectSelector.GetToBeEditedProject();
        if (!fields.production) {
            fields.productionRadioGroup = ""
        }
        if (!fields.review) {
            fields.reviewRadioGroup = ""
        }

        if(fields.inputs.length <= 0){
            store.dispatch(setStatusBar(true, "error", "Needs at least one input"));
            return;
        }

        let inputs = []
        if (fields.inputs !== undefined && fields.inputs.length > 0) {
            inputs = fields.inputs.filter(input => { return input.name !== "" })
        }

        store.dispatch(updateToBeEditedProject({
            ...project,
            ProjectInput: {
                production: fields.production,
                review: fields.review,
                productionRadioGroup: fields.productionRadioGroup,
                reviewRadioGroup: fields.reviewRadioGroup,
                inputs: inputs
            }
        }))
        store.dispatch(setStatusBar(true, "success", "Project Input Details Saved!"));
    }
    componentDidMount = () => {
        const project = ProjectSelector.GetToBeEditedProject();
        if (project) {
            if (project.ProjectInput !== undefined) {
                let inputs = []
                if (project.ProjectInput.inputs !== undefined) {
                    inputs = project.ProjectInput.inputs;
                }
                let ProjectInput = {
                    production: project.ProjectInput.production ? true : false,
                    review: project.ProjectInput.review ? true : false,
                    productionRadioGroup: (project.ProjectInput.productionRadioGroup ? project.ProjectInput.productionRadioGroup : ""),
                    reviewRadioGroup: (project.ProjectInput.reviewRadioGroup ? project.ProjectInput.reviewRadioGroup : ""),
                    inputs: inputs,
                }
                this.setState({
                    value: ProjectInput,
                })
            }
        }
    }


    render() {
        const classes = this.props.classes;
        return (
            <div>
                <Formik
                    initialValues={this.state.value}
                    validate={(values) => {
                        const errors = {};
                        if (values === undefined) {
                            errors.inputs = " Values Required";
                        }
                        else if (values.inputs === undefined) {
                            errors.inputs = 'minimum one input is Required';
                        }
                        else if (values.inputs.length === 0) {
                            errors.inputs = 'minimum one input is Required';
                        }
                        else if (values.inputs.find(input => input.type === 'ImageURL') === undefined) {
                            errors.inputs = 'a ImageURL type is required';
                        }
                        else if (values.inputs.filter(input => input.type === 'ImageURL').length > 1) {
                            errors.inputs = 'only one ImageURL type is allowed';
                        }
                        else if (values.inputs.find(input => input.name !== '') === undefined) {
                            errors.inputs = 'Names are required';
                        }
                        else if (values.inputs.find(input => input.name !== '' && input.type === 'ImageURL') === undefined) {
                            errors.inputs = 'ImageURL Type requires a Name';
                        }
                        return errors;
                    }
                    }
                    onSubmit={(fields, { setSubmitting }) => {
                        setSubmitting(true);
                        this.handleSave(fields);
                        setSubmitting(false)
                    }}
                >
                    {({ errors, status, touched, handleSubmit, isSubmitting, values }) => (
                        <Form>
                            <Box style={{ display: 'flex', justifyContent: "space-between" }}>
                                <Typography variant="h6" name="input">Input: </Typography>
                                <ErrorMessage name="inputs" />
                            </Box>
                            <div style={{ "border-bottom": "1px solid black" }} />
                            <FieldArray
                                name="inputs"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        {values.inputs.length > 0 &&
                                            values.inputs.map((input, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`inputs.${index}.name`}
                                                        placeholder={`Input Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Field
                                                        component={TextField}
                                                        type="text"
                                                        name={`inputs.${index}.type`}
                                                        select
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    >
                                                        <MenuItem value="String">String</MenuItem>
                                                        <MenuItem value="ImageURL">ImageURL</MenuItem>
                                                        <MenuItem value="URL">URL</MenuItem>
                                                    </Field>
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Workflow</Typography>
                                            <Button name="AddButton" className="add-btn" onClick={() => push({ name: "", type: "String" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}/>
                                        </Box>
                                    </div>
                                )}
                            />

                            <Box className={classes.FieldContainer}>
                                <Box className={classes.FieldContainer}>
                                    <Field type="checkbox" className={classes.FieldItems}
                                        style={{ width: "20px", height: "20px" }}
                                        name="production" label="Production"
                                        disabled={isSubmitting}
                                    />
                                    <Typography> Production</Typography>
                                </Box>

                                <Box className={classes.FieldContainer}>
                                    <Field
                                        name="productionRadioGroup"
                                        options={["Show Agent Name", "Show Task ID"]}
                                        component={FormikRadioGroup}
                                        style={{ "flex-direction": "row" }}
                                        disabled={!values.production || isSubmitting}
                                    />
                                    <ErrorMessage name="productionRadioGroupError" component="div" className="invalid-feedback" />
                                </Box>
                            </Box>

                            <Box className={classes.FieldContainer}>
                                <Box className={classes.FieldContainer}>
                                    <Field type="checkbox" className={classes.FieldItems}
                                        style={{ width: "20px", height: "20px" }}
                                        name="review" label="Review" disabled={isSubmitting}
                                    />
                                    <Typography> Review</Typography>
                                </Box>
                                <Box className={classes.FieldContainer}>
                                    <Field
                                        name="reviewRadioGroup"
                                        options={["Show Agent Name", "Show Task ID"]}
                                        component={FormikRadioGroup}
                                        style={{ "flex-direction": "row" }}
                                        disabled={!values.review || isSubmitting}
                                    />
                                    <ErrorMessage name="reviewRadioGroupError" component="div" className="invalid-feedback" />
                                </Box>
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
            </div >
        );
    }
}
export default withStyles(styles)(SetupProjectInput);
