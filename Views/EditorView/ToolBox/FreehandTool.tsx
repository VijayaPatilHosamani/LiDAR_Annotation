import React from "react";
import { ReactComponent as Logo } from "./Icons/Freehand.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class FreehandTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.FREEHAND);
  }

  render() {
    return (
      <Tooltip title="Freehand Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default FreehandTool;
