import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Auth } from "aws-amplify";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles"

import { store } from '.';
import { updateCognitoUser, updateCurrentUser, updateUserIsAuthenticated, updateAllUsers } from './Store/User/ActionCreator';
import { UserType } from "./Store/User";
import { setStatusBar } from "./Store/Site/ActionCreator";
import ProtectedRoute from "./ProtectedRoute";


import StatusBar from "./components/StatusBar/StatusBar";
import NotFoundPage from "./components/NotFoundPage";
import API from "./Api";

/* NavBar Component */
import Header from "./components/Header";
import Logout from "./Views/LoginView/logout";
import Intro from './Views/IntroView/Intro';

/*Login Authentication*/
import Login from './Views/LoginView/Login';
import ConfirmUser from './Views/LoginView/ConfirmUser';
import ResetPassword from './Views/LoginView/ResetPassword';
import ResetPasswordSet from './Views/LoginView/ResetPasswordSet';

/* After SuccessFull Login */
import DashboardView from './Views/DashBoardView';
import ProjectView from './Views/ProjectView';
import UserView from "./Views/UserView";
import SetUpNewProject from "./Views/ProjectSettingsView/SetupNewProject";
import ReportView from "./Views/ReportView";

/* from Project View */
import Overview from './components/OverView';
import Sample from "./Views/ProjectView/Supervisor/Samples";
import View from "./Views/ProjectView/Supervisor/View";

/* Sampling"*/
import EditProject from "./Views/ProjectSettingsView/EditProject";


/* for OverView */
import SupervisorOverview from "./Views/ProjectView/Supervisor/Overview";

import ReviewView from "./Views/ProjectView/Agent/Review";
/* for Tasks*/
import SupervisorTask from "./Views/ProjectView/Supervisor/Tasks";

/* other pages to be edited */

import AgentOverview from "./Views/ProjectView/Agent/Production";


/* User Settings */
import CreateNewUser from "./Views/UserView/CreateNewUser";
import ConfirmCreateUser from "./Views/UserView/ConfirmCreateUser";
import UserSettings from './Views/UserView/UserSettings';
import UserManage from "./Views/UserView/UserManage";

import ProfileView from "./Views/ProfileView/ProfileView";
import CurrentUserSettings from "./Views/ProfileView/CurrentUserSettings";

// We can inject some CSS into the DOM.
const styles = (theme) => ({
    mainGrid: {
        padding: theme.spacing(0),
        margin: theme.spacing(1),
    },
});

