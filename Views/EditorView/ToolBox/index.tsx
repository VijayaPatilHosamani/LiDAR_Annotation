import React from "react";
import "./ToolBox.scss";
import { LabelTypes, UtilTypes } from "../../../Types";
import { store } from "../../..";
import { updateActiveLabelType, addImagesData } from "../../../Store/Label/ActionCreators";
import { CanvasActions } from "../../../Actions";
import DotTool from "./DotTool";
import BoxTool from "./BoxTool";
import CircleTool from "./CircleTool";
import LineTool from "./LineTool";
import ZoomInTool from "./ZoomInTool";
import ZoomOutTool from "./ZoomOutTool";
import MeasureTool from "./MeasureTool";
import {
  updateActiveUtilType,
  updateHideStatus,
  updateSharpen,
  updateBlur,
  updateGrayscale,
  updateBrightness,
  updateContrast,
  UndoState,
  DoState,
} from "../../../Store/Editor/ActionCreators";

import {setStatusBar} from "../../../Store/Site/ActionCreator";
import { EditorSelector } from "../../../Store/Editor";
import PolygonTool from "./PolygonTool";
import ArrowTool from "./ArrowTool";
import FreehandTool from "./FreehandTool";
import CuboidTool from "./CuboidTool";
import UndoTool from "./UndoTool";
import RedoTool from "./RedoTool";
import PaintBrushTool from "./PaintBrushTool";
import { LabelsSelector } from "../../../Store/Label";
import SegmentationTool from "./SegmentationTool";

export { LabelTypes, UtilTypes };

interface IProps {
  ProjectDetails: any
  readonly: boolean,
}


export default class ToolBox extends React.Component<IProps, {}> {
  constructor(props: any) {
    super(props);
    this.SetLabel = this.SetLabel.bind(this);
    this.SetUtils = this.SetUtils.bind(this);
  }

  SetLabel(LabelTypes: LabelTypes) {
    store.dispatch(updateActiveUtilType(null));
    store.dispatch(updateActiveLabelType(LabelTypes));
  }

  SetUtils(Utils: UtilTypes) {
    switch (Utils) {
      case UtilTypes.ZOOM_IN: {
        CanvasActions.zoomIn();
        break;
      }
      case UtilTypes.ZOOM_OUT: {
        CanvasActions.zoomOut();
        break;
      }
      case UtilTypes.MEASUREMENT: {
        store.dispatch(updateActiveLabelType(LabelTypes.NONE));
        store.dispatch(updateActiveUtilType(Utils));
        break;
      }

      case UtilTypes.HIDE: {
        store.dispatch(updateActiveLabelType(LabelTypes.NONE));
        store.dispatch(updateActiveUtilType(Utils));
        store.dispatch(updateHideStatus(!EditorSelector.getHideStatus()));
        break;
      }
      case UtilTypes.SHARPEN: {
        let currentSharpen: number = EditorSelector.getSharpen();
        currentSharpen += 0.2;
        if (currentSharpen > 1) {
          currentSharpen = 0;
        }
        store.dispatch(updateSharpen(currentSharpen));
        break;
      }

      case UtilTypes.BRIGHTNESS: {
        let currentBrightness: number = EditorSelector.getBrightness();
        currentBrightness += 20;
        if (currentBrightness > 200) {
          currentBrightness = 10;
        }
        store.dispatch(updateBrightness(currentBrightness));
        break;
      }

      case UtilTypes.CONTRAST: {
        let currentContrast: number = EditorSelector.getContrast();
        currentContrast += 30;
        if (currentContrast > 255) {
          currentContrast = 10;
        }
        store.dispatch(updateContrast(currentContrast));
        break;
      }

      case UtilTypes.BLUR: {
        let currentBlur: number = EditorSelector.getBlur();
        currentBlur = currentBlur === 1 ? 0 : 1;
        store.dispatch(updateBlur(currentBlur));
        break;
      }

      case UtilTypes.UNDO: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let cht = LabelsSelector.getActiveImageData();
        let x = EditorSelector.getDoState();
        if (x.length > 1) {
          let y = x.pop();
          store.dispatch(UndoState(y));
          // let stringy = JSON.stringify(cht);

          // let comp = stringy === y;
          // if (comp) {
            y = x[x.length - 1];
            store.dispatch(UndoState(y));
          // }
          let parsed = JSON.parse(y);
          store.dispatch(addImagesData([parsed]));

        }
        else {
          store.dispatch(setStatusBar(true, "info", "Cannot Undo Anymore!"));
        }

        break;
      }

      case UtilTypes.REDO: {
        // store.dispatch(UndoState())
        // ;
        let cht = LabelsSelector.getActiveImageData();
        let x = EditorSelector.getUndoState();
        if (x.length > 0) {
          let y = x.pop();
          store.dispatch(DoState(y));
          if (JSON.stringify(cht) === y) {
            y = x.pop();
            store.dispatch(DoState(y));
          }
          store.dispatch(addImagesData([JSON.parse(y)]));
        }
        break;
      }




      case UtilTypes.GRAY_SCALE: {
        let currentGrayScale: number = EditorSelector.getGrayscale();
        currentGrayScale = currentGrayScale === 1 ? 0 : 1;
        store.dispatch(updateGrayscale(currentGrayScale));
        break;
      }
    }
  }

  render() {

    let ProjectDetails = this.props.ProjectDetails ? this.props.ProjectDetails : {};
    if(this.props.readonly){
      ProjectDetails = {};
    }
    return (
      <div id="toolbar">
        <div id="toolbox">
          <div className="labels">
            {
              ProjectDetails.point ? <DotTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.line ? <LineTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.circle ? <CircleTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.polygon ? <PolygonTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.arrow ? <ArrowTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.box ? <BoxTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.cuboid ? <CuboidTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.freehand ? <FreehandTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.paintBrush ? <PaintBrushTool setTool={this.SetLabel} /> : null
            }
            {
              ProjectDetails.segmentation ? <SegmentationTool setTool={this.SetLabel} /> : null
            }

          </div>
          <div className="utils">
            <ZoomInTool setTool={this.SetUtils} />
            <ZoomOutTool setTool={this.SetUtils} />
            <MeasureTool setTool={this.SetUtils} />
            {/* <HideTool setTool={this.SetUtils} /> */}
            <UndoTool setTool={this.SetUtils} />
            <RedoTool setTool={this.SetUtils} />
            {/* <GrayScale setTool={this.SetUtils} /> */}
            {/* <SharpenTool setTool={this.SetUtils} />
              <BlurTool setTool={this.SetUtils} />
              <BrightnessTool setTool={this.SetUtils} />
              <ContrastTool setTool={this.SetUtils} /> */}
          </div>
        </div>
        <span className="label unselectable"> Label</span>
      </div>

    );
  }
}
