import React from "react";
import { ReactComponent as Logo } from "./Icons/ZoomOut.svg";
import { UtilTypes } from ".";
import { Tooltip } from "@material-ui/core";

class ZoomOutTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(UtilTypes.ZOOM_OUT);
  }

  render() {
    return (
      <Tooltip title="ZoomOut">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default ZoomOutTool;
