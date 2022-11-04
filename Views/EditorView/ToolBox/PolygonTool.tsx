import React from "react";
import { ReactComponent as Logo } from "./Icons/Polygon.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class PolygonTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.POLYGON);
  }

  render() {
    return (
      <Tooltip title="Polygon Tool">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default PolygonTool;
