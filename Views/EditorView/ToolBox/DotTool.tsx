import React from "react";
import { ReactComponent as Logo } from "./Icons/dot.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class DotTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.POINT);
  }

  render() {
    return (
      <Tooltip title="Dot Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default DotTool;
