import React from "react";
import { ReactComponent as Logo } from "./Icons/circle.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class CircleTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.CIRCLE);
  }

  render() {
    return (
      <Tooltip title="Circle Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default CircleTool;
