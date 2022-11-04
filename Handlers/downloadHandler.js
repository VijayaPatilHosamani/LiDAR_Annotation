import { store } from "..";
import { setStatusBar } from "../Store/Site/ActionCreator";
import API from "../Api";


export async function GetTasksLogs(taskIds, projectId) {
    let json = []
    let errorIds = [];
    if (projectId === undefined) {
        store.dispatch(setStatusBar(true, "error", "Project ID not Available"))
        return json;
    }
    let projectOutputs;
    try {
        let response = await API.GetProject(projectId)
        projectOutputs = response.projectOutput;
    }
    catch (error) {
        store.dispatch(setStatusBar(true, "error", "Project Details not Available"))
        console.error(error)
        return json;
    }
    if (taskIds.length > 0) {
        for (let i = 0; i < taskIds.length; i++) {
            let taskId = taskIds[i];
            try {
                let result = await API.GetTaskLogsById(taskId)
                let jsonParse = JSON.parse(result.AnnotationJSon)[0];
                let taskItem = {};
                taskItem["TaskId"] = taskId;
                let Annotations = {};


                if (projectOutputs.point) {
                    let count = 1;
                    jsonParse.labelPoints.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "Point";

                        //x: Math.ceil(item.Rect.x),
                    })
                    Annotations["labelPoints"] = jsonParse.labelPoints;
                }

                if (projectOutputs.box) {
                    let count = 1;
                    jsonParse.labelRects.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "box";
                        let Rect = [[item.Rect.x, item.Rect.y], [item.Rect.x + item.Rect.width, item.Rect.y],
                        [item.Rect.x, item.Rect.y + + item.Rect.height], [item.Rect.x + item.Rect.width, item.Rect.y + item.Rect.height]]

                        item.Rect = Rect;
                    })
                    Annotations["labelRects"] = jsonParse.labelRects;
                }

                if (projectOutputs.arrow) {
                    let count = 1;
                    jsonParse.labelArrow.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "arrow";
                    })
                    Annotations["labelArrow"] = jsonParse.labelArrow;
                }

                if (projectOutputs.circle) {
                    let count = 1;
                    jsonParse.labelCircles.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "circle";
                    })
                    Annotations["labelCircles"] = jsonParse.labelCircles;
                }

                if (projectOutputs.cuboid) {
                    let count = 1;
                    jsonParse.labelCuboid.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "cuboid";
                    })
                    Annotations["labelCuboid"] = jsonParse.labelCuboid;
                }

                if (projectOutputs.line) {
                    let count = 1;
                    jsonParse.labelLines.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "line";
                    })
                    Annotations["labelLines"] = jsonParse.labelLines;
                }

                if (projectOutputs.polygon) {
                    let count = 1;
                    jsonParse.labelPolygon.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "polygon";
                        // remove isHidden form lines also
                        let points = [];
                        item.Lines.forEach(line => points.push([line.Line.start.x, line.Line.start.y]));
                        delete item.Lines;
                        item.points = points;
                    })
                    Annotations["labelPolygon"] = jsonParse.labelPolygon;
                }

                if (projectOutputs.freehand) {
                    let count = 1;
                    jsonParse.labelFreeHand.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "freehand";
                    })
                    Annotations["labelFreeHand"] = jsonParse.labelFreeHand;
                }

                if (projectOutputs.paintbrush) {
                    let count = 1;
                    jsonParse.labelPaintBrush.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "paintbrush";
                    })
                    Annotations["labelPaintBrush"] = jsonParse.labelPaintBrush;
                }

                if (projectOutputs.segmentation) {
                    let count = 1;
                    jsonParse.labelSegmentation.forEach(item => {
                        delete item.isHidden;
                        delete item.annotationName;
                        item.id = count;
                        count++;
                        delete item.LabelId;
                        item["type"] = "segmentation";
                    })
                    Annotations["labelSegmentation"] = jsonParse.labelSegmentation;
                }
                let test = { "Annotations": [Annotations] }
                taskItem["layers"] = test;
                //taskItem["Annotations"] = Annotations;
                json.push(taskItem);
            }
            catch (err) {
                errorIds.push({ taskId, err });
            }
        }
    }
    console.error(errorIds);
    return json;
}


