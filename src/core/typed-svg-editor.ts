import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

import { SvgEditor } from './svg-editor';

export class TypedSvgEditor extends SvgEditor {
  private _types: Set<string> = new Set();

  constructor(svgId: string) {
    super(svgId);

    this._prepareTypes();
    this._svgContent = this._prepareSvgRoot();
    this._createSvgFile();
  }

  protected _prepareSvgRoot(): any {
    return Array.from(this._types).reduce(
      (prevValue: { [key: string]: any }, curValue) => {
        prevValue[curValue] = {
          svg: {
            $: {
              viewBox: '0 0 0 0',
              xmlns: 'http://www.w3.org/2000/svg'
            },
            defs: {
              svg: []
            }
          }
        };
        return prevValue;
      },
      {}
    );
  }

  protected _createSvgFile(): void {
    this._svgFileNames.forEach((fileName: string) => {
      this._types.forEach((type) => {
        this._prepareContent(`${fileName}/${type}`);
      });
    });

    this._types.forEach((type) =>
      this._writeContent(this._svgContent[type], type)
    );
  }

  protected _prepareContent(svgFileName: string): void {
    const [fileName, type] = svgFileName.split('/');

    xml2js.parseString(
      this._getFileContent(`${svgFileName}.svg`),
      (_, result) => {
        result.svg.$.id = fileName;
        this._svgContent[type].svg.defs.svg.push(result.svg as never);
      }
    );
  }

  private _prepareTypes(): void {
    for (const name of this._svgFileNames) {
      const types = this._getTypesOfCurrentFile(name);

      for (const type of types) {
        this._types.add(type.replace('.svg', ''));
      }
    }
  }

  private _getTypesOfCurrentFile(name: string): string[] {
    return fs.readdirSync(
      path.join(process.env.SVG_FILES_PATH!, this._svgId, name)
    );
  }
}
