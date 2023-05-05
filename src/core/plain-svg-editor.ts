import xml2js from 'xml2js';
import { SvgEditor } from './svg-editor';

export class PlainSvgEditor extends SvgEditor {
  constructor(svgId: string) {
    super(svgId);

    this._svgContent = this._prepareSvgRoot();
    this._createSvgFile();
  }

  protected _createSvgFile(): void {
    for (const svgFileName of this._svgFileNames) {
      this._prepareContent(svgFileName);
    }

    this._writeContent(this._svgContent);
  }

  protected _prepareContent(svgFileName: string): void {
    xml2js.parseString(this._getFileContent(svgFileName), (_, result) => {
      result.svg.$.id = svgFileName.replace(/-/g, '_').replace('.svg', '');
      this._svgContent.svg.defs.svg.push(result.svg as never);
    });
  }

  protected _prepareSvgRoot(): any {
    return {
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
  }
}
