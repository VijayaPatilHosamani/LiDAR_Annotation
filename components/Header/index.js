import React from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import { withRouter } from "react-router-dom";
import { updateToBeEditedProject } from "../../Store/Project/ActionCreator";
import { UserSelector, UserType } from "../../Store/User";
import logo from '../../assets/logo.png';

// import grey  from "@material-ui/core/colors/grey";
//import { blueGrey } from "@material-ui/core/colors";


const useStyles = makeStyles((theme) => ({
    Header: {
        minWidth: "Max-Content",
        backgroundColor: theme.palette.primary.light,
        margin: theme.spacing(0),
        marginBottom: theme.spacing(5),
        position: "sticky",
        top: "0",
        zIndex: "1200"
    },
    menuButton: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
        fontWeight: "bold",

        padding: theme.spacing(2),
        marginRight: theme.spacing(3),
    },
    ActiveMenuButton: {
        backgroundColor: theme.palette.primary.contrastText,
    },
    link: {
        flex: "none",
    },
    title: {
        height: 100,
        width: 200,
        padding: theme.spacing(1.8),
        marginRight: theme.spacing(3),
        marginLeft: theme.spacing(4)
    },
    HeaderObjects: {
        flex: "none",
        display: "flex",
        justifyContent: "space-between",
        width: "80%",
    },
    search: {
        border: "1px solid black",
        background: theme.palette.primary.light,
        borderRadius: theme.shape.borderRadius,
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("xs")]: {
            marginLeft: theme.spacing(1),
            width: "auto"
        }
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create("width"),
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch"
            }
        }
    }

}));

const Header = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { history } = props;
    let isAuthenticated = UserSelector.isUserAuthenticated();
    const editingProject = useSelector(state => state.Project.ToBeEditedProject);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.User.currentUser);
    const globalSearch = useSelector(state => state.Site.searchBarFn)
    let handleSearch = {
        fn: () => { }
    };

    if (globalSearch !== null) {
        handleSearch = {
            fn: globalSearch
        };
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRedirect = (link) => {
        if (editingProject !== null) {
            const conf = window.confirm("Are You Sure You Want to Exit Project Creation or Edit ?")
            if (conf) {
                dispatch(updateToBeEditedProject(null));
                history.push(link);
                setAnchorEl(null);
            }
        }
        else {
            history.push(link);
            setAnchorEl(null);
        }

    };

    return (
        < div className={classes.Header} >
            <AppBar position="static" color="primary">
                <Toolbar>
                    <img href="/" className={classes.title} style={{ "width": "120px", height: '100px' }} src={logo} alt="VentureSoft Global" />

                    {isAuthenticated && (
                        <div className={classes.HeaderObjects}>
                            <div className={classes.link}>
                                <Button
                                    className={`${classes.menuButton} ${window.location.hash === "#/" && classes.ActiveMenuButton}`}
                                    variant="contained"
                                    color="primary.contrastText"
                                    onClick={() => handleRedirect("/")}
                                >
                                    DashBoard
                                </Button>
                                <Button
                                    className={`${classes.menuButton} ${window.location.hash === "#/projects" && classes.ActiveMenuButton}`}
                                    variant="contained"
                                    color="primary.contrastText"
                                    onClick={() => handleRedirect("/projects")}
                                >
                                    Projects
                                </Button>
                                {(currentUser && (currentUser.Role === UserType.PROJECTMANAGER || currentUser.Role === UserType.SUPERVISOR)) &&
                                    <>
                                        <Button
                                            className={`${classes.menuButton} ${window.location.hash === "#/report" && classes.ActiveMenuButton}`}
                                            variant="contained"
                                            color="primary.contrastText"
                                            onClick={() => handleRedirect("/report")}
                                        >
                                            Reports
                                        </Button>
                                        {currentUser.Role === UserType.PROJECTMANAGER &&
                                            <>
                                                <Button
                                                    className={`${classes.menuButton} ${window.location.hash === "#/users" && classes.ActiveMenuButton}`}
                                                    variant="contained"
                                                    color="primary.contrastText"
                                                    onClick={() => handleRedirect("/users")}
                                                >
                                                    Users
                                        </Button>
                                                <Button
                                                    className={`${classes.menuButton} ${window.location.hash === "#/project/new" && classes.ActiveMenuButton}`} variant="contained"
                                                    color="primary.contrastText"
                                                    onClick={() => handleRedirect("/project/new")}
                                                >
                                                    Setup Project
                                        </Button>
                                            </>
                                        }
                                    </>
                                }
                            </div>
                            <div className={classes.link}>

                                <span>
                                    <TextField className={classes.search}
                                        InputProps={{
                                            startAdornment: (<InputAdornment position="start"> <SearchIcon className={classes.SearchIcon} /> </InputAdornment>),
                                        }}
                                        fullwidth="true" name="searchBar" variant="outlined" onChange={(event) => handleSearch.fn(event)}
                                        placeholder="Search…"
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </span>

                                <Button
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    className={classes.menuButton}
                                    onClick={handleMenu}
                                    variant="contained"
                                    color="primary.contrastText"
                                    endIcon={<ExpandMore />}
                                >
                                    {currentUser.UserName}
                                </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right"
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right"
                                    }}
                                    open={open}
                                    onClose={() => {
                                        setAnchorEl(null);
                                    }}
                                >
                                    <MenuItem onClick={() => handleRedirect("/Profile")}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => handleRedirect("/Settings")}>
                                        Settings
                                    </MenuItem>
                                    <MenuItem onClick={() => handleRedirect("/Logout")}>
                                        Logout
                                </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div >
    );
};

export default withRouter(Header);
