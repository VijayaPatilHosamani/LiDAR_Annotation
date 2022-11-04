import React from "react";
import { ReactComponent as Logo } from "./Icons/box.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class BoxTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.RECTANGLE);
  }

  render() {
    return (
      <Tooltip title="Box Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default BoxTool;
