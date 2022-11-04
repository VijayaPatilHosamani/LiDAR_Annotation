import React from "react";
import TuneIcon from "@material-ui/icons/Tune";
import {
  ImageDataType,
  LabelLine,
  LabelPoint,
  LabelRect,
} from "../../../Store/Label";
import { AppState } from "../../../Store";
import { connect } from "react-redux";
import { LabelItem } from "./LabelItem/LabelItem";
import { ISize } from "../../../Types/Interfaces";
import {
  LabelCircle,
  LabelPolygon,
  LabelArrow,
  LabelFreehand,
  LabelCuboid,
  LabelPaintBrush,
  LabelSegmentation,
} from "../../../Store/Label/types";
import { Slider, Switch } from "@material-ui/core";
import { store } from "../../..";
import {
  updateBrightness,
  updateSharpen,
  updateContrast,
  updateGrayscale,
  updatePaintBrushColor,
  updatePaintBrushThickness
} from "../../../Store/Editor/ActionCreators";
import { EditorSelector } from "../../../Store/Editor";
import { LabelTypes } from "../../../Types";
import "../EditorView.scss"
//import { isNullOrUndefined } from "util";

interface IProps {
  activeImageIndex: number | null;
  measurement: ISize;
  imagesData: ImageDataType[];
  ProjectDetails: any | null;
}

function getLabels(imageData: ImageDataType,ProjectDetails:any) {

  let points = imageData.labelPoints.map((label: LabelPoint) => {
    return (
      <LabelItem
        id={label.id}
        labelId={label.labelId}
        key={label.id}
        ImageId={imageData.id}
        LabelName={LabelTypes.POINT}
        annotationName={label.annotationName}
        annotation={label.annotation}
        DropDown={ProjectDetails.pointLabels}
      />
    );
  });
  let lines = imageData.labelLines.map((label: LabelLine) => {
    return (
      <LabelItem
        id={label.id}
        labelId={label.labelId}
        key={label.id}
        ImageId={imageData.id}
        LabelName={LabelTypes.LINE}
        annotationName={label.annotationName}
        annotation={label.annotation}
        DropDown={ProjectDetails.lineLabels}
      />
    );
  });
  let rects = imageData.labelRects.map((label: LabelRect) => {
    return (
      <LabelItem
        id={label.id}
        labelId={label.labelId}
        key={label.id}
        ImageId={imageData.id}
        LabelName={LabelTypes.RECTANGLE}
        annotationName={label.annotationName}
        annotation={label.annotation}
        DropDown={ProjectDetails.boxLabels}
      />
    );
  });

  let circles = imageData.labelCircles.map((label: LabelCircle) => {
    return (
      <LabelItem
        id={label.id}
        labelId={label.labelId}
        key={label.id}
        ImageId={imageData.id}
        LabelName={LabelTypes.CIRCLE}
        annotationName={label.annotationName}
        annotation={label.annotation}
        DropDown={ProjectDetails.circleLabels}
      />
    );
  });
  let polygons = imageData.labelPolygon.map((label: LabelPolygon) => {
    return (
      <LabelItem
        id={label.id}
        labelId={label.labelId}
        key={label.id}
        ImageId={imageData.id}
        LabelName={LabelTypes.POLYGON}
        annotationName={label.annotationName}
        annotation={label.annotation}
        DropDown={ProjectDetails.polygonLabels}
      />
    );
  });

  let arrows = imageData.labelArrow.map((label: LabelArrow) => {
    return (
      <LabelItem
        id={label.id}
        labelId={label.labelId}
        key={label.id}
        ImageId={imageData.id}
        LabelName={LabelTypes.ARROW}
        annotationName={label.annotationName}
        annotation={label.annotation}
        DropDown={ProjectDetails.arrowLabels}
      />
    );
  });

  let cuboid = imageData.labelCuboid.map((label: LabelCuboid) => {
    return (
      <LabelItem
        id={label.id}
        labelId={label.labelId}
        key={label.id}
        ImageId={imageData.id}
        LabelName={LabelTypes.CUBOID}
        annotationName={label.annotationName}
        annotation={label.annotation}
        DropDown={ProjectDetails.cuboidLabels}
      />
    );
  });

  let freehand = imageData.labelFreeHand.map((label: LabelFreehand) => {
    return (
      <LabelItem
        id={label.id}
        labelId={label.labelId}
        key={label.id}
        ImageId={imageData.id}
        LabelName={LabelTypes.FREEHAND}
        annotationName={label.annotationName}
        annotation={label.annotation}
        DropDown={ProjectDetails.freehandLabels}
      />
    );
  });

  let paintBrush = imageData.labelPaintBrush.map(
    (label: LabelPaintBrush) => {
      return (
        <LabelItem
          id={label.id}
          labelId={label.labelId}
          key={label.id}
          ImageId={imageData.id}
          LabelName={LabelTypes.PAINTBRUSH}
          annotationName={label.annotationName}
          annotation={label.annotation}
          DropDown={ProjectDetails.paintBrushLabels}
        />
      );
    }
  );

  let segmentation = imageData.labelSegmentation.map(
    (label: LabelSegmentation) => {
      return (
        <LabelItem
          id={label.id}
          labelId={label.labelId}
          key={label.id}
          ImageId={imageData.id}
          LabelName={LabelTypes.SEGMENTATION}
          annotationName={label.annotationName}
          annotation={label.annotation}
          DropDown={ProjectDetails.segmentationLabels}
        />
      );
    }
  );

  return (
    <div>
      {points} {lines} {rects} {circles} {polygons} {arrows} {cuboid} {freehand}{" "}
      {paintBrush} {segmentation}
    </div>
  );
}

