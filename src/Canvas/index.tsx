import React from 'react';
import Paths from '../Paths';
import { ExportImageType, Point } from '../typings';
import { CanvasProps } from './typings';
import { setViewBoxOnCanvas } from './utils';

/**
 * Default props for Canvas
 */
export const defaultProps: Partial<CanvasProps> = {
  width: '100%',
  height: '100%',
  className: '',
  canvasColor: 'white',
  background: '',
  allowOnlyPointerType: 'all',
  style: {
    border: '0.0625rem solid #9c9c9c',
    borderRadius: '0.25rem',
  },
  withTimeStamp: true,
};

/**
 * React Sketch Canvas's Canvas class
 *
 * This provides the base SVG element wrapped by a div element.
 * The div element handles the pointer events, and adds utility import and export functions
 */
export class Canvas extends React.Component<CanvasProps> {
  canvas: React.RefObject<HTMLDivElement>;

  static defaultProps = defaultProps;

  constructor(props: CanvasProps) {
    super(props);

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.exportImage = this.exportImage.bind(this);
    this.exportSvg = this.exportSvg.bind(this);

    this.canvas = React.createRef<HTMLDivElement>();
  }

  // Handle pointer up event outside canvas element.
  // Allows users to drag the sketch line outside canvas and return back to canvas without losing data
  componentDidMount(): void {
    document.addEventListener('pointerup', this.handlePointerUp);
  }

  componentWillUnmount(): void {
    document.removeEventListener('pointerup', this.handlePointerUp);
  }

  /**
   * Get coordinate of the pointer relative respective to the canvas and scroll position
   *
   * @param event React Pointer Event
   */
  getCoordinates(pointerEvent: React.PointerEvent<HTMLDivElement>): Point {
    const boundingArea = this.canvas.current?.getBoundingClientRect();

    const scrollLeft = window.scrollX ?? 0;
    const scrollTop = window.scrollY ?? 0;

    if (!boundingArea) {
      return { x: 0, y: 0 };
    }

    const point: Point = {
      x: pointerEvent.pageX - boundingArea.left - scrollLeft,
      y: pointerEvent.pageY - boundingArea.top - scrollTop,
    };

    return point;
  }

  /**
   * Handle mouse down event after verifying whether pointer type is allowed
   * This function calls onPointerDown prop with a point
   *
   * @param event React Pointer event
   */
  handlePointerDown(event: React.PointerEvent<HTMLDivElement>): void {
    // Allow only chosen pointer type
    const { allowOnlyPointerType, onPointerDown } = this.props;
    if (allowOnlyPointerType !== 'all' && event.pointerType !== allowOnlyPointerType) {
      return;
    }

    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const point = this.getCoordinates(event);

    onPointerDown(point);
  }

  /**
   * Handle mouse move event after verifying whether pointer type is allowed
   * This function calls onPointerMove prop with a point
   *
   * @param event React Pointer event
   */
  handlePointerMove(event: React.PointerEvent<HTMLDivElement>): void {
    const { isDrawing, allowOnlyPointerType, onPointerMove } = this.props;

    if (!isDrawing) return;

    // Allow only chosen pointer type
    if (allowOnlyPointerType !== 'all' && event.pointerType !== allowOnlyPointerType) {
      return;
    }

    const point = this.getCoordinates(event);

    onPointerMove(point);
  }

  /**
   * Handle mouse up event after verifying whether pointer type is allowed
   * This function calls onPointerUp prop
   *
   * @param event React Pointer event
   */
  handlePointerUp(event: React.PointerEvent<HTMLDivElement> | PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    // Allow only chosen pointer type
    const { allowOnlyPointerType, onPointerUp } = this.props;
    if (allowOnlyPointerType !== 'all' && event.pointerType !== allowOnlyPointerType) {
      return;
    }

    onPointerUp();
  }

  /* Mouse Handlers ends */

  /**
   * Export sketch as an image of given image type
   *
   * @param imageType Image type to export. JPEG or PNG
   */
  exportImage(imageType: ExportImageType): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const canvas = this.canvas.current;

        if (!canvas) {
          throw Error('Canvas not rendered yet');
        }

        const img = document.createElement('img');
        const { svgCanvas, width, height } = setViewBoxOnCanvas(canvas);

        img.src = `data:image/svg+xml;base64,${btoa(svgCanvas.outerHTML)}`;

        img.onload = () => {
          const renderCanvas = document.createElement('canvas');
          renderCanvas.setAttribute('width', width.toString());
          renderCanvas.setAttribute('height', height.toString());
          const context = renderCanvas.getContext('2d');

          if (!context) {
            throw Error('Canvas not rendered yet');
          }

          context.drawImage(img, 0, 0);

          resolve(renderCanvas.toDataURL(`image/${imageType}`));
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Export sketch on the canvas as SVG
   */
  exportSvg(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const canvas = this.canvas.current ?? null;

        if (canvas === null) {
          throw new Error('Canvas not rendered yet');
        }

        const { svgCanvas } = setViewBoxOnCanvas(canvas);
        resolve(svgCanvas.outerHTML);
      } catch (e) {
        reject(e);
      }
    });
  }

  /* Finally!!! Render method */
  render(): JSX.Element {
    const { width, height, className, canvasColor, background, style, paths } = this.props;

    return (
      <div
        role="presentation"
        ref={this.canvas}
        className={className}
        style={{
          ...style,
          touchAction: 'none',
          width,
          height,
        }}
        touch-action="none"
        onPointerDown={this.handlePointerDown}
        onPointerMove={this.handlePointerMove}
        onPointerUp={this.handlePointerUp}
      >
        <svg
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%',
            height: '100%',
            background: `${background} ${canvasColor}`,
          }}
        >
          <g id="canvasPenStrokes">
            <Paths paths={paths} />
          </g>
        </svg>
      </div>
    );
  }
}
