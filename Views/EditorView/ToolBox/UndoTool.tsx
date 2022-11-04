import React from "react";
import { ReactComponent as Logo } from "./Icons/Undo.svg";
import { UtilTypes } from ".";
import { Tooltip } from "@material-ui/core";

class UndoTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(UtilTypes.UNDO);
  }

  render() {
    return (
      <Tooltip title="Undo">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default UndoTool;
