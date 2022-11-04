import React from "react";
import { ReactComponent as Logo } from "./Icons/Sharpen.svg";
import { UtilTypes } from ".";

class SharpenTool extends React.Component<{ setTool: any }, {}> {

    constructor(props: any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.setTool(UtilTypes.SHARPEN)
    }

    render() {
        return (
            <Logo onMouseDown={this.handleClick} />
        );
    }
}

export default SharpenTool;

