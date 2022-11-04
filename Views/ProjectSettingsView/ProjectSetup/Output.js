/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Checkbox } from 'semantic-ui-react'
import AddIcon from '@material-ui/icons/Add';

import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import FormikRadioGroup from '../../../components/FormikRadioGroup';
import { Button, Box, Typography } from '@material-ui/core';
import { TextField } from "formik-material-ui";
import { withStyles } from "@material-ui/core";
import { ProjectSelector } from "../../../Store/Project"
import { updateToBeEditedProject } from '../../../Store/Project/ActionCreator';
import { store } from "../../..";
import {setStatusBar} from "../../../Store/Site/ActionCreator";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { element } from 'prop-types';


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
    Annotation: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
class SetupProjectOutput extends React.Component {
    constructor(props) {

        super(props);
        let projectOutput = {
            point: false,
            box: false,
            circle: false,
            line: false,
            arrow: false,
            polygon: false,
            cuboid: false,
            freehand: false,
            paintBrush: false,
            segmentation: false,

            pointLabels: [],
            boxLabels: [],
            circleLabels: [],
            lineLabels: [],
            arrowLabels: [],
            polygonLabels: [],
            cuboidLabels: [],
            freehandLabels: [],
            paintBrushLabels: [],
            segmentationLabels: [],
        };
        let project = ProjectSelector.GetToBeEditedProject();

        if (project !== null && project.projectOutput !== undefined) {

            projectOutput.point = project.projectOutput.point ? true : false;
            projectOutput.box = project.projectOutput.box ? true : false;
            projectOutput.circle = project.projectOutput.circle ? true : false;
            projectOutput.line = project.projectOutput.line ? true : false;
            projectOutput.arrow = project.projectOutput.arrow ? true : false;
            projectOutput.polygon = project.projectOutput.polygon ? true : false;
            projectOutput.cuboid = project.projectOutput.cuboid ? true : false;
            projectOutput.freehand = project.projectOutput.freehand ? true : false;
            projectOutput.paintBrush = project.projectOutput.paintBrush ? true : false;
            projectOutput.segmentation = project.projectOutput.segmentation ? true : false;
            if (project.projectOutput.pointLabels) {
                projectOutput.pointLabels = project.projectOutput.pointLabels
            }
            if (project.projectOutput.boxLabels) {
                projectOutput.boxLabels = project.projectOutput.boxLabels
            }
            if (project.projectOutput.circleLabels) {
                projectOutput.circleLabels = project.projectOutput.circleLabels
            }
            if (project.projectOutput.lineLabels) {
                projectOutput.lineLabels = project.projectOutput.lineLabels
            }
            if (project.projectOutput.arrowLabels) {
                projectOutput.arrowLabels = project.projectOutput.arrowLabels
            }
            if (project.projectOutput.polygonLabels) {
                projectOutput.polygonLabels = project.projectOutput.polygonLabels
            }
            if (project.projectOutput.cuboidLabels) {
                projectOutput.cuboidLabels = project.projectOutput.cuboidLabels
            }
            if (project.projectOutput.freehandLabels) {
                projectOutput.freehandLabels = project.projectOutput.freehandLabels
            }
            if (project.projectOutput.paintBrushLabels) {
                projectOutput.paintBrushLabels = project.projectOutput.paintBrushLabels
            }
            if (project.projectOutput.segmentationLabels) {
                projectOutput.segmentationLabels = project.projectOutput.segmentationLabels
            }
        }

        this.state = {
            value: projectOutput
        }
    }