class Routes extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticating: true
        }
    }

    componentDidMount = async () => {
        let error = false;
        try {
            const user = await Auth.currentAuthenticatedUser();
            const apiUser = await API.GetAllUsers()
            store.dispatch(updateAllUsers(apiUser.data))
            let currentUser = apiUser.data.find(_user => _user.CognitoId === user.attributes.sub)
            if (currentUser === undefined) {
                store.dispatch(setStatusBar(true, 'error', "Cannot Get Current Users"));
                error = true;
            }
            else {
                store.dispatch(setStatusBar(true, 'success', `Hi ${currentUser.UserName}, You are logged in as a ${currentUser.Role}`));
                store.dispatch(updateUserIsAuthenticated(true));
                store.dispatch(updateCurrentUser(currentUser));
                store.dispatch(updateCognitoUser(user));
            }
        } catch (errorResponse) {
            let message = errorResponse.message ? errorResponse.message : errorResponse
            store.dispatch(setStatusBar(true, 'error', `Account Error: ${message}`));
            error = true;
        }
        if (error) {
            Auth.signOut();
        }
        this.setState({
            isAuthenticating: false
        })
    }
    render() {
        return (
            <HashRouter>
                <StatusBar />
                <Header />
                {!this.state.isAuthenticating && (
                    <Grid container className={this.props.classes.mainGrid} justify="center" alignItems="center">
                        <Grid item xl={"auto"}></Grid>
                        <Grid item container xl={10} direction={"column"} >
                            <Grid item></Grid>

                            <Switch>
                                <ProtectedRoute exact path="/" name="Dashboard" component={DashboardView} />
                                <Route exact path="/Intro" name="Product Intro" component={Intro} />
                                <Route exact path="/Login" name="Agent login" component={Login} />
                                <Route exact path="/Login/confirm" name="Agent login Confirm" component={ConfirmUser} />
                                <ProtectedRoute exact path="/Logout" name="Logout" component={Logout} />
                                <Route exact path="/resetpassword" name="Reset Password" component={ResetPassword} />
                                <Route exact path="/resetpassword/set" name="Reset Password Submit" component={ResetPasswordSet} />
                                <Route exact path="/Profile" name="Reset Password Submit" component={ProfileView} />
                                <Route exact path="/Settings" name="Reset Password Submit" component={CurrentUserSettings} />

                                {/*NavBar Pages*/}
                                <ProtectedRoute exact path="/projects" name="Project" component={ProjectView} />
                                <ProtectedRoute exact path="/users" UserAccess={[UserType.PROJECTMANAGER]} name="User" component={UserView} />

                                <ProtectedRoute exact path="/project/overview" name="Get the appropriate Overview" component={Overview} />
                                <ProtectedRoute exact path="/project/supervisor" UserAccess={[UserType.PROJECTMANAGER, UserType.SUPERVISOR]} name="Project Supervisor view" component={SupervisorOverview} />
                                <ProtectedRoute exact path="/project/production" name="Project Production View" component={AgentOverview} />
                                <ProtectedRoute exact path="/project/review" name="Project Review View" component={ReviewView} />
                                <ProtectedRoute exact path="/project/supervisor/tasks" UserAccess={[UserType.PROJECTMANAGER, UserType.SUPERVISOR]} name="Get the appropriate Tasks" component={SupervisorTask} />
                                <ProtectedRoute exact path="/project/settings" UserAccess={[UserType.PROJECTMANAGER]} name="Edit Current Project" component={EditProject} />
                                <ProtectedRoute exact path="/project/new" UserAccess={[UserType.PROJECTMANAGER]} name="Setup New Project" component={SetUpNewProject} />
                                <ProtectedRoute exact path="/project/supervisor/sample" UserAccess={[UserType.PROJECTMANAGER]} name="sample view of the project Tasks" component={Sample} />
                                <ProtectedRoute exact path="/project/supervisor/view" UserAccess={[UserType.PROJECTMANAGER]} name="view of the project Tasks" component={View} />


                                <ProtectedRoute exact path="/user/settings" UserAccess={[UserType.PROJECTMANAGER]} name="User Settings" component={UserSettings} />
                                <ProtectedRoute exact path="/user/manage" UserAccess={[UserType.PROJECTMANAGER]} name="manage a User" component={UserManage} />
                                <ProtectedRoute exact path="/user/create" UserAccess={[UserType.PROJECTMANAGER]} name="Create User" component={CreateNewUser} />
                                <ProtectedRoute exact path="/user/create/confirm" UserAccess={[UserType.PROJECTMANAGER]} name="Create User" component={ConfirmCreateUser} />


                                <ProtectedRoute exact path="/report" UserAccess={[UserType.PROJECTMANAGER, UserType.SUPERVISOR]} name="Report" component={ReportView} />

                                <ProtectedRoute exact path="/changePassword" name="Change Password" component={ResetPassword} />
                                <ProtectedRoute exact path="/404" name="Page Not Found" component={NotFoundPage} />
                                <ProtectedRoute name="Default" component={NotFoundPage} />
                            </Switch>
                            <Grid item></Grid>
                        </Grid>
                        <Grid item xl={"auto"}></Grid>
                    </Grid>
                )}
            </HashRouter>
        );
    }
};

export default withStyles(styles)(Routes);