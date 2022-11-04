import React from "react";
import { ReactComponent as Logo } from "./Icons/Measure.svg";
import { UtilTypes } from ".";
import { Tooltip } from "@material-ui/core";

class MeasureTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(UtilTypes.MEASUREMENT);
  }

  render() {
    return (
      <Tooltip title="Measure">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default MeasureTool;
