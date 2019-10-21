import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../../core/custom-material.module';
import { MapContainerComponent } from './map.container';
import { ConsoleComponent } from './console/console.component';

@NgModule({
  declarations: [MapContainerComponent, ConsoleComponent],
  imports: [CustomMaterialModule, FormsModule, ReactiveFormsModule],
  exports: [MapContainerComponent],
})
export class MapModule { }
