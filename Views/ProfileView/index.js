import React from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { UserSelector } from "../../Store/User";


const useStyles = makeStyles((theme) => ({
    projectHeader: {
        fontWeight: "bold",
        padding: theme.spacing(2),
        marginRight: theme.spacing(3),
    },
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

export const ProfileHeaderView = (props) => {
    const classes = useStyles();
    const handleRedirect = (link) => {
        props.history.push(link);
    };

    const userDetail = UserSelector.getCurrentUser();
    if (userDetail === null || userDetail === undefined) {
        props.history.push("/");
    }

    return (
        <AppBar position="static" style={{ boxShadow: "None" }}>
            <Toolbar>
                <Typography variant="h5" className={classes.projectHeader}>
                    {userDetail.UserName}
                </Typography>
                <Button
                    className={`${classes.menuButton} ${window.location.hash === "#/Profile" && classes.ActiveMenuButton}`}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRedirect("/Profile")}
                >
                    Profile
                </Button>
                <Button
                    className={`${classes.menuButton} ${window.location.hash === "#/Settings" && classes.ActiveMenuButton}`}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRedirect("/Settings")}
                >
                    Settings
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default withRouter(ProfileHeaderView);
