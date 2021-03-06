import { EventNumber } from './event-number.model';
import { IModel } from './model.interface';

/** 垃圾房的数量统计信息 */
export class GarbageStationNumberStatistic implements IModel {
  /**	String	垃圾房ID	M */
  Id!: string;
  /**	String	垃圾房名称	M */
  Name!: string;
  /**	Int32	摄像机数量	M */
  CameraNumber!: number;
  /**	Int32	离线摄像机数量	M */
  OfflineCameraNumber!: number;
  /**	Int32	垃圾桶数量	M */
  TrashCanNumber!: number;
  /**	Int32	干垃圾满溢垃圾桶数量	M */
  DryTrashCanNumber!: number;
  /**	Int32	湿垃圾满溢垃圾桶数量	M */
  WetTrashCanNumber!: number;
  /**	Boolean	干垃圾满溢	O */
  DryFull?: boolean;
  /**	Boolean	湿垃圾满溢	O */
  WetFull?: boolean;
  /**	EventNumber[]	当日事件数量	O */
  TodayEventNumbers?: EventNumber[];
  /**	Double	当天总数量，单位：L	M */
  DayVolume!: number;
  /**	Double	当天干垃圾容量，单位：L	M */
  DayDryVolume!: number;
  /**	Double	当天湿垃圾容量，单位：L	M */
  DayWetVolume!: number;
  /**	Int32	垃圾房状态	M */
  StationState!: number;
  /**	Int32	评级	O */
  Garde?: number;
  /**	Int32	满溢时间，单位：分钟	O */
  FullDuration?: number;
  /**	Int32	当前垃圾堆数量	O */
  GarbageCount?: number;
  /**	Double	当前垃圾堆滞留时间，单位：分钟	O */
  CurrentGarbageTime?: number;
  /**	Double	当日垃圾滞留比值 有垃圾时长/没有垃圾的时长	O */
  GarbageRatio?: number;
  /**	Double	当日垃圾堆平均滞留时间，单位：分钟	O */
  AvgGarbageTime?: number;
  /**	Double	当日垃圾堆最大滞留时间，单位：分钟	O */
  MaxGarbageTime?: number;
  /**	Int32	当日最大滞留堆数量	O */
  MaxGarbageCount?: number;
  /**	Double	有垃圾时长，单位：分钟	O */
  GarbageDuration?: number;
  /**	Double	无垃圾时长，单位：分钟	O */
  CleanDuration?: number;
  /**	Int32	总处理任务数量	O */
  TotalTaskCount?: number;
  /**	Int32	完成任务数量	O */
  CompleteTaskCount?: number;
  /**	Int32	未完成任务数量	O */
  TimeoutTaskCount?: number;
}
