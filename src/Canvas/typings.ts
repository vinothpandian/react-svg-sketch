import { Point, ReactSketchCanvasPath } from '../typings';

export type CanvasProps = {
  paths: ReactSketchCanvasPath[];
  isDrawing: boolean;
  className: string;
  onPointerDown: (point: Point) => void;
  onPointerMove: (point: Point) => void;
  onPointerUp: () => void;
  width: string;
  height: string;
  canvasColor: string;
  background: string;
  allowOnlyPointerType: string;
  style: React.CSSProperties;
  withTimeStamp?: boolean;
};
