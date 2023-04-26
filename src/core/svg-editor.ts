import fs from 'fs';
import path from 'path';
import xml2js, { Builder } from 'xml2js';

export class SvgEditor {
  private readonly _svgId: string;
  private _svgFileNames: string[];
  private _builder: Builder;
  private _svgRoot = {
    svg: {
      $: {
        viewBox: '0 0 0 0',
        xmlns: 'http://www.w3.org/2000/svg'
      },
      defs: []
    }
  };

  constructor(svgId: string) {
    this._svgId = svgId;
    this._builder = new xml2js.Builder();

    this._createFolder();
    this._svgFileNames = this._getSvgFileNames();

    this._createSvgFile();
    this._saveIconsId();
  }

  private _createSvgFile(): void {
    for (const svgFileName of this._svgFileNames) {
      this._prepareContent(svgFileName);
    }

    this._writeContent();
  }

  private _prepareContent(svgFileName: string): void {
    xml2js.parseString(this._getFileContent(svgFileName), (_, result) => {
      result.svg.$.id = svgFileName.replace('.svg', '');
      this._svgRoot.svg.defs.push(result as never);
    });
  }

  private _getFileContent(fileName: string): string {
    return fs.readFileSync(
      path.join(process.env.SVG_FILES_PATH!, this._svgId, fileName),
      'utf-8'
    );
  }

  private _writeContent(): void {
    fs.writeFileSync(
      path.join(
        process.env.SVG_OUT_PATH!,
        this._svgId,
        `${this._svgId}.svg`
      ),
      this._builder.buildObject(this._svgRoot)
    );
  }

  private _createFolder(): void {
    fs.mkdirSync(path.join(process.env.SVG_OUT_PATH!, this._svgId), {
      recursive: true
    });
  }

  private _getSvgFileNames(): string[] {
    return fs.readdirSync(
      path.join(process.env.SVG_FILES_PATH!, this._svgId)
    );
  }

  private _saveIconsId(): void {
    fs.writeFileSync(
      path.join(
        process.env.SVG_OUT_PATH!,
        this._svgId,
        `${this._svgId}.ts`
      ),
      this._getIconsIdContent()
    );
  }

  private _getIconsIdContent(): string {
    return `export const ${this._svgId}Icons = [\n${this._svgFileNames
      .map((f) => f.replace('.svg', ''))
      .map((f) => f.replace(/-/g, '_'))
      .map((f) => `\t"${f}"`)
      .join(', \n')}\n];\n`;
  }

  static clearOutputFolder(): void {
    try {
      fs.rmSync(path.join(process.env.SVG_OUT_PATH!), { recursive: true });
    } catch (error) {
      console.error('No such directory.');
    }
  }
}
