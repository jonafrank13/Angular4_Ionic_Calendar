import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  NavController,
  NavParams,
} from "ionic-angular";
import moment from "moment";

const ONE: number = 1;
const SIX: number = 6;
const ONE_WEEK: number = 7;

@Component({
  selector: "simple-calendar",
  templateUrl: "simple-calendar.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleCalendar {

  days: string[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  selectedDate: Date;
  visitingDate: Date = new Date();
  today: any = new Date().getDate();
  moveCount: number = 0;
  calendarMatrix: any = [];
  @Input() type: string = "full";
  @Input() eventDates: Date[] = [];
  @Output() selectedDateChanged = new EventEmitter();
  @Output() startDateChanged = new EventEmitter();
  @Output() endDateChanged = new EventEmitter();
  classes: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private ref: ChangeDetectorRef) {}
  ngOnInit() {
    this.selectedDate = new Date();
    this.calendarMatrix = this.getCalendarMatrix(new Date());
  }

  private getCalendarMatrix(date: Date) {
    const calendarMatrixLocal = [];

    let startDate = (this.type === "full") ? new Date(date.getFullYear(),
      date.getMonth(), ONE) : new Date(date);
    const stopDate = (this.type === "full") ? new Date(date.getFullYear(),
      date.getMonth() + ONE, 0) : new Date(date);

    const startDow = (startDate.getDay() + SIX) % ONE_WEEK;
    const endDow = (stopDate.getDay() + SIX) % ONE_WEEK;

    startDate.setDate(startDate.getDate() - startDow);
    stopDate.setDate(stopDate.getDate() + (SIX - endDow));
    let week = [];

    while (startDate <= stopDate) {
      week.push(new Date(startDate));
      if (week.length === ONE_WEEK) {
        calendarMatrixLocal.push(week);
        week = [];
      }
      startDate = new Date(startDate.setDate(startDate.getDate() + ONE));
    }
    return calendarMatrixLocal;
  }

  private calendarPrevious() {
    this.visitingDate = (this.type === "full") ?
      this.prevMonth(this.visitingDate) : (this.type === "week") ?
      this.prevWeek(this.visitingDate) : this.prevDay(this.visitingDate);
    this.moveCount -= ONE;
    this.selectDate(this.visitingDate);
    this.calendarMatrix = this.getCalendarMatrix(this.visitingDate);
    this.startDateChanged.emit(this.calendarStartDate);
    this.endDateChanged.emit(this.calendarStopDate);
    this.ref.markForCheck();
  }

  private prevMonth(date) {
    const tmpMonth = date.getMonth() - ONE;
    return new Date(date.setMonth(tmpMonth));
  }

  private prevWeek(date) {
    const tmpWeek = date.getDate() - ONE_WEEK;
    return new Date(date.setDate(tmpWeek));
  }

  private prevDay(date) {
    const tmpDay = date.getDate() - ONE;
    return new Date(date.setDate(tmpDay));
  }

  private calendarNext() {
    this.visitingDate = (this.type === "full") ?
      this.nextMonth(this.visitingDate) : (this.type === "week") ?
      this.nextWeek(this.visitingDate) : this.nextDay(this.visitingDate);
    this.moveCount += ONE;
    this.selectDate(this.visitingDate);
    this.selectedDate = this.visitingDate;
    this.calendarMatrix = this.getCalendarMatrix(this.visitingDate);
    this.startDateChanged.emit(this.calendarStartDate);
    this.endDateChanged.emit(this.calendarStopDate);
    this.ref.markForCheck();
  }

  private nextMonth(date) {
    const tmpMonth = date.getMonth() + ONE;
    return new Date(date.setMonth(tmpMonth));
  }

  private nextWeek(date) {
    const tmpWeek = date.getDate() + ONE_WEEK;
    return new Date(date.setDate(tmpWeek));
  }

  private nextDay(date) {
    const tmpDay = date.getDate() + ONE;
    return new Date(date.setDate(tmpDay));
  }

  private resetCalendar() {
    this.visitingDate = new Date();
    this.moveCount = 0;
    this.calendarMatrix = this.getCalendarMatrix(this.visitingDate);
    this.selectedDate = this.visitingDate;
    this.selectedDateChanged.emit(this.selectedDate);
    this.ref.markForCheck();
  }

  private formatDate(date: Date) {
    return (this.type !== "day") ? moment(date).format("MMM YYYY") :
      moment(date).format("dddd MMMM Do YYYY");
  }

  private hideCalendar() {
    return this.type === "day";
  }

  private selectDate(date) {
    this.selectedDate = date;
    this.selectedDateChanged.emit(date);
    this.ref.markForCheck();
  }

  private isCurrentDate(date) {
    return date != null && moment(date).format("MMM Do YY") === moment(
      new Date()).format("MMM Do YY");
  }

  private isSelectedDate(date) {
    return date === this.selectedDate;
  }

  private isDiffMonth(date) {
    return moment(date).format("MMM") !== moment(this.visitingDate).format(
      "MMM");
  }

  private showReset() {
    return this.moveCount !== 0;
  }

  private hasEvent(date) {
    if (this.eventDates.length > 0) {
      for (const eventDateKey in this.eventDates) {
        if (this.eventDates.hasOwnProperty(eventDateKey)) {
          const eventDate = new Date(this.eventDates[eventDateKey]);
          if (eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate()) {
            return true;
          }
        }
      }
    }
    return false;
  }
  private getClasses(date, index) {
    this.classes.splice(0, this.classes.length);
    if (this.isCurrentDate(date)) {
      this.classes.push('calendar-current-date');
    }
    if (this.isSelectedDate(date)) {
      this.classes.push('calendar-selected-date');
    }
    if (this.isDiffMonth(date)) {
      this.classes.push('calendar-diff-month');
    }
    if (this.hasEvent(date)) {
      this.classes.push('calendar-has-event');
    }
    const sundayIndex = 6;
    if (index === sundayIndex) {
      this.classes.push('calendar-sunday');
    }
    return this.classes;
  }
  get visitingDateDisplay() {
    return (this.type !== 'day') ?
      moment(this.visitingDate).format('MMM YYYY') :
      moment(this.visitingDate).format('dddd MMMM Do YYYY');
  }
  get calendarStartDate() {
    return new Date(this.calendarMatrix[0][0]);
  }
  get calendarStopDate() {
    return new Date(this.calendarMatrix[this.calendarMatrix.length - 1][
      SIX
    ]);
  }
}
