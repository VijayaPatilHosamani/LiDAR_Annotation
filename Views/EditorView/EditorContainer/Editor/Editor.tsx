import React from "react";
import { ISize } from "../../../../Types/Interfaces";
import { updateImageDataById } from "../../../../Store/Label/ActionCreators";
import { ImageDataType } from "../../../../Store/Label";
import { LabelTypes, EventTypes, UtilTypes } from "../../../../Types";
import { EditorActions, CanvasActions } from "../../../../Actions";
import {
  EditorManager,
  AsyncManager,
  ImageManager,
} from "../../../../Managers";
import { CanvasUtils, FileUtils } from "../../../../Utils";
import { AppState } from "../../../../Store";
import { connect } from "react-redux";

interface IProps {
  canvasSize: ISize;
  imageData: ImageDataType;
  activeLabelType: LabelTypes | null;
  activeUtilType: UtilTypes | null;
  updateImageDataById: (id: string, newImageData: ImageDataType) => any;
  activeLabelId: string | null;
  imageDragMode: boolean;
  zoom: number;
}

interface IState {
  canvasSize: ISize;
}

class Editor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      canvasSize: {
        width: 0,
        height: 0,
      },
    };
  }

  componentDidMount(): void {

    const { imageData, activeLabelType, activeUtilType } = this.props;
    window.addEventListener(EventTypes.KEY_DOWN, this.update, false)
    window.addEventListener(EventTypes.MOUSE_MOVE, this.update);
    window.addEventListener(EventTypes.MOUSE_UP, this.update);
    if (EditorManager.canvas) {
      EditorManager.canvas.addEventListener(EventTypes.MOUSE_DOWN, this.update);
    }
    if (activeUtilType) {
      EditorActions.mountRendererAndHandlers(activeUtilType);
    } else {
      EditorActions.mountRendererAndHandlers(activeLabelType);
    }

    AsyncManager.addAndRun(this.loadImage(imageData));


    // if (imageData) {
    //   var kt = imageData;
    //
    //   const url = URL.createObjectURL(kt.fileData);
    //   const image = new Image();
    //   image.src = url;
    //   image.onload = () => {
    //     CanvasActions.resizeCanvas({ height: image.height, width: image.width });
    //     // alert(height + ' ' + width);
    //     //return { width: image.width, height: image.height}
    //   };
    // }
    // else {
      CanvasActions.resizeCanvas(this.props.canvasSize);
    // }
  }

  componentWillUnmount(): void {
      window.removeEventListener(EventTypes.MOUSE_MOVE, this.update);
    window.removeEventListener(EventTypes.MOUSE_UP, this.update);
    if (EditorManager.canvas) {
      EditorManager.canvas.removeEventListener(
        EventTypes.MOUSE_DOWN,
        this.update
      );
    }
  }

  componentDidUpdate(
    prevProps: Readonly<IProps>,
    prevState: Readonly<IState>,
    snapshot?: any
  ): void {
    const { imageData, activeLabelType, activeUtilType } = this.props;
    if (imageData) {
      if (prevProps.imageData) {
        prevProps.imageData.id !== imageData.id &&
          AsyncManager.addAndRun(this.loadImage(imageData));
      } else {
        AsyncManager.addAndRun(this.loadImage(imageData));
      }
    }
    if (activeUtilType) {
      if (prevProps.activeUtilType) {
        prevProps.activeUtilType !== activeUtilType &&
          EditorActions.swapSupportRenderer(activeUtilType);
      } else {
        EditorActions.swapSupportRenderer(activeUtilType);
      }
    } else if (activeLabelType) {
      if (prevProps.activeLabelType) {
        prevProps.activeLabelType !== activeLabelType &&
          EditorActions.swapSupportRenderer(activeLabelType);
      } else {
        EditorActions.swapSupportRenderer(activeLabelType);
      }
    }
    this.updateModelAndRender();
  }

  //helpers
  private saveLoadedImage = (
    image: HTMLImageElement,
    imageData: ImageDataType
  ) => {
    imageData.loaded = true;
    this.props.updateImageDataById(imageData.id, imageData);
    ImageManager.store(imageData.id, image);
    EditorActions.setActiveImage(image);
    EditorActions.setLoadingStatus(false);
    this.updateModelAndRender();
  };

  private loadImage = async (imageData: ImageDataType): Promise<any> => {
    if (imageData) {
       
      if (imageData.loaded) {
        let image: HTMLImageElement | null = ImageManager.getById(imageData.id);
        if (image) {
          EditorActions.setActiveImage(image);
          this.updateModelAndRender();
        }
      } else {
        if (!EditorManager.isLoading) {
          EditorActions.setLoadingStatus(true);
          const saveLoadedImagePartial = (image: HTMLImageElement) =>
            this.saveLoadedImage(image, imageData);
          FileUtils.loadImage(
            imageData.fileData,
            saveLoadedImagePartial,
            () => {
              console.error("Image Loader Failed!");
            }
          );
        }
      }
    }
  };

  private updateModelAndRender = () => {
    CanvasActions.updateCanvasSize();
    CanvasActions.updateDefaultCanvasImageRect();
    EditorActions.fullRender();
  };

  private update = (event: MouseEvent | KeyboardEvent): void => {
    const editorData = EditorActions.getEditorData(event);
    if (EditorManager.canvas) {
      const mousePosition = CanvasUtils.getMousePositionOnCanvasFromEvent(
        event,
        EditorManager.canvas
      );
      if (mousePosition) {
        EditorManager.mousePositionOnCanvasContent = mousePosition;
      }
    }
    EditorManager.mainRenderer && EditorManager.mainRenderer.update(editorData);
    EditorManager.supportRenderer && EditorManager.supportRenderer.update(editorData);
    EditorActions.fullRender();
  };

  // render
  public render() {
    return (
      <div
        id="Editor"
        ref={(ref) => (EditorManager.editor = ref)}
        draggable={false}
      >
        <div
          className="CanvasContent"
        >
          <canvas onContextMenu={(e) => { e.preventDefault(); return false; }}
            className="canvas"
            ref={(ref) => (EditorManager.canvas = ref)}
            draggable={false}
          />
          <div
            className="MousePositionIndicator"
            ref={(ref) => (EditorManager.mousePositionIndicator = ref)}
            draggable={false}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateImageDataById,
};

const mapStateToProps = (state: AppState) => ({
  zoom: state.Editor.zoom,
  activeLabelType: state.labels.activeLabelType,
  activeUtilType: state.Editor.activeUtilType,
  activeLabelId: state.labels.activeLabelId,
  imageDragMode: state.Editor.imageDragMode,
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
