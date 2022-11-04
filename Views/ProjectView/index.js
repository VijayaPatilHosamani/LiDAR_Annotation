import React, { Component } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableFooter, TablePagination, withStyles } from "@material-ui/core";
import { Button, Paper, IconButton, Switch, TableSortLabel } from "@material-ui/core";
import { Settings as SettingsIcon } from '@material-ui/icons'
import { orange } from "@material-ui/core/colors";

import { store } from "../..";
import API from "../../Api";
import { ProjectSelector } from '../../Store/Project';
import { setSearchBarFn, setStatusBar } from "../../Store/Site/ActionCreator";
import { updateCurrentProjectID, updateCurrentProject, updateDashBoardResponse } from '../../Store/Project/ActionCreator';
import { UserType, UserSelector } from '../../Store/User';
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


export class ProjectView extends Component {
  constructor(props) {
    super(props)

    const currentUser = UserSelector.getCurrentUser();
    let cols = [];
    if (currentUser.Role === UserType.PROJECTMANAGER || currentUser.Role === UserType.SUPERVISOR) {
      cols = [
        { id: 'ProjectName', numeric: true, disablePadding: true, sortable: true, label: 'Project Name' },
        { id: 'Status', numeric: true, disablePadding: true, sortable: true, label: 'Status' },
        { id: 'Type', numeric: false, disablePadding: true, sortable: true, label: 'Type' },
        { id: 'Overview', numeric: false, disablePadding: false, sortable: false, label: 'Overview' },
        { id: 'Tasks', numeric: false, disablePadding: false, sortable: false, label: 'Tasks' },
        { id: 'Sampling', numeric: false, disablePadding: false, sortable: false, label: 'Sampling' },
        { id: 'View', numeric: false, disablePadding: false, sortable: false, label: 'View' },
        { id: 'Pause', numeric: false, disablePadding: true, sortable: false, label: 'Pause' },
        { id: 'Code', numeric: false, disablePadding: true, sortable: true, label: 'Project Code' },
        { id: 'Settings', numeric: false, disablePadding: false, sortable: false, label: 'Settings' },
      ];
    }
    if (currentUser.Role === UserType.AGENT || currentUser.Role === UserType.REVIEWER) {
      cols = [
        { id: 'ProjectName', numeric: true, disablePadding: true, sortable: true, label: 'Project Name' },
        { id: 'Status', numeric: true, disablePadding: true, sortable: true, label: 'Status' },
        { id: 'Type', numeric: false, disablePadding: true, sortable: true, label: 'Type' },
        { id: 'Overview', numeric: false, disablePadding: false, sortable: false, label: 'Overview' },
        { id: 'Code', numeric: false, disablePadding: true, sortable: true, label: 'Project Code' },
      ];
    }


    this.state = {
      currentUser: currentUser,
      order: "asc",
      orderBy: "ProjectName",
      rowsPerPage: 25,
      page: 0,
      rows: [],
      filterFn: { fn: (items) => { return items } },
      cols: cols
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
        store.dispatch(setStatusBar(true, "Error", "Sever Error in getting DashBoard Details, Try again!"));
        console.error(error.message);
      })
    } else {
      this.setState({
        rows: data
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
  handleTasksBtn = (ProjectId) => {
    store.dispatch(updateCurrentProjectID(ProjectId));
    let data = [...this.state.rows];
    data.forEach(item => {
      if (item.ProjectId === ProjectId) {
        store.dispatch(updateCurrentProject(item));
      }
    });
    this.props.history.push("/project/supervisor/tasks");
  }
  handleSamplingBtn = (ProjectId) => {
    store.dispatch(updateCurrentProjectID(ProjectId));
    let data = [...this.state.rows];
    data.forEach(item => {
      if (item.ProjectId === ProjectId) {
        store.dispatch(updateCurrentProject(item));
      }
    });
    this.props.history.push("/project/supervisor/sample");
  }
  handleViewBtn = (ProjectId) => {
    store.dispatch(updateCurrentProjectID(ProjectId));
    let data = [...this.state.rows];
    data.forEach(item => {
      if (item.ProjectId === ProjectId) {
        store.dispatch(updateCurrentProject(item));
      }
    });
    this.props.history.push("/project/supervisor/view");
  }

  handleSettingsBtn = (ProjectId) => {
    store.dispatch(updateCurrentProjectID(ProjectId));
    let data = [...this.state.rows];
    data.forEach(item => {
      if (item.ProjectId === ProjectId) {
        store.dispatch(updateCurrentProject(item));
      }
    });
    this.props.history.push("/project/settings");
  }

  handlePauseSwth = (event, row) => {
    if (window.confirm(`Do you really want to Change the Project Status of ${row.ProjectName}?`)) {
      let data = [...this.state.rows];
      data.forEach(item => {
        if (item.ProjectId === row.ProjectId) {
          store.dispatch(updateCurrentProject(item));
          if (item.Status !== "Active") {
            item.Status = "Active";
          }
          else {
            item.Status = "Paused";
          }
        }
      })
      API.GetProject(row.ProjectId)
        .then((data) => {
          if (data.status !== "Active") {
            data.status = "Active";
          }
          else {
            data.status = "Paused";
          }
          data.ProjectID = data.ProjectId;
          return API.EditProject(data)
        }).then(() => {
              store.dispatch(setStatusBar(true, "success", "Project Status Modified SuccessFully"))
        })
        .catch(error => {
          store.dispatch(setStatusBar(true, "error", "Server error in getting or updating project, Try Again!"))
          console.error(error);
        })

      this.setState({
        rows: data
      })
    }
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

    const classes = this.props.classes;
    return (
      <div>
        <TableContainer component={Paper}>
          <Table stickyHeader={true} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                {
                  this.state.cols.map(col => (
                    <StyledTableCell sortDirection={orderBy === col.id ? order : false}
                      align="center" key={col.id}>
                      {col.sortable ? (
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : 'asc'}
                          onClick={() => handleSortRequest(col.id)}>
                          {col.label}
                        </TableSortLabel>) : (
                          <React.Fragment>
                            {col.label}
                          </React.Fragment>
                        )}
                    </StyledTableCell>))
                }
              </StyledTableRow>
            </TableHead>
            <TableBody>

              {recordsAfterPagingAndSorting().map((row) => (

                < StyledTableRow key={row.ProjectId} >
                  <StyledTableCell align="center" scope="row">
                    <Button onClick={() => this.handleOverViewBtn(row.ProjectId)}>{row.ProjectName}</Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button variant='outlined' style={{ fontWeight: "bold", color: (row.Status === "Active" ? "green" : row.Status === "Paused" ? "blue" : "red") }}>{(row.Status === "Active" ? "Active" : row.Status === "Paused" ? "Paused" : "InActive")}</Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.Type}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Button variant='outlined' className={classes.clickableButton} onClick={() => this.handleOverViewBtn(row.ProjectId)}>Overview</Button>
                  </StyledTableCell>
                  {(this.state.currentUser.Role === UserType.PROJECTMANAGER || this.state.currentUser.Role === UserType.SUPERVISOR) &&
                    (<>
                      <StyledTableCell align="center">
                        <Button variant='outlined' className={classes.clickableButton} onClick={() => this.handleTasksBtn(row.ProjectId)}>Tasks</Button>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button variant='outlined' className={classes.clickableButton} onClick={() => this.handleSamplingBtn(row.ProjectId)}>Sampling</Button>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button variant='outlined' className={classes.clickableButton} onClick={() => this.handleViewBtn(row.ProjectId)}>View</Button>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Switch checked={row.Status !== "Active"} onChange={(event) => this.handlePauseSwth(event, row)} ></Switch>
                      </StyledTableCell>
                    </>)
                  }
                  <StyledTableCell align="center">
                    {row.Code}
                  </StyledTableCell>
                  {(this.state.currentUser.Role === UserType.PROJECTMANAGER || this.state.currentUser.Role === UserType.SUPERVISOR) &&
                    (
                      <StyledTableCell align="center">
                        <IconButton onClick={() => this.handleSettingsBtn(row.ProjectId)}><SettingsIcon /></IconButton>
                      </StyledTableCell>
                    )
                  }
                </StyledTableRow>
              ))}
              {
                emptyRows > 0 && (
                  <StyledTableRow style={{ height: 0 * emptyRows }}>
                    {/* <StyledTableRow style={{ height: 70 * emptyRows }}>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                      <StyledTableCell align="center"/>
                  */}
                  </StyledTableRow>
                )
              }
            </TableBody >
            <TableFooter>
              <StyledTableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100, { label: 'All', value: rows.length }]}
                  colSpan={this.state.cols.count}
                  count={rows.length}
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
          </Table >
        </TableContainer >
      </div >
    )
  }
}

export default withStyles(styles)(ProjectView);
