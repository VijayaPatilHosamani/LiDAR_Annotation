import React from "react";
import { ReactComponent as Logo } from "./Icons/Contrast.svg";
import { UtilTypes } from ".";

class ContrastTool extends React.Component<{ setTool: any }, {}> {

    constructor(props: any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.setTool(UtilTypes.CONTRAST)
    }

    render() {
        return (
            <Logo onMouseDown={this.handleClick} />
        );
    }
}

export default ContrastTool;