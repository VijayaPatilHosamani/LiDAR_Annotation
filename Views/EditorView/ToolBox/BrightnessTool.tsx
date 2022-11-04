import React from "react";
import { ReactComponent as Logo } from "./Icons/Brightness.svg";
import { UtilTypes } from ".";
import { Tooltip } from "@material-ui/core";

class BrightnessTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(UtilTypes.BRIGHTNESS);
  }

  render() {
    return (
      <Tooltip title="Brightness Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default BrightnessTool;