    handleSave = (fields) => {
        store.dispatch(setStatusBar(true, "Load", "Project Output Details Saving..."));
        const project = ProjectSelector.GetToBeEditedProject();

        const projectOutput = {
            point: false,
            box: false,
            circle: false,
            line: false,
            arrow: false,
            polygon: false,
            cuboid: false,
            freehand: false,
            paintBrush: false,
            segmentation: false,

            pointLabels: [],
            boxLabels: [],
            circleLabels: [],
            lineLabels: [],
            arrowLabels: [],
            polygonLabels: [],
            cuboidLabels: [],
            freehandLabels: [],
            paintBrushLabels: [],
            segmentationLabels: [],
        };
        if (fields.point) {
            projectOutput.point = true;
            projectOutput.pointLabels = fields.pointLabels.filter(element => element.name !== "");
        }

        if (fields.box) {
            projectOutput.box = true;
            projectOutput.boxLabels = fields.boxLabels.filter(element => element.name !== "");
        }

        if (fields.circle) {
            projectOutput.circle = true;
            projectOutput.circleLabels = fields.circleLabels.filter(element => element.name !== "");
        }

        if (fields.line) {
            projectOutput.line = true;
            projectOutput.lineLabels = fields.lineLabels.filter(element => element.name !== "");
        }

        if (fields.arrow) {
            projectOutput.arrow = true;
            projectOutput.arrowLabels = fields.arrowLabels.filter(element => element.name !== "")
        }

        if (fields.polygon) {
            projectOutput.polygon = true;
            projectOutput.polygonLabels = fields.polygonLabels.filter(element => element.name !== "");
        }
        if (fields.cuboid) {
            projectOutput.cuboid = true;
            projectOutput.cuboidLabels = fields.cuboidLabels.filter(element => element.name !== "");
        }
        if (fields.freehand) {
            projectOutput.freehand = true;
            projectOutput.freehandLabels = fields.freehandLabels.filter(element => element.name !== "");
        }
        if (fields.paintBrush) {
            projectOutput.paintBrush = true;
            projectOutput.paintBrushLabels = fields.paintBrushLabels.filter(element => element.name !== "");
        }
        if (fields.segmentation) {
            projectOutput.segmentation = true;
            projectOutput.segmentationLabels = fields.segmentationLabels.filter(element => element.name !== "");
        }

        let outputNotAvailable = true;
        if (projectOutput.pointLabels.length > 0 || projectOutput.boxLabels.length > 0 || projectOutput.lineLabels.length >0 || projectOutput.circleLabels.length > 0 || projectOutput.arrowLabels.length > 0 || projectOutput.polygonLabels.length > 0 || projectOutput.cuboidLabels.length > 0 || projectOutput.freehandLabels.length > 0 || projectOutput.paintBrushLabels.length > 0 || projectOutput.segmentationLabels.length > 0) {
            outputNotAvailable = false
        }
        if (outputNotAvailable) {
            store.dispatch(setStatusBar(true, "error", "Needs at least one output"));
            return
        }


        store.dispatch(updateToBeEditedProject({
            ...project,
            projectOutput: projectOutput
        }))
        store.dispatch(setStatusBar(true, "success", "Project Output Details Saved!"));
    }

