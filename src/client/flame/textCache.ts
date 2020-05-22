/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

interface INode {
  text: string;
  nextOldest?: INode;
  x: number;
  y: number;
  width: number;
  row: number;
}

/**
 * An LRU cache that holds rendered text.
 */
export class TextCache {
  public readonly context: CanvasRenderingContext2D;
  private readonly cached = new Map<number, number>();
  public readonly charWidth: number;
  public readonly charHeight: number;
  private capacity = 128;

  constructor(font: string, color: string, private readonly scale: number) {
    const canvas = document.createElement('canvas');
    canvas.width = screen.width;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.context = canvas.getContext('2d')!;
    this.context.scale(scale, scale);
    this.context.font = font;

    const measure = getTextMeasure(font);
    this.charWidth = Math.ceil(measure.width); // add 1 for any aliasing
    this.charHeight = Math.ceil(measure.height);
    canvas.height = Math.ceil(this.charHeight * this.scale);
    canvas.width = Math.ceil((this.charWidth + 1) * this.scale) * this.capacity;
    this.context.scale(scale, scale);

    this.context.font = font;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'top';
    this.context.fillStyle = color;
  }

  /**
   * Draws text at the given position on the canvas.
   */
  public drawText(
    target: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    h = Math.min(this.charHeight, h);

    let xOffset = 0;
    for (let i = 0; i < text.length; i++) {
      if (xOffset >= w) {
        return;
      }

      const width = Math.min(this.charWidth, w - xOffset);
      target.drawImage(
        this.context.canvas,
        this.getCharCoordinate(text.charCodeAt(i)) * this.scale,
        0,
        width * this.scale,
        this.charHeight * this.scale,
        x + xOffset,
        y,
        width,
        h,
      );

      xOffset += this.charWidth * 1.03;
    }
  }

  private getCharCoordinate(charCode: number) {
    const cached = this.cached.get(charCode);
    if (cached !== undefined) {
      return cached;
    }

    if (this.cached.size === this.capacity) {
      const canvas = this.context.canvas;
      const existing = this.context.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width *= 2;
      this.capacity *= 2;
      this.context.putImageData(existing, 0, 0);
    }

    const x = this.cached.size * (this.charWidth + 1);
    this.cached.set(charCode, x);
    this.context.fillText(String.fromCharCode(charCode), x, 0);
    return x;
  }
}

// Borrowed from xterm: https://github.com/xtermjs/xterm.js/blob/19b73d2ba7a12b14b38dd6587c8a81df4f8bdd61/src/browser/services/CharSizeService.ts
const getTextMeasure = (font: string) => {
  const measureElement = document.createElement('span');
  measureElement.style.display = 'inline-block';
  measureElement.style.visibility = 'hidden';
  measureElement.style.position = 'absolute';
  measureElement.style.top = '0';
  measureElement.style.left = '-9999em';
  measureElement.style.lineHeight = 'normal';
  measureElement.classList.add('xterm-char-measure-element');
  measureElement.textContent = 'W';
  measureElement.setAttribute('aria-hidden', 'true');
  measureElement.style.font = font;
  document.body.appendChild(measureElement);

  const geometry = measureElement.getBoundingClientRect();
  return { width: geometry.width, height: geometry.height };
};
