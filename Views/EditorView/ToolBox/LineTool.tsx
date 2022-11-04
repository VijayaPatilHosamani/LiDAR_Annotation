import React from "react";
import { ReactComponent as Logo } from "./Icons/line.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class LineTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.LINE);
  }

  render() {
    return (
      <Tooltip title="Line Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default LineTool;
