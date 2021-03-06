/*
 * @Author: pmx
 * @Date: 2021-09-15 16:02:34
 * @Last Modified by: pmx
 * @Last Modified time: 2021-12-24 09:49:19
 */
import { NgModule } from '@angular/core';

import { AiopRoutingModule } from './aiop-routing.module';
import { AiopComponent } from './aiop.component';
import { AiopComponentsModule } from './components/aiop-components.module';

@NgModule({
  declarations: [AiopComponent],
  imports: [AiopRoutingModule, AiopComponentsModule],
})
export class AiopModule {}
