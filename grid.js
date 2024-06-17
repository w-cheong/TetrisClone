
console.log('loading grid.js')
export class Grid {

  /**
   *
   * @constructor
   * @param {HTMLCanvasElement} canvas The canvas that this grid gets drawn on
   * @param {number} gridWidth Number of cells horizontally
   * @param {number} gridHeight Number of cells vertically
   */
  constructor(canvas, gridWidth, gridHeight, showGridLines=true) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.gridCellWidth = this.canvas.width / gridWidth;
    this.gridCellHeight = this.canvas.height / gridHeight;
    this.gridStartX = 0;
    this.gridStartY = 0;
    this.showGridLines = showGridLines;
  }

  /**
   * Draws this Grid object onto its assigned canvas.
   * Clears canvas and redraws grid lines.
   */
  draw() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.showGridLines) {
      this.ctx.beginPath();
      for (let c = 0; c < this.gridWidth; c++) {
        for (let r = 0; r < this.gridHeight; r++) {
          this.ctx.strokeStyle = "gray";
          this.ctx.strokeRect(
            this.gridStartX + c * this.gridCellWidth,
            this.gridStartY + r * this.gridCellHeight,
            this.gridCellWidth,
            this.gridCellHeight);
        }
      }
      this.ctx.closePath();
    }
  }

  /**
   * Fill in a particular grid cell
   * @param {number} r row counted from bottom (1-indexed)
   * @param {number} c column counted from left (1-indexed)
   * @param {string} color string denoting the color to use
   */
  fillGridCell(r, c, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      this.gridStartX + this.gridCellWidth * (c - 1),
      this.gridStartY + this.gridCellHeight * (this.gridHeight - r),
      this.gridCellWidth,
      this.gridCellHeight);
    this.ctx.closePath();
  }
}
