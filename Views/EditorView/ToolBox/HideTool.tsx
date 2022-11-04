import React from "react";
import { ReactComponent as HideLogo } from "./Icons/Hide.svg";
import { ReactComponent as UnHideLogo } from "./Icons/UnHide.svg";
import { UtilTypes } from ".";
import { AppState } from "../../../Store";
import { connect } from "react-redux";
import { Tooltip } from "@material-ui/core";

class HideTool extends React.Component<{ setTool: any; Hide: Boolean }, {}> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setTool(UtilTypes.HIDE);
  }

  render() {
    if (this.props.Hide) {
      return (
        <Tooltip title="UnHide">
          <UnHideLogo onMouseDown={this.handleClick} />
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Hide">
        <HideLogo onMouseDown={this.handleClick} />
      </Tooltip>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  Hide: state.Editor.Hide,
});

export default connect(mapStateToProps)(HideTool);
