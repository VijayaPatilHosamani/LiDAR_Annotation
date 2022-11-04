import React from "react";
import { ReactComponent as Logo } from "./Icons/Redo.svg";
import { UtilTypes } from ".";
import { Tooltip } from "@material-ui/core";

class RedoTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(UtilTypes.REDO);
  }

  render() {
    return (
      <Tooltip title="Redo">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default RedoTool;
