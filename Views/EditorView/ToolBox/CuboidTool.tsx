import React from "react";
import { ReactComponent as Logo } from "./Icons/cube.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class CuboidTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.CUBOID);
  }

  render() {
    return (
      <Tooltip title="Cuboid Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default CuboidTool;