export async function GetTasksLogsDifferentFormat(taskIds, projectId) {
    let json = []
    let errorIds = [];
    if (projectId === undefined) {
        store.dispatch(setStatusBar(true, "error", "Project ID not Available"))
        return json;
    }
    let projectOutputs;
    try {
        let response = await API.GetProject(projectId)
        projectOutputs = response.projectOutput;
    }
    catch (error) {
        store.dispatch(setStatusBar(true, "error", "Project Details not Available"))
        console.error(error)
        return json;
    }
    if (taskIds.length > 0) {
        for (let i = 0; i < taskIds.length; i++) {
            let taskId = taskIds[i];
            try {
                let result = await API.GetTaskLogsById(taskId)
                let jsonParse = JSON.parse(result.AnnotationJSon)[0];
                let taskItem = {};
                taskItem["TaskId"] = taskId;
                let Annotations = {};
                let fileName = result.fileName ? result.fileName.replaceAll("\r", "") : "";
                let fileSize = result.fileSize ? result.fileSize : 0;
                let fileURL = jsonParse.ImageURL.replaceAll("\r", "")
                let fileData = {
                    filename: fileName,
                    size: fileSize,
                    regions: [],
                    file_attributes: {
                        caption: "",
                        public_domain: "no",
                        image_url: fileURL
                    }
                }

                let regions = []

                if (projectOutputs.box) {
                    jsonParse.labelRects.forEach(item => {
                        let rect = {
                            shape_attributes: {
                                name: "rect",
                                x: Math.ceil(item.Rect.x),
                                y: Math.ceil(item.Rect.y),
                                width: Math.ceil(item.Rect.width),
                                height: Math.ceil(item.Rect.height)
                            },
                            region_attributes: {
                                name: item.annotation
                            }
                        }
                        regions.push(rect);
                    })
                }

                if (projectOutputs.polygon) {
                    jsonParse.labelPolygon.forEach(item => {
                        let allX = [];
                        let allY = [];
                        item.Lines.forEach(line => {
                            allX.push(Math.ceil(line.Line.start.x))
                            allY.push(Math.ceil(line.Line.start.y))
                        });
                        allX.push(Math.ceil(item.Lines[0].Line.start.x))
                        allY.push(Math.ceil(item.Lines[0].Line.start.y))
                        let poly = {
                            shape_attributes: {
                                name: "polyline",
                                all_points_x: allX,
                                all_points_y: allY,
                            },
                            region_attributes: {
                                name: item.annotation
                            }
                        }
                        regions.push(poly);
                    })
                }

                fileData["regions"] = regions;
                Annotations[fileName+fileSize.toString()] = fileData;
                json.push(Annotations);
            }
            catch (err) {
                errorIds.push({ taskId, err });
            }
        }
    }
    console.error(errorIds);

    if(json.length === 1){
        json = json[0];
    }

    return json;
}

export function handleJsonDownload(json){
    let fileName = 'AnnotationData.json';
    // Create a blob of the data
    let data = JSON.stringify(json);
    let fileToSave = new Blob([data], {
        type: 'application/json',
        name: fileName
    });

    let url = window.URL || window.webkitURL;
    let link = url.createObjectURL(fileToSave);
    let a = document.createElement("a");
    a.download = fileName;
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function handleCSVDownload(csv) {
    let csv1 = "";
    let rows = Object.keys(csv[0]);

    csv1 = csv1 + (rows.join(",") + "\n");
    csv.forEach(task => {
        let jsonprocess = JSON.stringify(task[rows[1]])
        csv1 = csv1 + task[rows[0]] + "," + jsonprocess + "\n"
    }
    )

    let fileName = 'AnnotationData.csv';
    // Create a blob of the data
    let fileToSave = new Blob([csv1], {
        type: 'application/csv',
        name: fileName
    });

    let url = window.URL || window.webkitURL;
    let link = url.createObjectURL(fileToSave);
    let a = document.createElement("a");
    a.download = fileName;
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
