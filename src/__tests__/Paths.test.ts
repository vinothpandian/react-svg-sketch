import { line } from '../Paths';
import { Point } from '../typings';

describe('Line', () => {
  it('should return length and angle', () => {
    const pointA: Point = {
      x: 0,
      y: 0,
    };

    const pointB: Point = {
      x: 0,
      y: 0,
    };

    const result = line(pointA, pointB);

    const expected = {
      length: 0,
      angle: 0,
    };

    expect(result).toEqual(expected);
  });
});
