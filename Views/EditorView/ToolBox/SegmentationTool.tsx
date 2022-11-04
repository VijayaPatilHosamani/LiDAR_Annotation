import React from "react";
import { ReactComponent as Logo } from "./Icons/Segmentation.svg";
import { LabelTypes } from ".";
import { Tooltip } from "@material-ui/core";

class SegmentationTool extends React.Component<{ setTool: any }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(LabelTypes.SEGMENTATION);
  }

  render() {
    return (
      <Tooltip title="Semantic Segmentation">
        <Logo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

export default SegmentationTool;
