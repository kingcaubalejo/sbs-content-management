/**
 * 
 *  Encountered this error whenever running `ng serve` in a ssr setup.
 *  Error: NG0401: Missing Platform: 
 *      This may be due to using `bootstrapApplication` on the server without passing a `BootstrapContext`. 
 *      Please make sure that `bootstrapApplication` is called with a `context` argument.
 * 
 *  Fix: https://angular.dev/errors/NG0401
 */


import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
