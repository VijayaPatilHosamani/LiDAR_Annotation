import React from "react";
import { ReactComponent as Logo } from "./Icons/Arrow.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class ArrowTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.ARROW);
  }

  render() {
    return (
      <Tooltip title="Arrow Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default ArrowTool;
