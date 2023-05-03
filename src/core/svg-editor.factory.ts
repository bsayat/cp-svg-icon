import fs from 'fs';
import path from 'path';

import { SvgEditorEnum } from '../enums/svg-editor.enum';
import { PlainSvgEditor } from './plain-svg-editor';
import { TypedSvgEditor } from './typed-svg-editor';

export class SvgEditorFactory {
  createSvgEditor(type: SvgEditorEnum | null, svgId: string): PlainSvgEditor | TypedSvgEditor {
    let svgEditor: PlainSvgEditor | TypedSvgEditor;
    type = type ?? this._getType(svgId);

    switch (type) {
      case SvgEditorEnum.PLAIN_SVG:
        svgEditor = new PlainSvgEditor(svgId);
        break;
      case SvgEditorEnum.TYPED_SVG:
        svgEditor = new TypedSvgEditor(svgId);
        break;
      default:
        svgEditor = new PlainSvgEditor(svgId);
    }

    return svgEditor;
  }

  private _getType(svgId: string): SvgEditorEnum {
    return this._hasSvgFiles(svgId)
      ? SvgEditorEnum.PLAIN_SVG
      : SvgEditorEnum.TYPED_SVG;
  }

  private _hasSvgFiles(svgId: string): boolean {
    return fs
      .readdirSync(path.join(process.env.SVG_FILES_PATH!, svgId))[0]
      .includes('.svg');
  }
}
