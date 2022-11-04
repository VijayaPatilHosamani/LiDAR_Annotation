import React from "react";
import { ReactComponent as Logo } from "./Icons/PaintBrush.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class PaintBrushTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.PAINTBRUSH);
  }

  render() {
    return (
      <Tooltip title="PaintBrush Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default PaintBrushTool;
