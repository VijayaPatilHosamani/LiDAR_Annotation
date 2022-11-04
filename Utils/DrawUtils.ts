import { IPoint, IRect } from "../Types/Interfaces";

export class DrawUtils {
  public static clearCanvas(canvas: HTMLCanvasElement): void {
    let ctx: CanvasRenderingContext2D | null;
    ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  public static drawDot(
    canvas: HTMLCanvasElement,
    dot: IPoint,
    color: string = "#111",
    thickness: number = 5
  ): void {
    let ctx: CanvasRenderingContext2D | null;
    ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, thickness, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  public static drawRectWithFill(
    canvas: HTMLCanvasElement,
    rect: IRect,
    color: string = "#111"
  ): void {
    let ctx: CanvasRenderingContext2D | null;
    ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.fill();
      ctx.restore();
    }
  }

  public static drawCircle(
    canvas: HTMLCanvasElement,
    startPoint: IPoint,
    endPoint: IPoint,
    imageStart: IPoint,
    imageEnd: IPoint,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      let x1x2 = endPoint.x - startPoint.x;
      let y1y2 = endPoint.y - startPoint.y;

      let imagex1x2 = imageEnd.x - imageStart.x;
      let imagey1y2 = imageEnd.y - imageStart.y;

      ctx.arc(
        startPoint.x,
        startPoint.y,
        Math.sqrt(x1x2 * x1x2 + y1y2 * y1y2),
        0,
        2 * Math.PI
      );

      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.arc(startPoint.x, startPoint.y, thickness, 0, 2 * Math.PI);

      ctx.font = "13px Arial";
      ctx.fillStyle = color;
      ctx.fillText(
        "r" +
        Math.sqrt(imagex1x2 * imagex1x2 + imagey1y2 * imagey1y2)
          .toFixed(2)
          .toString(),
        startPoint.x + 10,
        startPoint.y + 10
      );

      ctx.stroke();
      ctx.restore();
    }
  }

  public static getMeasurement(startPoint: IPoint, endPoint: IPoint): string {
    var str =
      Math.abs(startPoint.x - endPoint.x)
        .toFixed(2)
        .toString() +
      " x " +
      Math.abs(startPoint.y - endPoint.y)
        .toFixed(2)
        .toString();
    return str;
  }

  public static drawLineCuboid(
    canvas: HTMLCanvasElement,
    startPoint: IPoint,
    endPoint: IPoint,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x + 1, endPoint.y + 1);

