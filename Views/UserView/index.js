import React, { Component } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableFooter, TablePagination, withStyles } from "@material-ui/core";
import { InputAdornment, Button, TextField, Paper, FormControlLabel, Switch, TableSortLabel } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { orange } from "@material-ui/core/colors";


import API from "../../Api"
import { updateEditableUserId } from "../../Store/User/ActionCreator";
import { store } from "../..";
import { setStatusBar, setSearchBarFn } from "../../Store/Site/ActionCreator";
import { updateAllUsers } from "../../Store/User/ActionCreator";
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

export class UserView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            order: "asc",
            orderBy: "name",
            activeUsersChecked: false,
            rowsPerPage: 25,
            page: 0,
            rows: [],
            filterFn: { fn: (items) => { return items } }
        }
    }

    handleSettingsClick = (UserId) => {
        store.dispatch(updateEditableUserId(UserId));
        //set Current user to edit
        this.props.history.push("/user/settings");
    }
    handleManageClick = (UserId) => {
        store.dispatch(updateEditableUserId(UserId));
        //set Current user to edit
        this.props.history.push("/user/manage");
    }
    handleCreateUser = () => {
        store.dispatch(updateEditableUserId(null));
        this.props.history.push("/user/create");
    }

    GetAllUsersData = ()=>{
        store.dispatch(setStatusBar(true, "Load", "Loading..."));
        API.GetAllUsers().then(response => {
            store.dispatch(updateAllUsers(response.data))
            response.data.forEach(row => {
                row.name = (row.FirstName ? row.FirstName : "") + (row.MiddleName ? row.MiddleName : "") + (row.LastName ? row.LastName : "");
                row.Status = (row.isActive ? true : false)
            })
            this.setState({
                rows: response.data
            });
            store.dispatch(setStatusBar(true, "success", "User Data Loaded."));
        }).catch((error) => {
            store.dispatch(setStatusBar(true, "Error", "Error in Server Cannot get all users details, try again"));
            console.error(error);
        })
    }

    componentDidMount() {
        this.GetAllUsersData();
    }

    render() {
        const { filterFn, order, orderBy, rowsPerPage, page, rows, activeUsersChecked } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
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
        const toggleChecked = () => {
            this.setState({
                activeUsersChecked: !activeUsersChecked
            });
        };

        const handleSearchName = (event) => {
            let target = event.target;
            this.setState({
                filterFn: {
                    fn: (items) => {
                        if (target.value === "")
                            return items;
                        else
                            return items.filter(x => {
                                return (String(x.FirstName).toLowerCase().includes(target.value.toLowerCase()) || String(x.LastName).toLowerCase().includes(target.value.toLowerCase()));
                            }
                            )
                    }
                }
            })
        }
        store.dispatch(setSearchBarFn(handleSearchName));

        const headCells = [
            { id: 'name', numeric: false, disablePadding: true, sortable: true, label: 'Name' },
            { id: 'settings', numeric: false, disablePadding: false, sortable: false, label: 'Settings' },
            { id: 'twoFactorAuthentication', numeric: false, disablePadding: true, sortable: true, label: 'Two Factor Auth' },
            { id: 'isActive', numeric: false, disablePadding: false, sortable: true, label: 'Status' },
            { id: 'manage', numeric: false, disablePadding: false, sortable: false, label: 'Activate/Deactivate' },
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
            return stableSort(filterFn.fn(activeSwitchFilter()), getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        }

        const activeSwitchFilter = () => {
            let activeData = rows
            if (activeUsersChecked) {
                activeData = rows.filter((item) => {
                    return item.isActive;
                })
            }
            return activeData;
        }

        const classes = this.props.classes;
        const allRows = rows.length;

        return (
            <div>
                <div className={classes.flexContainer}>
                    <span>
                        <TextField InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>),
                        }}
                            label="Search Names" className={classes.searcbar} fullwidth="true" name="searchBar" variant="outlined" onChange={handleSearchName} />
                    </span>
                    <span>
                        <FormControlLabel className={classes.activeSwitch} large control={<Switch checked={activeUsersChecked} onChange={toggleChecked} />} label="Active" />
                        <Button className={classes.clickableButton} onClick={this.handleCreateUser}> Create User </Button>
                    </span>
                </div>
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
                                row.UserId &&
                                (<StyledTableRow key={row.UserId}>
                                    <StyledTableCell align="center" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button className={classes.clickableButton} onClick={() => this.handleSettingsClick(row.UserId)}>
                                            Settings</Button>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                            <p style={{ color: row.twoFactorAuthentication ==="Enable" ? "green" : "red", fontWeight: "bold" }}>{row.twoFactorAuthentication==="Enable" ? "Enabled" : "Disabled"}</p>
                                    </StyledTableCell>
                                    <StyledTableCell align="center"><p style={{ color: row.isActive ? "green" : "red", fontWeight: "bold" }}>{row.isActive ? "Active" : "inActive"}</p></StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button className={classes.clickableButton} onClick={() => this.handleManageClick(row.UserId)}>Manage</Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                                )))}
                            {emptyRows > 0 && (
                                <StyledTableRow style={{ height: 70 * emptyRows }}>
                                    <StyledTableCell align="center" />
                                    <StyledTableCell align="center" />
                                    <StyledTableCell align="center" />
                                    <StyledTableCell align="center" />
                                    <StyledTableCell align="center" />
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

export default withStyles(styles)(UserView);
