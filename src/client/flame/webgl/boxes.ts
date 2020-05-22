/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { IBox, IBounds, ICanvasSize, Constants } from '../flame-graph';
import vertexShaderSource from './box.vert';
import fragmentShaderSource from './box.frag';

const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error(`Failed creating shader ${type}`);
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  const log = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error(`Shader creation failed (${log || 'unknown'})`);
};

const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) => {
  const program = gl.createProgram();
  if (!program) {
    throw new Error(`Failed creating program`);
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  const log = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw new Error(`Program creation failed (${log || 'unknown'})`);
};

interface IOptions {
  scale: number;
  canvas: HTMLCanvasElement;
  focusColor: string;
  boxes: ReadonlyArray<IBox>;
}

export const setupGl = ({
  scale: initialScale,
  canvas,
  boxes: initialBoxes,
  focusColor,
}: IOptions) => {
  // Get A WebGL context
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    return;
  }

  const boxProgram = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource),
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource),
  );

  const boxAttributeLocation = gl.getAttribLocation(boxProgram, 'boxes');
  const boxBuffer = gl.createVertexArray();

  let vertexCount = 0;
  const setBoxes = (boxes: ReadonlyArray<IBox>) => {
    const boxesBuffer = gl.createBuffer();

    vertexCount = boxes.length * 6;
    const positions = new Float32Array(vertexCount * 4);

    let k = 0;
    for (const box of boxes) {
      // top left:
      positions[k++] = box.x1;
      positions[k++] = box.y1 - Constants.BoxHeight;
      positions[k++] = box.loc.graphId;
      positions[k++] = box.loc.category;

      // top right:
      positions[k++] = box.x2;
      positions[k++] = box.y1 - Constants.BoxHeight;
      positions[k++] = box.loc.graphId;
      positions[k++] = box.loc.category;

      // bottom left:
      positions[k++] = box.x1;
      positions[k++] = box.y2 - 1 - Constants.BoxHeight;
      positions[k++] = box.loc.graphId;
      positions[k++] = box.loc.category;

      // bottom left (triangle 2):
      positions[k++] = box.x1;
      positions[k++] = box.y2 - 1 - Constants.BoxHeight;
      positions[k++] = box.loc.graphId;
      positions[k++] = box.loc.category;

      // top right (triangle 2):
      positions[k++] = box.x2;
      positions[k++] = box.y1 - Constants.BoxHeight;
      positions[k++] = box.loc.graphId;
      positions[k++] = box.loc.category;

      // bottom right:
      positions[k++] = box.x2;
      positions[k++] = box.y2 - 1 - Constants.BoxHeight;
      positions[k++] = box.loc.graphId;
      positions[k++] = box.loc.category;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, boxesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.bindVertexArray(boxBuffer);
    gl.enableVertexAttribArray(boxAttributeLocation);
    gl.vertexAttribPointer(boxAttributeLocation, 4, gl.FLOAT, false, 0, 0);
  };

  /**
   * Redraws the set of arrays on the screen.
   */
  const redraw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  };

  const boundsLocation = gl.getUniformLocation(boxProgram, 'bounds');
  const hoveredLocation = gl.getUniformLocation(boxProgram, 'hovered');
  const focusedLocation = gl.getUniformLocation(boxProgram, 'focused');
  const focusColorLocation = gl.getUniformLocation(boxProgram, 'focus_color');

  /**
   * Update the bound size of the canvas.
   */
  const setBounds = (bounds: IBounds, size: ICanvasSize, scale: number) => {
    gl.viewport(0, 0, scale * size.width, scale * size.height);
    gl.uniform4f(boundsLocation, bounds.minX, bounds.y, bounds.maxX, bounds.y + size.height);
  };

  const setFocusColor = (color: string) => {
    const inner = /rgba?\((.*)+\)/.exec(color);
    if (inner) {
      const [r, g, b, a = 255] = inner[1]
        .split(',')
        .map((v, i) => Number(v.trim()) / (i < 3 ? 255 : 1));
      gl.uniform4f(focusColorLocation, r, g, b, a);
    }
  };

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.useProgram(boxProgram);
  setBounds({ minX: 0, maxX: 1, y: 0, level: 0 }, { width: 100, height: 100 }, initialScale);
  setBoxes(initialBoxes);
  setFocusColor(focusColor);
  redraw();

  return {
    redraw,
    setHovered: (graphId = -1) => {
      gl.uniform1i(hoveredLocation, graphId);
      redraw();
    },
    setFocused: (graphId = -1) => {
      gl.uniform1i(focusedLocation, graphId);
      redraw();
    },
    setFocusColor: (color: string) => {
      setFocusColor(color);
      redraw();
    },
    setBounds: (bounds: IBounds, size: ICanvasSize, scale: number) => {
      setBounds(bounds, size, scale);
      redraw();
    },
    setBoxes: (boxes: ReadonlyArray<IBox>) => {
      setBoxes(boxes);
      redraw();
    },
  };
};
