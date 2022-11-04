import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { setStatusBar } from "../../Store/Site/ActionCreator";
import { store } from "../..";

class NotFoundPage extends Component {
    constructor(props) {
        super(props);

        const message = "404: The Page you Have requested Does Not Exist, Redirecting you to DashBoard";// user type
        store.dispatch(setStatusBar(true, "error", message));
        this.props.history.push("/");
    }
    render() {
        return (
            <Typography variant="h3"> Error 404, Page Not Found </Typography>
        );
    }
}

export default withRouter(NotFoundPage);
