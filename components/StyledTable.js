import { TableRow, TableCell, withStyles } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
import { deepOrange } from "@material-ui/core/colors";
// import { brown } from "@material-ui/core/colors";


export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: lightBlue[200],
        color: theme.palette.common.lightblue,
        fontWeight: "bold"
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
    head: {
        // backgroundColor: deepOrange[400],
        color: theme.palette.common.black,
    },
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: deepOrange[50],
                },
        '&:nth-of-type(even)': {
            backgroundColor: deepOrange[200],
                },
            },
}))(TableRow);
