/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import { lightBlue } from "@material-ui/core/colors";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: lightBlue[200],
        color: theme.palette.common.black,
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


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'agentName', numeric: false, disablePadding: false, label: 'AgentName', sortable: true },
    { id: 'total', numeric: true, disablePadding: false, label: 'Total', sortable: true },
    { id: 'hour1', numeric: true, disablePadding: true, label: '1', sortable: false },
    { id: 'hour2', numeric: true, disablePadding: true, label: '2', sortable: false },
    { id: 'hour3', numeric: true, disablePadding: true, label: '3', sortable: false },
    { id: 'hour4', numeric: true, disablePadding: true, label: '4', sortable: false },
    { id: 'hour5', numeric: true, disablePadding: true, label: '5', sortable: false },
    { id: 'hour6', numeric: true, disablePadding: true, label: '6', sortable: false },
    { id: 'hour7', numeric: true, disablePadding: true, label: '7', sortable: false },
    { id: 'hour8', numeric: true, disablePadding: true, label: '8', sortable: false },
    { id: 'hour9', numeric: true, disablePadding: true, label: '9', sortable: false },
    { id: 'hour10', numeric: true, disablePadding: true, label: '10', sortable: false },
    { id: 'hour11', numeric: true, disablePadding: true, label: '11', sortable: false },
    { id: 'hour12', numeric: true, disablePadding: true, label: '12', sortable: false },
    { id: 'hour13', numeric: true, disablePadding: true, label: '13', sortable: false },
    { id: 'hour14', numeric: true, disablePadding: true, label: '14', sortable: false },
    { id: 'hour15', numeric: true, disablePadding: true, label: '15', sortable: false },
    { id: 'hour16', numeric: true, disablePadding: true, label: '16', sortable: false },
    { id: 'hour17', numeric: true, disablePadding: true, label: '17', sortable: false },
    { id: 'hour18', numeric: true, disablePadding: true, label: '18', sortable: false },
    { id: 'hour19', numeric: true, disablePadding: true, label: '19', sortable: false },
    { id: 'hour20', numeric: true, disablePadding: true, label: '20', sortable: false },
    { id: 'hour21', numeric: true, disablePadding: true, label: '21', sortable: false },
    { id: 'hour22', numeric: true, disablePadding: true, label: '22', sortable: false },
    { id: 'hour23', numeric: true, disablePadding: true, label: '23', sortable: false },
    { id: 'hour24', numeric: true, disablePadding: true, label: '24', sortable: false },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead >
            <StyledTableRow>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sortable ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                                className={classes.sorted}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>)
                            :
                            (
                                <React.Fragment>
                                    {headCell.label}
                                </React.Fragment>
                            )
                        }
                    </StyledTableCell>
                ))
                }
            </StyledTableRow >
        </TableHead >
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        border: "1px solid",
        boxShadow: "1px 1px",
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    sorted: {
        color: theme.palette.common.white,

    },
}));

export default function TaskTimeline(props) {
    const classes = useStyles();
    const { name, rows } = props;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('agentName');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        let rowsPerPage = 5;
        if (event.target.value.label === "All") {
            rowsPerPage = event.target.value.value;
        }
        else {
            rowsPerPage = event.target.value;
        }
        setPage(0);
        setRowsPerPage(parseInt(rowsPerPage,10));
    };
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const allRows = rows.length;


    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='medium'
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <StyledTableRow
                                            hover
                                            key={row.agentName}
                                        >
                                            <StyledTableCell align="center" component="th" scope="row" padding="none">
                                                {row.agentName}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{row.total}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour1}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour2}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour3}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour4}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour5}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour6}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour7}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour8}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour9}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour10}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour11}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour12}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour13}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour14}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour15}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour16}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour17}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour18}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour19}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour20}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour21}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour22}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour23}</StyledTableCell>
                                            <StyledTableCell align="center">{row.hour24}</StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: allRows === 0 ? 1 : allRows }]}
                    component="div"
                    count={allRows}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
