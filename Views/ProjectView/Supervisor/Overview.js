/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { Typography } from "@material-ui/core";

import ProjectViewHeader from '../ProjectViewHeader';
import SupervisorHeader from '.';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import { orange } from "@material-ui/core/colors";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ProjectSelector } from "../../../Store/Project";
import { setStatusBar } from "../../../Store/Site/ActionCreator";
import { updateTaskType } from "../../../Store/Project/ActionCreator";
import { StyledTableCell, StyledTableRow } from "../../../components/StyledTable";


import { store } from "../../..";

class SupervisorOverview extends Component {
    constructor(props) {
        super(props);
        store.dispatch(updateTaskType(null))
        this.state = {
            currentProject: null,
            Production: {
                agents: 0,
                completed: 0,
                available: 0
            },
            Review: {
                agents: 0,
                completed: 0,
                available: 0
            }
        }
    }

    componentDidMount() {
        let currentProject = ProjectSelector.GetCurrentProject();
        if (currentProject === null) {
            console.error("The Project Id Miss-Match")
            store.dispatch(setStatusBar(true, "error", "The Project Id Miss-Match"))
            this.props.history.push("/projects");
        }
        else{
            this.setState({
                currentProject: currentProject,
                Production: {
                    agents: currentProject.AgentCount,
                    completed: currentProject.Completed,
                    available: (currentProject.Total - currentProject.Completed)
                },
                Review: {
                    agents: currentProject.ReviewerCount,
                    completed: currentProject.ReviewCompleted ,
                    available: (currentProject.Total - currentProject.ReviewCompleted)
                }
            })
        }
    }

    render() {
        return (
            <div className="animated fadeIn" >
                <ProjectViewHeader />
                <SupervisorHeader />
                <div >
                    <Typography variant="h4" > Supervisor Overview</Typography>
                    <div>
                        <TableContainer component={Paper}>
                            <Table ria-label="customized table">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Step</StyledTableCell>
                                        <StyledTableCell align="center">No Of agents</StyledTableCell>
                                        <StyledTableCell align="center">Tasks Completed</StyledTableCell>
                                        <StyledTableCell align="center">Tasks Available</StyledTableCell>

                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    <StyledTableRow>
                                        <StyledTableCell>Production</StyledTableCell>
                                        <StyledTableCell align="center">{this.state.Production.agents}</StyledTableCell>
                                        <StyledTableCell align="center">{this.state.Production.completed}</StyledTableCell>
                                        <StyledTableCell align="center">{this.state.Production.available}</StyledTableCell>
                                    </StyledTableRow>

                                    <StyledTableRow>
                                        <StyledTableCell>Review</StyledTableCell>
                                        <StyledTableCell align="center">{this.state.Review.agents}</StyledTableCell>
                                        <StyledTableCell align="center">{this.state.Review.completed}</StyledTableCell>
                                        <StyledTableCell align="center">{this.state.Review.available}</StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </div>
                </div>

            </div>
        );
    }
}

export default SupervisorOverview;