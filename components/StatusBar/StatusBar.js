import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

import { setStatusBar } from "../../Store/Site/ActionCreator";
import { store } from "../..";

import { useSelector } from "react-redux";


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
        zIndex: "1300",
    },
}));

const StatusBar = () => {
    const classes = useStyles();
    const statusBarState = useSelector(state => state.Site.statusBar)

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        store.dispatch(setStatusBar(false, statusBarState.Type, statusBarState.Message));
    };

    return (
        <div className={classes.root}>
            <Snackbar
                open={statusBarState.Open}
                autoHideDuration={statusBarState.Type === "Load" ? null : 6000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleClose}
                    severity={statusBarState.Type === "Load" ? "Info" : statusBarState.Type}
                >
                    {statusBarState.Type === "Load" ? <><CircularProgress style={{ width: "1.2em", height: "1.2em" }} /> <span>{statusBarState.Message}</span></> : statusBarState.Message}
                </MuiAlert>
            </Snackbar >
        </div >
    )
}


export default StatusBar;