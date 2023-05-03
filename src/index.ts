import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { SvgEditor } from './core/svg-editor';
import { SvgEditorFactory } from './core/svg-editor.factory';

const bootstrap = () => {
  dotenv.config();
  SvgEditor.clearOutputFolder();

  const svgFilesDir = fs.readdirSync(path.join(process.env.SVG_FILES_PATH!));
  const editorFactory = new SvgEditorFactory();
  for (const svgFileDir of svgFilesDir) {
    editorFactory.createSvgEditor(null, svgFileDir);
  }
};

bootstrap();