const EditorInformation: React.FC<IProps> = (props: IProps) => {
  let activeImageIndex = 0;
  if (props.activeImageIndex) {
    activeImageIndex = props.activeImageIndex;
  }
  let ImageData: ImageDataType | null = props.imagesData[activeImageIndex];

  const [toggleTools, setToggleTools] = React.useState<boolean>(false);
  const [greyState, setGreyState] = React.useState<boolean>(false);

  const handleChange = (event: any) => {
    setGreyState(event.target.checked);
    store.dispatch(updateGrayscale(greyState === true ? 0 : 1));
  };

  return (
    <div className="EditorInfoContainer">
      <div className="Measurement">
        <div
          onClick={() => {
            setToggleTools(!toggleTools);
          }}
        >
          <TuneIcon>Filled</TuneIcon>
              Image Tools
            </div>

        {toggleTools && (
          <div>
            <span>Brightness</span>
            <Slider
              step={30}
              min={0}
              max={200}
              onChangeCommitted={(event, value: any) => {
                store.dispatch(updateBrightness(value));
              }}
              defaultValue={EditorSelector.getBrightness()}
            ></Slider>
            <span>Sharpness</span>
            <Slider
              step={0.2}
              min={0}
              max={0.99}
              onChangeCommitted={(event, value: any) => {
                store.dispatch(updateSharpen(value));
              }}
              defaultValue={EditorSelector.getSharpen()}
            ></Slider>
            <span>Contrast</span>
            <Slider
              step={30}
              min={0}
              max={254}
              onChangeCommitted={(event, value: any) => {
                store.dispatch(updateContrast(value));
              }}
              defaultValue={EditorSelector.getContrast()}
            ></Slider>
            <div>
              <div>Grey</div>
              <span>OFF</span>
              <Switch
                checked={greyState}
                onChange={handleChange}
                color="primary"
                name="greyState"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
              <span>ON</span>
            </div>

            <span>PaintBrush Thickness</span>
            <Slider
              step={10}
              min={5}
              max={100}
              onChangeCommitted={(event, value: any) => {
                store.dispatch(updatePaintBrushThickness(value));
              }}
              defaultValue={EditorSelector.getPaintBrushThickness()}
            ></Slider>

            <span>PaintBrush Color</span>
            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                store.dispatch(updatePaintBrushColor(e.target.value));
                // alert();
              }}
            />
          </div>
        )}

        <hr />
        <p>Last Measurement</p>
        <span> Width: {Math.floor(props.measurement.width)} </span>
        <span> Height: {Math.floor(props.measurement.height)} </span>
      </div>
      {ImageData && getLabels(ImageData,props.ProjectDetails)}
    </div>
  );
}


const mapStateToProps = (state: AppState) => ({
  activeImageIndex: state.labels.activeImageIndex,
  imagesData: state.labels.imagesData,
  measurement: state.Editor.Measurement,
});

export default connect(mapStateToProps)(EditorInformation);
