/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
import { Button, IconButton } from '@material-ui/core'
import { TableHead, TableRow, TableCell, TableSortLabel, TableFooter, Table, TablePagination, TableBody, } from '@material-ui/core'
import React, { useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { StyledTableCell, StyledTableRow } from "../../../../components/StyledTable";

const headers = [
    { id: 'SampleId', name: 'Sample ID', sortable: true },
    { id: 'created', name: 'Creation Date', sortable: true },
    { id: 'size', name: 'Size', sortable: true },
    { id: 'quality', name: 'Quality', sortable: true },
    { id: 'export', name: 'Export', sortable: false },
    { id: 'delete', name: 'Delete', sortable: false },
    { id: 'status', name: 'Status', sortable: true }
]

function TableHeader(props) {
    const { order, orderBy, setOrder, setOrderBy } = props;
    const handleSortRequest = cellId => {
        const isAsc = orderBy === cellId && order === "asc";
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(cellId);
    }
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
                            ) : (
                                    <React.Fragment>
                                        {item.name}
                                    </React.Fragment>
                                )}
                    </StyledTableCell>
                })}
            </StyledTableRow >
        </TableHead >
    )

}



export function SampleTableHandler(props) {
    //get samples for project

    let rows =[];
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('');
    const [orderBy, setOrderBy] = useState('asc');

    if(props.data !== undefined){
        rows = props.data;
    }

    const handleSelectingSample = props.handleSelectingSample;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        let rowsPerPage = 0;
        if (event.target.value.label === "All") {
            rowsPerPage = event.target.value.value;
        }
        else {
            rowsPerPage = event.target.value;
        }
        setPage(0);
        setRowsPerPage(parseInt(rowsPerPage, 10));
    };

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
        let data = stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        return data;
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const allRows = rows.length;

    return (
            <Table>
                <TableHeader order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} />
                <TableBody>
                    {recordsAfterPagingAndSorting().map((row) => {
                        return (<StyledTableRow key={row.id}>
                            <StyledTableCell align="center"><Button onClick={() => handleSelectingSample(row.taskIds)} >{row.SampleId}</Button></StyledTableCell>
                            <StyledTableCell align="center">{row.created}</StyledTableCell>
                            <StyledTableCell align="center">{row.size}</StyledTableCell>
                            <StyledTableCell align="center">{row.quality}</StyledTableCell>
                            <StyledTableCell align="center"><Button variant="contained" onClick={()=>props.handleExport(row.taskIds)}>Download</Button></StyledTableCell>
                            <StyledTableCell align="center"><IconButton><DeleteIcon onClick={() => props.handleSampleDelete(row.SampleId)}/></IconButton></StyledTableCell>
                            <StyledTableCell align="center">{row.status}</StyledTableCell>
                        </StyledTableRow>)
                    })}
                </TableBody>
                <TableFooter>
                    <StyledTableRow>
                        <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: allRows===0?1 : allRows }]}
                            colSpan={7}
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
    )
}

export default SampleTableHandler