    render() {
        const classes = this.props.classes;
        return (
            <div>
                <Formik
                    initialValues={this.state.value}
                    onSubmit={(values, {setSubmitting}) => {
                        setSubmitting(true);
                        this.handleSave(values);
                        setSubmitting(false)
                    }}

                    >
                    {({ errors, status, touched, handleSubmit, values, isSubmitting }) => (
                        <Form>
                            <Box>
                                <Typography variant="h6">Output: </Typography>
                            </Box>

                            <div>
                                <Typography variant="h7">Annotations</Typography>

                                <Box className={classes.FieldContainer}>
                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="point" label="Point" disabled={isSubmitting}
                                        />
                                        <Typography>Point</Typography>
                                    </Box>

                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="box" label="Box" disabled={isSubmitting}
                                        />
                                        <Typography>Box</Typography>
                                    </Box>
                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="circle" label="Circle" disabled={isSubmitting}
                                        />
                                        <Typography>Circle</Typography>
                                    </Box>

                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="line" label="Line" disabled={isSubmitting}
                                        />
                                        <Typography>Line</Typography>
                                    </Box>

                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="arrow" label="Arrow" disabled={isSubmitting}
                                        />
                                        <Typography>Arrow</Typography>
                                    </Box>

                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="polygon" label="Polygon" disabled={isSubmitting}
                                        />
                                        <Typography>Polygon</Typography>
                                    </Box>

                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="cuboid" label="Cuboid" disabled={isSubmitting}
                                        />
                                        <Typography>Cuboid</Typography>
                                    </Box>

                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="freehand" label="FreeHand" disabled={isSubmitting}
                                        />
                                        <Typography>FreeHand</Typography>
                                    </Box>
                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="paintBrush" label="PaintBrush" disabled={isSubmitting}
                                        />
                                        <Typography>PaintBrush</Typography>
                                    </Box>
                                    <Box className={classes.FieldContainer}>
                                        <Field type="checkbox" className={classes.FieldItems}
                                            style={{ width: "20px", height: "20px" }}
                                            name="segmentation" label="segmentation" disabled={isSubmitting}
                                        />
                                        <Typography>Segmentation</Typography>
                                    </Box>
                                </Box>
                            </div>
                            <Typography variant="h9">Annotation Labels</Typography>

                            { values.point && <FieldArray
                                name="pointLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Point Labels</Typography>
                                        {values.pointLabels.length > 0 &&
                                            values.pointLabels.map((point, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`pointLabels.${index}.name`}
                                                        placeholder={`Label ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Point Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }

                            { values.box && <FieldArray
                                name="boxLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Box Labels</Typography>
                                        {values.boxLabels.length > 0 &&
                                            values.boxLabels.map((box, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`boxLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        disabled={isSubmitting}
                                                        startIcon={<DeleteIcon />}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Box Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }

                            { values.circle && <FieldArray
                                name="circleLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Circle Labels</Typography>
                                        {values.circleLabels.length > 0 &&
                                            values.circleLabels.map((circle, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`circleLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Circle Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }

                            { values.line && <FieldArray
                                name="lineLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Line Labels</Typography>
                                        {values.lineLabels.length > 0 &&
                                            values.lineLabels.map((line, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`lineLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Line Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }

                            { values.arrow && <FieldArray
                                name="arrowLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Arrow Labels</Typography>
                                        {values.arrowLabels.length > 0 &&
                                            values.arrowLabels.map((arrow, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`arrowLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Arrow Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }

                            { values.polygon && <FieldArray
                                name="polygonLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Polygon Labels</Typography>
                                        {values.polygonLabels.length > 0 &&
                                            values.polygonLabels.map((polygon, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`polygonLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Polygon Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }
                            { values.cuboid && <FieldArray
                                name="cuboidLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Cuboid Labels</Typography>
                                        {values.cuboidLabels.length > 0 &&
                                            values.cuboidLabels.map((cuboid, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`cuboidLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Cuboid Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }

                            { values.freehand && <FieldArray
                                name="freehandLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">FreeHand Labels</Typography>
                                        {values.freehandLabels.length > 0 &&
                                            values.freehandLabels.map((freehand, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`freehandLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add FreeHand Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }
                            { values.paintBrush && <FieldArray
                                name="paintBrushLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Paint Brush Labels</Typography>
                                        {values.paintBrushLabels.length > 0 &&
                                            values.paintBrushLabels.map((paintBrush, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`paintBrushLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Paint Brush Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }

                            { values.segmentation && <FieldArray
                                name="segmentationLabels"
                                render={({ insert, remove, push }) => (
                                    <div>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                        <Typography variant="h6">Segmentation Labels</Typography>
                                        {values.segmentationLabels.length > 0 &&
                                            values.segmentationLabels.map((segmentation, index) => (
                                                <Box className={classes.FieldContainer}>
                                                    <Field
                                                        className={classes.FieldItems}
                                                        component={TextField}
                                                        name={`segmentationLabels.${index}.name`}
                                                        placeholder={`Label Name ${index}`}
                                                        type="text"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        startIcon={<DeleteIcon />}
                                                        disabled={isSubmitting}
                                                    />
                                                </Box>
                                            ))}
                                        <Box className={classes.FieldContainer}>
                                            <Typography variant="h6"> Add Segmentation Labels</Typography>
                                            <Button className="add-btn" onClick={() => push({ name: "" })} startIcon={<AddIcon />}
                                                disabled={isSubmitting}
                                            />
                                        </Box>
                                        <div style={{ "border-bottom": "1px solid black" }} />
                                    </div>
                                )}
                            />
                            }

                            <Box className={classes.FieldContainer}>
                                <Button variant="contained" type="submit"
                                    onSubmit={handleSubmit}
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

export default withStyles(styles)(SetupProjectOutput);