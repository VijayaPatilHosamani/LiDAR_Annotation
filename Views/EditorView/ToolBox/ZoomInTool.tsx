import React from "react";
import { ReactComponent as Logo } from "./Icons/ZoomIn.svg";
import { UtilTypes } from ".";
import { Tooltip } from "@material-ui/core";

class ZoomInTool extends React.Component<{ setTool: any }, {}> {

    constructor(props: any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.setTool(UtilTypes.ZOOM_IN)
    }

    render() {
        return (
            <Tooltip title="ZoomIn">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
        );
    }
}

export default ZoomInTool;

