import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { SimpleCalendar } from "./simple-calendar";

@NgModule({
  declarations: [
    SimpleCalendar,
  ],
  imports: [
    IonicPageModule.forChild(SimpleCalendar),
  ],
  exports: [
    SimpleCalendar,
  ],
})
export class SimpleCalendarModule {}
