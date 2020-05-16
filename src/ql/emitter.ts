/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

const lineEndings = new Set(';{};');

export class CodeEmitter {
  private indent = '  ';
  private indentCount = 0;
  private uniqueEmits = new Set<symbol>();

  constructor(private code: string = '') {}

  public emitOnce(identifier: symbol, ...snippets: string[]) {
    if (!this.uniqueEmits.has(identifier)) {
      this.emit(...snippets);
      this.uniqueEmits.add(identifier);
    }
  }

  public emit(...snippets: string[]) {
    for (const code of snippets) {
      if (code.startsWith('}')) {
        this.indentCount = Math.max(0, this.indentCount - 1);
      }

      if (lineEndings.has(this.code[this.code.length - 1])) {
        this.code += '\n' + this.indent.repeat(this.indentCount);
      }
      this.code += code;

      if (code.endsWith('{')) {
        this.indentCount++;
      }
    }
  }

  public toString() {
    return this.code;
  }
}
