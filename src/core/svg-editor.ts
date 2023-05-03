import fs from 'fs';
import path from 'path';
import xml2js, { Builder } from 'xml2js';

export abstract class SvgEditor {
  protected readonly _svgId: string;
  protected _svgFileNames: string[];
  protected _builder: Builder;
  protected _svgContent: any;

  constructor(svgId: string) {
    this._svgId = svgId;
    this._builder = new xml2js.Builder();

    this._createRootFolder();
    this._svgFileNames = this._getSvgFileNames();
    this._saveIconsId();
  }

  protected abstract _prepareSvgRoot(): any;
  protected abstract _createSvgFile(): void;
  protected abstract _prepareContent(svgFileName: string): void;

  protected _getFileContent(fileName: string): string {
    return fs.readFileSync(
      path.join(process.env.SVG_FILES_PATH!, this._svgId, fileName),
      'utf-8'
    );
  }

  // this methods will be in this class
  private _createRootFolder(folderName?: string): void {
    fs.mkdirSync(
      path.join(process.env.SVG_OUT_PATH!, folderName ?? this._svgId),
      {
        recursive: true
      }
    );
  }

  private _getSvgFileNames(): string[] {
    return fs.readdirSync(path.join(process.env.SVG_FILES_PATH!, this._svgId));
  }

  private _saveIconsId(): void {
    fs.writeFileSync(
      path.join(process.env.SVG_OUT_PATH!, this._svgId, `${this._svgId}.ts`),
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

  protected _writeContent(content: any, fileName?: string): void {
    fs.writeFileSync(
      path.join(process.env.SVG_OUT_PATH!, this._svgId, `${fileName ?? this._svgId}.svg`),
      this._builder.buildObject(content)
    );
  }

  static clearOutputFolder(): void {
    try {
      fs.rmSync(path.join(process.env.SVG_OUT_PATH!), { recursive: true });
    } catch (error) {
      console.error('No such directory.');
    }
  }
}
