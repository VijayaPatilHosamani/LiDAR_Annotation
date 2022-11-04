/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, withStyles } from "@material-ui/core";
import { InputAdornment, Button, Box, TextField, Paper, IconButton, Switch, FormControl, TableSortLabel, Toolbar } from "@material-ui/core";
import { Settings as SettingsIcon } from '@material-ui/icons'
import { orange } from "@material-ui/core/colors";

import { store } from "../../..";
import API from "../../../Api";
import { ProjectSelector } from '../../../Store/Project';
import { setStatusBar, setSearchBarFn } from "../../../Store/Site/ActionCreator";
import { updateCurrentProjectID, updateDashBoardResponse } from '../../../Store/Project/ActionCreator';
import UploaderImage from "./UploaderImage";
import UploaderVideo from "./UploaderVideo";
import { UserSelector } from '../../../Store/User';

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

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#7474f1",
    color: theme.palette.common.white,
    fontWeight: "bold"
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


const StyledTableRow = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


export class SeedUpload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      order: "asc",
      orderBy: "batchId",
      uploadBox: false,
      rowsPerPage: 5,
      page: 0,
      rows: [],
      filterFn: { fn: (items) => { return items } }
    }

    this.loadBatchData = this.loadBatchData.bind(this);
    }


  loadBatchData() {
    store.dispatch(setStatusBar(true, "Load", "Batch Data Loading..."))
    const projectID = ProjectSelector.GetCurrentProjectId();
    const project = ProjectSelector.GetToBeEditedProject();
    if (projectID === null || projectID === undefined || projectID === "" || project === undefined || project === null) {
      store.dispatch(setStatusBar(true, "error", "No Project Selected"));
      if (this.history) {
        this.history.push("/projects");
      }
    }
    else {
      API.GetBatchDetails(this.props.projectID)
        .then(data => {
          if (data && data.length > 0) {
            let rows = []
            data.forEach(element => {
              rows.push({
                batchId: element.BatchId,
                tasksUploaded: element.Data.Tasks,
                uploadedBy: element.Data.UpLoadedBy,
                date: new Date(element.TimeUploaded).toDateString(),
                time: new Date(element.TimeUploaded).toTimeString(),
              })
            });
            this.setState({
              ...this.state,
              rows: rows,
            })
            store.dispatch(setStatusBar(true, "success", "Batch Data Loaded successfully."))
          }
          else {
            store.dispatch(setStatusBar(true, "info", "No Data to Load!"))
          }
        }).catch(error => {
          store.dispatch(setStatusBar(true, "error", "Server error in Getting Batch Details, Try Again!"))
          console.error(error);
        })
    }
  }

  componentDidMount() {
    this.loadBatchData();
  }

  render() {
    const { filterFn, order, orderBy, rowsPerPage, page, rows } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const currentUser = UserSelector.getCurrentUser();
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
      }      this.setState({
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
                return (String(x.batchId).toLowerCase().includes(target.value.toLowerCase()));
              }
              )
          }
        }
      })
    }

    store.dispatch(setSearchBarFn(handleSearchName));

    const headCells = [
      { id: 'batchId', numeric: true, disablePadding: false, sortable: true, label: 'Batch ID' },
      { id: 'tasksUploaded', numeric: true, disablePadding: true, sortable: true, label: 'Task Uploaded ' },
      { id: 'uploadedBy', numeric: true, disablePadding: true, sortable: true, label: 'Uploaded By' },
      { id: 'date', numeric: true, disablePadding: true, sortable: true, label: 'Date' },
      { id: 'time', numeric: true, disablePadding: true, sortable: true, label: 'Time' },
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
      return stableSort(filterFn.fn(rows), getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }

    const classes = this.props.classes;
    return (
      <div>
        <Box style={{
          margin: "1em",
          padding: "1em",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <UploaderImage username={currentUser.FirstName + " " + currentUser.LastName} loadBatchData={this.loadBatchData} />
        </Box>
        <Box style={{
          margin: "1em",
          padding: "1em",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <UploaderVideo username={currentUser.FirstName + " " + currentUser.LastName} loadBatchData={this.loadBatchData} />
        </Box>
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
                    {row.batchId}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.tasksUploaded}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.uploadedBy}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.date}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.time}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
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
                  rowsPerPageOptions={[5, 10, { label: 'All', value: rows.length }]}
                  colSpan={headCells.count}
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
          </Table>
        </TableContainer >
      </div >
    )
  }
}

export default withStyles(styles)(SeedUpload);
