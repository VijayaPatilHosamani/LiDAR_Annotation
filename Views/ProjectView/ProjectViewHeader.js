import React from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { UserSelector, UserType } from "../../Store/User";
import { updateCurrentProject } from "../../Store/Project/ActionCreator";
import { setStatusBar } from "../../Store/Site/ActionCreator";
import { store } from "../..";
import { ProjectSelector } from "../../Store/Project";


const useStyles = makeStyles((theme) => ({
    projectHeader: {
        fontWeight: "bold",
        padding: theme.spacing(2),
        marginRight: theme.spacing(3),
    },
    HeaderObjects: {
        flex: "none",
        display: "flex",
        justifyContent: "space-between",
        width: "80%",
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

const ProjectViewHeader = (props) => {
    const classes = useStyles();
    let projectName = "";
    let currentProject;
    const handleRedirect = (link) => {
        props.history.push(link);
    };

    const currentProjectId = ProjectSelector.GetCurrentProjectId();
    const AllKnowProjects = ProjectSelector.GetDashBoardResponse();
    const userDetail = UserSelector.getCurrentUser();
    if (currentProjectId === null || AllKnowProjects === null) {
        props.history.push("/projects");
    }
    else {
        currentProject = AllKnowProjects.find(project => (project.ProjectId === currentProjectId));
    }

    if (currentProject === undefined) {
        console.error("The Project Id Miss-Match")
        store.dispatch(setStatusBar(true, "error", "The Project Id Miss-Match"))
        props.history.push("/projects");
    }
    else {
        projectName = currentProject.ProjectName;
        store.dispatch(updateCurrentProject(currentProject));
    }

    return (
        <AppBar position="static" style={{ boxShadow: "None" }}>
            <Toolbar className={classes.HeaderObjects}>
                <span style={{"display": "flex"}}>
                    <Typography variant="h5" className={classes.projectHeader}>
                        {projectName}
                    </Typography>
                    {userDetail && (userDetail.Role === UserType.PROJECTMANAGER || userDetail.Role === UserType.SUPERVISOR) &&
                        <>
                            <Button
                                className={`${classes.menuButton} ${window.location.hash === "#/project/supervisor" && classes.ActiveMenuButton}`}
                                variant="contained"
                                color="secondary"
                                onClick={() => handleRedirect("/project/supervisor")}
                            >
                                Supervisor
                                    </Button>
                        </>

                    }
                    <Button
                        className={`${classes.menuButton} ${window.location.hash === "#/project/production" && classes.ActiveMenuButton}`}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRedirect("/project/production")}
                    >
                        Production
                                    </Button>
                    <Button
                        className={`${classes.menuButton} ${window.location.hash === "#/project/review" && classes.ActiveMenuButton}`}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRedirect("/project/review")}
                    >
                        Review
                    </Button>
                </span>
                <span>
                    {/* { props.tool && props.workStarted && (
                        <Button
                            className={classes.menuButton}
                            variant="contained"
                            color="secondary"
                            onClick={props.stopHandler}
                        >
                            Stop Work
                        </Button>
                    )}

                    {props.tool && !props.workStarted && (
                        <Button
                            className={classes.menuButton}
                            variant="contained"
                            color="secondary"
                            onClick={props.startHandler}
                        >
                            Start Work
                        </Button>
                    )} */}
                    {/*TODO:start or stop work here */}
                </span>

            </Toolbar>
        </AppBar>
    );
};

export default withRouter(ProjectViewHeader);
