export interface Point {
  /**
   * Line in a source file (1-indexed integer).
   */
  line: number;

  /**
   * Column in a source file (1-indexed integer).
   */
  column: number;
  /**
   * Character in a source file (0-indexed integer).
   */
  offset?: number;
}

export interface Data {
  [key: string]: unknown;
}

/**
 * Location of a node in a source file.
 */
export interface Position {
  /**
   * Place of the first character of the parsed source region.
   */
  start: Point;

  /**
   * Place of the first character after the parsed source region.
   */
  end: Point;

  /**
   * Start column at each index (plus start line) in the source region,
   * for elements that span multiple lines.
   */
  indent?: number[];
}

export interface Node {
  /**
   * The variant of a node.
   */
  type: string;

  /**
   * Information from the ecosystem.
   */
  data?: Data;

  /**
   * Location of a node in a source document.
   * Must not be present if a node is generated.
   */
  position?: Position;

  [key: string]: unknown;
}
