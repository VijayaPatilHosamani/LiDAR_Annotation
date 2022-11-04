/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableFooter, TablePagination, withStyles } from "@material-ui/core";
import { InputAdornment, Button, TextField, Paper, IconButton, Switch, FormControl, TableSortLabel, Toolbar } from "@material-ui/core";
import { Settings as SettingsIcon } from '@material-ui/icons'
import { orange } from "@material-ui/core/colors";

import { store } from "../..";
import API from "../../Api";
import { ProjectSelector } from '../../Store/Project';
import { setStatusBar, setSearchBarFn } from "../../Store/Site/ActionCreator";
import { UserType, UserSelector } from '../../Store/User';
import { updateCurrentProjectID, updateDashBoardResponse } from '../../Store/Project/ActionCreator';
import { StyledTableCell, StyledTableRow } from '../../components/StyledTable';

const styles = (theme) => ({

    flexContainer: {
        display: "flex",
        justifyContent: "space-between",
        margin: "20px",
        alignItems: "stretch",
    },
    clickableButton: {
        backgroundColor: orange[700],
        color: theme.palette.common.white,
        fontWeight: "bold"
    },
});

export class ReportView extends Component {
    constructor(props) {
        super(props)

        const username = this.props.cognitoUser.username
        const userObj = this.props.cognitoUser;
        const currentUser = UserSelector.getCurrentUser();
        if (currentUser === null) {
            store.dispatch(true, "Error", "User not found!");
            this.history.push("/");
        }

        this.state = {
            order: "asc",
            orderBy: "ProjectName",
            currentUser: currentUser,
            rowsPerPage: 25,
            page: 0,
            rows: [],
            filterFn: { fn: (items) => { return items } }
        }
    }

    componentDidMount() {
        const data = ProjectSelector.GetDashBoardResponse();
        if (data === null) {
            API.GetDashBoardData().then(response => {
                store.dispatch(updateDashBoardResponse(response));
                this.setState({
                    rows: response
                })
            }).catch((error) => {
                store.dispatch(setStatusBar(true, "Error", "Some Error in getting DashBoard Data, Try Again"));
                console.error(error);
            })
        } else {
            this.setState({
                rows: data
            })
        }
    }

    render() {
        const { filterFn, order, orderBy, rowsPerPage, page, rows } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

        rows.forEach((row) => {
            let totalCompleted = row.Completed + row.ReviewCompleted;
            if (totalCompleted>0){
                row.AvgTime = row.TotalTime / totalCompleted;
            }
            else{
                row.AvgTime = 0;
            }
        })
        const handleChangePage = (event, newPage) => {
            this.setState({
                page: newPage
            });
        };
        const handleChangeRowsPerPage = (event) => {
            let rowsPerPage = 5;
            if (event.target.value.label === "All") {
                rowsPerPage = event.target.value.value;
            }
            else {
                rowsPerPage = event.target.value;
            }
            this.setState({
                page: 0,
                rowsPerPage: parseInt(rowsPerPage, 10)
            });
        };
        const handleSortRequest = cellId => {
            const isAsc = orderBy === cellId && order === "asc";
            this.setState({
                order: isAsc ? 'desc' : 'asc',
                orderBy: cellId
            });
        }

        const handleSearchName = (event) => {
            let target = event.target;
            this.setState({
                filterFn: {
                    fn: (items) => {
                        if (target.value === "")
                            return items;
                        else
                            return items.filter(x => {
                                return (String(x.ProjectName).toLowerCase().includes(target.value.toLowerCase()));
                            }
                            )
                    }
                }
            })
        }

        store.dispatch(setSearchBarFn(handleSearchName));

        const headCells = [
            { id: 'ProjectName', numeric: false, disablePadding: false, sortable: true, label: 'Project Name' },
            { id: 'Available', numeric: true, disablePadding: true, sortable: true, label: 'Tasks Available' },
            { id: 'TotalTime', numeric: true, disablePadding: true, sortable: true, label: 'Total Time(Hrs)' },
            { id: 'AvgTime', numeric: true, disablePadding: true, sortable: true, label: 'Avg time (Sec)' },
        ];

        function stableSort(array, comparator) {
            const stabilizedThis = array.map((el, index) => [el, index]);
            stabilizedThis.sort((a, b) => {
                const order = comparator(a[0], b[0]);
                if (order !== 0) return order;
                return a[1] - b[1];
            });
            return stabilizedThis.map((el) => el[0]);
        }

        function getComparator(order, orderBy) {
            return order === 'desc'
                ? (a, b) => descendingComparator(a, b, orderBy)
                : (a, b) => -descendingComparator(a, b, orderBy);
        }

        function descendingComparator(a, b, orderBy) {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        }

        const recordsAfterPagingAndSorting = () => {
            // return stableSort(rows, getComparator(order, orderBy))
            let modifiedRows = rows;
            if (this.state.currentUser.Role !== UserType.PROJECTMANAGER) {
                modifiedRows = modifiedRows.filter(row => row.Status === "Active")
            }
            return stableSort(filterFn.fn(modifiedRows), getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        }
        const allRows = rows.length;

        const classes = this.props.classes;
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table stickyHeader={true} aria-label="simple table">
                        <TableHead>
                            <StyledTableRow>
                                {
                                    headCells.map(headCell => (
                                        <StyledTableCell sortDirection={orderBy === headCell.id ? order : false}
                                            align="center" key={headCell.id}>
                                            {headCell.sortable ? (
                                                <TableSortLabel
                                                    active={orderBy === headCell.id}
                                                    direction={orderBy === headCell.id ? order : 'asc'}
                                                    onClick={() => handleSortRequest(headCell.id)}>
                                                    {headCell.label}
                                                </TableSortLabel>) : (
                                                    <React.Fragment>
                                                        {headCell.label}
                                                    </React.Fragment>
                                                )}
                                        </StyledTableCell>))
                                }
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>

                            {recordsAfterPagingAndSorting().map((row) => (
                                <StyledTableRow key={row.ProjectId}>
                                    <StyledTableCell align="center" scope="row">
                                        {row.ProjectName}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.Available}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {(row.TotalTime / 3600).toFixed(2)}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.AvgTime.toFixed(2)}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {emptyRows > 0 && (
                                <StyledTableRow style={{ height: 0 * emptyRows }}>
                                    {/* <StyledTableRow style={{ height: 70 * emptyRows }}>
                                            <StyledTableCell align="center"/>
                                            <StyledTableCell align="center"/>
                                            <StyledTableCell align="center"/>
                                            <StyledTableCell align="center"/>
                                    */}
                                </StyledTableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <StyledTableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 100, { label: 'All', value: allRows === 0 ? 1 : allRows } ]}
                                    colSpan={headCells.count}
                                    count={allRows}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </StyledTableRow>
                        </TableFooter>
                    </Table>
                </TableContainer >
            </div >
        )
    }
}

export default withStyles(styles)(ReportView);
