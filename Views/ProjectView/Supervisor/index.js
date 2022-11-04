/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
    AppBar,
    Toolbar,
    Button,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        background: theme.palette.primary,
        color: theme.palette.common.white,
        fontWeight: "bold",

        padding: theme.spacing(2),
        marginRight: theme.spacing(3),
    },
    ActiveMenuButton: {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

const SupervisorHeader = (props) => {
    const classes = useStyles();
    const handleRedirect = (link) => {
        props.history.push(link);
    };

    return (
        <AppBar position="static" style={{ boxShadow: "None", marginTop: "2em" }}>
            <Toolbar>
                <Button
                    className={`${classes.menuButton} ${window.location.hash === "#/project/supervisor" && classes.ActiveMenuButton}`}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRedirect("/project/supervisor")}
                >
                    Overview
                </Button>
                <Button
                    className={`${classes.menuButton} ${window.location.hash === "#/project/supervisor/tasks" && classes.ActiveMenuButton}`}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRedirect("/project/supervisor/tasks")}
                >
                    Tasks
                </Button>
                <Button
                    className={`${classes.menuButton} ${window.location.hash === "#/project/supervisor/sample" && classes.ActiveMenuButton}`}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRedirect("/project/supervisor/sample")}
                >
                    Sample
                </Button>
                <Button
                    className={`${classes.menuButton} ${window.location.hash === "#/project/supervisor/view" && classes.ActiveMenuButton}`}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRedirect("/project/supervisor/view")}
                >
                    View
                </Button>
            </Toolbar>
        </AppBar >
    );
};

export default withRouter(SupervisorHeader);
