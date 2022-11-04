/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, withStyles } from "@material-ui/core";
import { FormControlLabel, Switch, FormControl, TableSortLabel, Toolbar, Paper, Button } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { orange } from "@material-ui/core/colors";

import { store } from "../..";
import { updateCurrentProjectID, updateCurrentProject, updateDashBoardResponse } from '../../Store/Project/ActionCreator';
import API from "../../Api";
import { ProjectSelector } from '../../Store/Project';
import { UserType, UserSelector } from '../../Store/User';

import { setStatusBar, setSearchBarFn } from "../../Store/Site/ActionCreator";
import { StyledTableCell, StyledTableRow } from '../../components/StyledTable';

const styles = (theme) => ({

  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px",
    alignItems: "stretch",
  },
});

export class DashBoard extends Component {
  constructor(props) {
    super(props)

    const username = this.props.cognitoUser.username
    const userObj = this.props.cognitoUser;
    const currentUser = UserSelector.getCurrentUser();
    if (currentUser === null) {
      store.dispatch(true, "Error", "User not found!");
      this.history.push("/Logout");
    }

    let headcells = [
      { id: 'ProjectName', numeric: false, disablePadding: false, sortable: true, label: 'ProjectName' },
      { id: 'Available', numeric: true, disablePadding: true, sortable: true, label: 'Available' },
      { id: 'ReviewCompleted', numeric: true, disablePadding: true, sortable: true, label: 'Completed' },
      { id: 'Status', numeric: false, disablePadding: false, sortable: true, label: 'Status' },
      { id: 'Type', numeric: false, disablePadding: true, sortable: true, label: 'Type' },
      { id: 'Code', numeric: false, disablePadding: true, sortable: true, label: 'Project Code' },
    ];
    this.state = {
      order: "asc",
      currentUser: currentUser,
      orderBy: "ProjectName",
      rowsPerPage: 25,
      page: 0,
      rows: [],
      filterFn: { fn: (items) => { return items } },
      cells: headcells,
    }

  }

  componentDidMount() {
    //Add URL to get data here
    const data = ProjectSelector.GetDashBoardResponse();
    if (data === null) {
      API.GetDashBoardData().then(response => {
        store.dispatch(updateDashBoardResponse(response));
        this.setState({
          rows: response,
        })
      })
      .catch((error) => {
          store.dispatch(setStatusBar(true, "Error", "Some Error in getting DashBoard data, Try Again."));
          console.error(error);
        })
    } else {
      this.setState({
        rows: data,
      })
    }
  }

  handleOverViewBtn = (ProjectId) => {
    store.dispatch(updateCurrentProjectID(ProjectId));
    let data = [...this.state.rows];
    data.forEach(item => {
      if (item.ProjectId === ProjectId) {
        store.dispatch(updateCurrentProject(item));
      }
    });
    this.props.history.push("/project/overview");
  }

  render() {
    const { filterFn, order, orderBy, rowsPerPage, page, rows } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
      this.setState({
        page: newPage
      });
    };
    const handleChangeRowsPerPage = (event) => {
      let rowsPerPage = 5;
      if (event.target.value.label === "All"){
        rowsPerPage = event.target.value.value;
      }
      else{
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
              })
          }
        }
      })
    }

    store.dispatch(setSearchBarFn(handleSearchName));


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
      let modifiedRows = rows;
      if (this.state.currentUser.Role !== UserType.PROJECTMANAGER) {
        modifiedRows = modifiedRows.filter(row => row.Status === "Active")
      }
      // return stableSort(rows, getComparator(order, orderBy))
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
                {this.state.cells.length > 0 &&
                  this.state.cells.map(cell => (
                    <StyledTableCell sortDirection={orderBy === cell.id ? order : false}
                      align="center" key={cell.id}>
                      {cell.sortable ? (
                        <TableSortLabel
                          active={orderBy === cell.id}
                          direction={orderBy === cell.id ? order : 'asc'}
                          onClick={() => handleSortRequest(cell.id)}>
                          {cell.label}
                        </TableSortLabel>) : (
                          <React.Fragment>
                            {cell.label}
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
                    <Button onClick={() => this.handleOverViewBtn(row.ProjectId)}>{row.ProjectName}</Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.Available}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.ReviewCompleted}</StyledTableCell>
                  <StyledTableCell align="center">{row.Status}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.Type}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.Code}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 70 * emptyRows }}>
                  {/* <StyledTableCell align="center" />
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" /> */}

                </StyledTableRow>
              )}
            </TableBody>
            <TableFooter>
              <StyledTableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100, { label: 'All', value: allRows === 0 ? 1 : allRows }]}
                  colSpan={this.state.cells.count}
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

export default withStyles(styles)(DashBoard);
