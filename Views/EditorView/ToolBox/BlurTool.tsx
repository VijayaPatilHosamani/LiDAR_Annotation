import React from "react";
import { ReactComponent as Logo } from "./Icons/Blur.svg";
import { UtilTypes } from ".";

class BlurTool extends React.Component<{ setTool: any }, {}> {

    constructor(props: any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.setTool(UtilTypes.BLUR)
    }

    render() {
        return (
            <Logo onMouseDown={this.handleClick} />
        );
    }
}

export default BlurTool;

