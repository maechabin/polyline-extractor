import { NgModule } from '@angular/core';

import { MapContainerComponent } from './map.container';
import { ConsoleComponent } from './console/console.component';

@NgModule({
  declarations: [MapContainerComponent, ConsoleComponent],
  exports: [MapContainerComponent],
})
export class MapModule {}
