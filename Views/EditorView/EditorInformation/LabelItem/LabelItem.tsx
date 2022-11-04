/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import React, { useState } from "react";
import { Dropdown } from 'reactstrap';
import { LabelActions } from "../../../../Actions";
import "./LabelItem.scss"

interface IProps {
  id: string;
  key: string;
  labelId: string;
  ImageId: string;
  LabelName: any;
  annotationName: string | undefined;
  annotation: string | null;
  DropDown: [any] | null;
}

interface IState {
  show: boolean;
  defaultValue: string;
}

export class LabelItem extends React.Component<IProps, IState>  {
  constructor(props: IProps) {
    super(props);
    let defaultValue = this.getDefaultAnnotation();
    this.state = {
      show: true,
      defaultValue: defaultValue
    }
    this.getDefaultAnnotation = this.getDefaultAnnotation.bind(this);
    LabelActions.setAnnotation(props.ImageId, props.id, defaultValue);
  }


  deleteCurrentLabel = () => {
    LabelActions.deleteAnyLabelById(this.props.ImageId, this.props.id);
  };

  hideCurrentLabel = () => {
    LabelActions.hideAnyLabelById(this.props.ImageId, this.props.id);

    let state = { ...this.state}
    state.show =  !state.show;
    this.setState(state);
  };


  getDefaultAnnotation = () => {
    let defaultValue = "None";
    if (this.props.annotation !== null && this.props.annotation !== "None") {
      if (this.props.DropDown.filter(item => item.name === this.props.annotation).length > 0) {
        defaultValue = this.props.annotation;
      }
      else {
        defaultValue = "Unknown";
      }
    }
    return defaultValue;
  }

  componentDidMount = () =>{
  }

  renderDropdown = () => {
    let defaultValue = this.getDefaultAnnotation();
    return <React.Fragment>
      <option>None</option>
        {
          this.props.DropDown.map(x => {
            let select = x.name === defaultValue;
            return <option selected={select}>{x.name}</option>
          })
        }
        {
          defaultValue==="Unknown" && <option selected>Unknown</option>
        }
    </React.Fragment>
  }

  render = ()=>{
      return (
        <div className="labelCard">
          <div>
              {this.props.LabelName}
          </div>
          <div className="labelItem">
            <span>
              <select style={{"padding": "5px"}}
                defaultValue={this.state.defaultValue}
                onChange={(e) => {
                  if (e.target.value !== "None") {
                    LabelActions.setAnnotation(
                      this.props.ImageId,
                      this.props.id,
                      e.target.value
                    );
                  } else {
                    LabelActions.setAnnotation(this.props.ImageId, this.props.id, "None");
                  }
                }}
              >
                {
                  this.renderDropdown()
                }
              </select>
            </span>
            <span>
              {this.state.show === false && (<VisibilityIcon style={{ fontSize: "2em" }} onClick={() => { this.hideCurrentLabel() }} />)}
              {this.state.show === true && (<VisibilityOffIcon style={{ fontSize: "2em" }} onClick={() => { this.hideCurrentLabel() }} />)}
              {" "}
              <DeleteIcon style={{ fontSize: "2em" }} onClick={() => { this.deleteCurrentLabel() }} />
            </span>
          </div>
        </div>
      );
    }
};