import React, { Component } from 'react';
import { UserType, UserSelector } from "../../Store/User";

class Overview extends Component {
    constructor(props) {
        super(props);
        const currentUser = UserSelector.getCurrentUser();
        if (currentUser.Role === UserType.PROJECTMANAGER || currentUser.Role === UserType.SUPERVISOR) {
            this.props.history.push("/project/supervisor");
        }
        else if (currentUser.Role === UserType.AGENT) {
            this.props.history.push("/project/production")
        }
        else {
            this.props.history.push("/Login");
        }
    }
    render() {
        return (
            <div className="animated fadeIn pt-1 text-center" > Loading... </div>
        );
    }
}
export default Overview;