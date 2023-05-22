import 'zone.js/node';
import '@ng-web-apis/universal/mocks';
import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import * as compression from 'compression';

const domino = require('domino');
const fs = require('fs');
const path = require('path');
const isbot = require('isbot');
const morgan = require('morgan');



const distFolder = path.join(process.cwd(), 'dist/apps/ggj-aff-fe/browser');
const template = fs.readFileSync(path.join(distFolder, 'index.html')).toString();
const win = domino.createWindow(template.toString());

global['window'] = win;
global['document'] = win.document;
global['self'] = win
global['IDBIndex'] = win.IDBIndex
global['document'] = win.document
global['navigator'] = win.navigator
global['getComputedStyle'] = win.getComputedStyle
global['localStorage'] = win.localStorage


global['requestAnimationFrame'] = function(callback) {
  let lastTime = 0;
  const currTime = new Date().getTime();
  const timeToCall = Math.max(0, 16 - (currTime - lastTime));
  const id = setTimeout(function() { callback(currTime + timeToCall); },
    timeToCall);
  lastTime = currTime + timeToCall;
  return id as unknown as number;
};

global['cancelAnimationFrame'] = function(id) {
  clearTimeout(id);
};

import { AppServerModule } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();

  server.use(compression());
  server.use(morgan('common'));

  const distFolder = join(process.cwd(), 'dist/apps/ggj-aff-fe/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  
  isbot.extend(['Mozilla/5.0 (compatible; vkShare; +http://vk.com/dev/Share)', 'PostmanRuntime/7.25.0']);

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // TODO: implement data requests securely
  server.get('/api/**', (req, res) => {
    res.status(404).send('data requests are not yet supported');
  });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // Check whether app is accessed by a bot;
  // If bot - return as SSR;
  // otherwise return as SPA;
  server.get('*', (req: express.Request, res: express.Response) => {

    // url where the app is hosted (e.g. https://app-domain.com/);
    // will be useful for generating meta tags;
    const hostUrl = req.protocol + '://' + req.get('Host');

    // check whether User-Agent is bot
    if (isbot(req.header('User-Agent'))) {
      console.log(`SSR -- ${new Date().toUTCString()} -- ${req.header('User-Agent')}`);

      // render app page on the server
      res.render(indexHtml, { req, providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        // { provide: HOST_URL, useValue: hostUrl },
      ] });
    } else {
      console.log(`No SSR -- ${new Date().toUTCString()} -- ${req.header('User-Agent')}`);
      // return index.html without pre-rendering
      // app will get rendered on the client
      res.sendFile(path.join(__dirname, '../browser/index.html'));
    }
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';