/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import React,{ useState } from 'react'
import { Button, IconButton } from '@material-ui/core'
import { TableHead, TableRow, TableCell, TableSortLabel, TableFooter, Table, TablePagination, TableBody, } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import { StyledTableCell, StyledTableRow } from '../../../../components/StyledTable';

const headers = [
    { id: 'TaskId', name: 'Task ID', sortable: true },
    { id: 'BatchId', name: 'Batch ID', sortable: true },
    { id: 'status', name: 'State', sortable: true },
    { id: 'checkbox', name: 'Select ALL', sortable: false }
]

function TableHeader(props) {
    const { order, orderBy, setOrder, setOrderBy, rows, taskSelection } = props;

    const handleSortRequest = cellId => {
        const isAsc = orderBy === cellId && order === "asc";
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(cellId);
    }
    let selectedALL = !(rows.filter(row => !row.selected).length > 0);
    return (
        <TableHead>
            <StyledTableRow>
                {headers.map((item) => {
                    return <StyledTableCell key={item.id} align="center" sortDirection={orderBy === item.id ? order : false
                    }>
                        {
                        item.sortable ? (
                            <TableSortLabel
                                active={orderBy === item.id}
                                direction={orderBy === item.id ? order : 'asc'}
                                onClick={() => handleSortRequest(item.id)}> {item.name}
                            </TableSortLabel>
                            ) : item.id === 'checkbox' ? <React.Fragment><input type="checkbox" checked={ selectedALL } onClick={() => rows.forEach(row => {
                            if (selectedALL && row.selected){
                                taskSelection(row.TaskId)
                            }
                            if (!selectedALL && !row.selected){
                                taskSelection(row.TaskId)
                            }
                            })} /> {item.name}</React.Fragment>: <React.Fragment> { item.name }</React.Fragment>
                        }
                    </StyledTableCell>
                })}
            </StyledTableRow >
        </TableHead >
    )
}

function ViewTableHandler(props)  {
    let rows = [];

    if (props.tasks !== undefined) {
        rows = props.tasks;
    }
    let taskSelection = props.taskSelection;
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [page, setPage] = useState(0)
    const [order, setOrder] = useState('')
    const [orderBy, setOrderBy] = useState('asc')

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
        setRowsPerPage(parseInt(rowsPerPage, 10));
    }

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const getComparator=(order, orderBy)=> {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const descendingComparator=(a, b, orderBy)=> {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const recordsAfterPagingAndSorting = () => {
        return stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }

    if (rowsPerPage !== 5 && rowsPerPage !== 10 && rowsPerPage !== 25 && rowsPerPage !== 100 && rowsPerPage !== rows.length){
        setRowsPerPage(rows.length)
    }

    const allRows = rows.length;


    return (
        <div>
            <Table>
                <TableHeader order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} rows={rows} taskSelection={taskSelection} />
                <TableBody>
                    {recordsAfterPagingAndSorting().map((row) => {
                        return (
                            <StyledTableRow key={row.TaskId}>
                                <StyledTableCell align="center">{row.TaskId}</StyledTableCell>
                                <StyledTableCell align="center">{row.BatchId}</StyledTableCell>
                                <StyledTableCell align="center">{row.status}</StyledTableCell>
                                <StyledTableCell align="center"><input type="checkbox" checked={row.selected? true: false} onClick={() => taskSelection(row.TaskId)} /></StyledTableCell>
                            </StyledTableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <StyledTableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100, { label: 'All', value: allRows === 0 ? 1 : allRows} ]}
                            colSpan={headers.length}
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
        </div>
    )

}

export default ViewTableHandler;