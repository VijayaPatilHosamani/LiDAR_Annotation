import React from "react";
import { ReactComponent as Logo } from "./Icons/Grayscale.svg";
import { UtilTypes } from ".";

class GrayScale extends React.Component<{ setTool: any }, {}> {

    constructor(props: any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.setTool(UtilTypes.GRAY_SCALE)
    }

    render() {
        return (
            <Logo onMouseDown={this.handleClick} />
        );
    }
}

export default GrayScale;