      ctx.stroke();
      ctx.restore();
    }
  }

  public static drawLineFreehand(
    canvas: HTMLCanvasElement,
    startPoint: IPoint,
    endPoint: IPoint,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x + 1, endPoint.y + 1);

      ctx.stroke();
      ctx.restore();
    }
  }

  public static drawLinePaintBrush(
    canvas: HTMLCanvasElement,
    startPoint: IPoint,
    endPoint: IPoint,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x + 1, endPoint.y + 1);

      ctx.stroke();
      ctx.restore();
    }
  }

  public static drawLinePolygon(
    canvas: HTMLCanvasElement,
    startPoint: IPoint,
    endPoint: IPoint,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x + 1, endPoint.y + 1);

      ctx.stroke();
      ctx.restore();
    }
  }

  public static drawPolygon(
    canvas: HTMLCanvasElement,
    points: Array<any>,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx && points !== undefined && points.length > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      // ctx.save();
      ctx.fillStyle = color;//"rgba(85, 175, 129, 0.52)";
      ctx.beginPath();
      ctx.moveTo(points[0].start.x, points[0].start.y);
      for (let index = 0; index < points.length; index++) {
        ctx.lineTo(points[index].end.x, points[index].end.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  public static drawLineArrow(
    canvas: HTMLCanvasElement,
    startPoint: IPoint,
    endPoint: IPoint,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x + 1, endPoint.y + 1);
      ctx.stroke();
      ctx.restore();
    }
  }


  public static drawCrossHair(
    canvas: HTMLCanvasElement,
    startPoint: IPoint,
    endPoint: IPoint,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x + 1, endPoint.y + 1);

      ctx.font = "13px Arial";
      ctx.fillStyle = color;
      // ctx.fillText(
      //   this.getMeasurement(startPoint, endPoint),
      //   (startPoint.x + endPoint.x) / 2 + 10,
      //   (endPoint.y + startPoint.y) / 2 + 12
      // );

      ctx.stroke();
      ctx.restore();
    }
  }


  public static drawLine(
    canvas: HTMLCanvasElement,
    startPoint: IPoint,
    endPoint: IPoint,
    imageStart: IPoint,
    imageEnd: IPoint,
    color: string = "#111111",
    thickness: number = 2
  ): void {
    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x + 1, endPoint.y + 1);

      ctx.font = "13px Arial";
      ctx.fillStyle = color;
      ctx.fillText(
        this.getMeasurement(imageStart, imageEnd),
        (startPoint.x + endPoint.x) / 2 + 10,
        (endPoint.y + startPoint.y) / 2 + 12
      );

      ctx.stroke();
      ctx.restore();
    }
  }

  public static drawRect(
    canvas: HTMLCanvasElement,
    box: IRect,
    imageBox: IRect,
    color: string = "#000",
    thickness: number = 1
  ): void {
    let ctx: CanvasRenderingContext2D | null;
    ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.width, box.height);

      ctx.font = "13px Arial";
      ctx.fillStyle = color;

      ctx.fillText(
        imageBox.width.toFixed(0).toString() +
        "x" +
        imageBox.height.toFixed(0).toString(),
        box.x + box.width / 2,
        box.y + box.height / 2
      );

      ctx.stroke();
      ctx.restore();
    }
  }

  public static sharpen(ctx: any, w: any, h: any, mix: any) {
    var x,
      sx,
      sy,
      r,
      g,
      b,
      dstOff,
      srcOff,
      wt,
      cx,
      cy,
      scy,
      scx,
      weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
      katet = Math.round(Math.sqrt(weights.length)),
      half = (katet * 0.5) | 0,
      dstData = ctx.createImageData(w, h),
      dstBuff = dstData.data,
      srcBuff = ctx.getImageData(0, 0, w, h).data,
      y = h;

    while (y--) {
      x = w;
      while (x--) {
        sy = y;
        sx = x;
        dstOff = (y * w + x) * 4;
        r = 0;
        g = 0;
        b = 0;

        for (cy = 0; cy < katet; cy++) {
          for (cx = 0; cx < katet; cx++) {
            scy = sy + cy - half;
            scx = sx + cx - half;

            if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
              srcOff = (scy * w + scx) * 4;
              wt = weights[cy * katet + cx];

              r += srcBuff[srcOff] * wt;
              g += srcBuff[srcOff + 1] * wt;
              b += srcBuff[srcOff + 2] * wt;
            }
          }
        }

        dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
        dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
        dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
        dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
      }
    }

    ctx.putImageData(dstData, 0, 0);
  }

  public static blur() { }

  public static applySharpen(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    imageRect: IRect | null,
    val: any
  ): void {
    if (image && canvas && imageRect) {
      let ctx: CanvasRenderingContext2D | null;
      ctx = canvas.getContext("2d");
      this.sharpen(ctx, ctx?.canvas.width, ctx?.canvas.height, val);
    }
  }

  //contrast
  public static applyBlur(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    imageRect: IRect | null): void {
    if (image && canvas && imageRect) {
      let ctx: CanvasRenderingContext2D | null;
      ctx = canvas.getContext("2d");
      var imgd: any = ctx?.getImageData(
        imageRect.x,
        imageRect.y,
        imageRect.width,
        imageRect.height
      );

      let delta = 1 / 9;
      let weights = [
        delta,
        delta,
        delta,
        delta,
        delta,
        delta,
        delta,
        delta,
        delta,
      ];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);
      var src = imgd.data;
      var sw: any = ctx?.canvas.width;
      var sh: any = ctx?.canvas.height;
      // pad output by the convolution matrix
      var w: any = sw;
      var h: any = sh;
      var output = imgd; // Filters.createImageData(w, h);
      var dst = output.data;
      // go through the destination image pixels
      var alphaFac = true ? 1 : 0;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var sy = y;
          var sx = x;
          var dstOff = (y * w + x) * 4;
          // calculate the weighed sum of the source image pixels that
          // fall under the convolution matrix
          var r = 0,
            g = 0,
            b = 0,
            a = 0;
          for (var cy = 0; cy < side; cy++) {
            for (var cx = 0; cx < side; cx++) {
              var scy = sy + cy - halfSide;
              var scx = sx + cx - halfSide;
              if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                var srcOff = (scy * sw + scx) * 4;
                var wt = weights[cy * side + cx];
                r += src[srcOff] * wt;
                g += src[srcOff + 1] * wt;
                b += src[srcOff + 2] * wt;
                a += src[srcOff + 3] * wt;
              }
            }
          }
          dst[dstOff] = r;
          dst[dstOff + 1] = g;
          dst[dstOff + 2] = b;
          dst[dstOff + 3] = a + alphaFac * (255 - a);
        }
      }

      //contrast
      //   let contrast = val * 2.55;
      //   var factor = (255 + contrast) / (255.01 - contrast);
      //   for (var i = 0; i < imgd.data.length; i += 4) {
      //     imgd.data[i] = factor * (imgd.data[i] - 128) + 128; //r value
      //     imgd.data[i + 1] = factor * (imgd.data[i + 1] - 128) + 128; //g value
      //     imgd.data[i + 2] = factor * (imgd.data[i + 2] - 128) + 128; //b value
      //   }

      //brightness
      //   for (var i = 0; i < imgd.data.length; i += 4) {
      //       imgd.data[i] += val;
      //       imgd.data[i+1] += val;
      //       imgd.data[i+2] += val;
      //   }

      // this.blur(ctx, ctx?.canvas.width, ctx?.canvas.height, val);
      ctx?.clearRect(
        imageRect.x,
        imageRect.y,
        imageRect.width,
        imageRect.height
      );
      ctx?.putImageData(imgd, imageRect.x, imageRect.y);
    }
  }

  public static applyBrightness(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    imageRect: IRect | null,
    val: any
  ): void {
    if (image && canvas && imageRect) {
      let ctx: CanvasRenderingContext2D | null;
      ctx = canvas.getContext("2d");
      var imgd: any = ctx?.getImageData(
        0,//image.x,
        0,//image.y,
        canvas.width,//image.width,
        canvas.height//image.height
      );
      //brightness
      for (var i = 0; i < imgd.data.length; i += 4) {
        imgd.data[i] += val;
        imgd.data[i + 1] += val;
        imgd.data[i + 2] += val;
      }
      ctx?.putImageData(imgd, image.x, image.y);
    }
  }

  public static applyContrast(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    imageRect: IRect | null,
    val: any
  ): void {
    if (image && canvas && imageRect) {
      let ctx: CanvasRenderingContext2D | null;
      ctx = canvas.getContext("2d");
      var imgd: any = ctx?.getImageData(
        0,//image.x,
        0,//image.y,
        canvas.width,//image.width,
        canvas.height//image.height
      );

      //contrast
      let contrast = val * 2.55;
      var factor = (255 + contrast) / (255.01 - contrast);
      for (var i = 0; i < imgd.data.length; i += 4) {
        imgd.data[i] = factor * (imgd.data[i] - 128) + 128; //r value
        imgd.data[i + 1] = factor * (imgd.data[i + 1] - 128) + 128; //g value
        imgd.data[i + 2] = factor * (imgd.data[i + 2] - 128) + 128; //b value
      }
      ctx?.putImageData(imgd, image.x, image.y);
    }
  }

  private static applyGrayScale(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    imageRect: IRect | null): void {
    if (image && canvas && imageRect) {
      let ctx: CanvasRenderingContext2D | null;
      ctx = canvas.getContext("2d");
      var imgd: any = ctx?.getImageData(
        0,//image.x,
        0,//image.y,
        canvas.width,//image.width,
        canvas.height//image.height
      );
      for (var i = 0; i < imgd.data.length; i += 4) {
        var r = imgd.data[i];
        var g = imgd.data[i + 1];
        var b = imgd.data[i + 2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        imgd.data[i] = imgd.data[i + 1] = imgd.data[i + 2] = v;
      }
      ctx?.putImageData(imgd, image.x, image.y);
    }
  }

  public static appyEffects(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    imageRect: IRect | null,
    obj: any
  ): void {
    if (obj.sharpen < 1 && obj.sharpen > 0) {
      this.applySharpen(canvas, image, imageRect, obj.sharpen);
    }
    if (obj.blur === 1) {
      this.applyBlur(canvas, image, imageRect);
    }
    if (obj.grayScale === 1) {
      this.applyGrayScale(canvas, image, imageRect);
    }

    if (obj.brightness >= 10 && obj.brightness < 200) {
      this.applyBrightness(canvas, image, imageRect, obj.brightness);
    }
    if (obj.contrast > 0 && obj.contrast < 255) {
      this.applyContrast(canvas, image, imageRect, obj.contrast);
    }
  }

  public static drawImage(
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null,
    imageRect: IRect | null
  ): void {
    if (image && canvas && imageRect) {
      let ctx: CanvasRenderingContext2D | null;
      ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          image,
          0, // imageRect.x,
          0, // imageRect.y,
          //imageRect.width,
          //imageRect.height
          canvas.width,
          canvas.height
        );
      }
    }
  }
}
