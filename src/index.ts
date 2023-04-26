import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { SvgEditor } from './core/svg-editor';

const bootstrap = () => {
  dotenv.config();
  SvgEditor.clearOutputFolder();

  const svgFilesDir = fs.readdirSync(path.join(process.env.SVG_FILES_PATH!));
  for (const svgFileDir of svgFilesDir) {
    if (svgFileDir.includes('feather')) {
      new SvgEditor(svgFileDir);
    }
  }
};

bootstrap();
