export default class DisplateItem {
  itemCollectionId: string;
  title: string;
  url: string;

  startDate: Date;
  endDate: Date;
  status: DisplateStatus;
  numberAvailable: number;
  initialAvailable: number;
  type: DisplateType;
  format: DisplateFormat;
  timeToStart = -1;

  imageUrl: string;

  constructor(data: any) {
    this.itemCollectionId = data.itemCollectionId.toString();
    this.title = data.title;
    this.url = data.url;

    this.startDate = new Date(data.edition.startDate);
    this.endDate = new Date(data.edition.endDate);

    const _status = data.edition.status;
    if (_status == "active") {
      this.status = DisplateStatus.ACTIVE;
    } else if (_status == "upcoming") {
      this.status = DisplateStatus.UPCOMING;
      this.timeToStart = data.edition.timeToStart;
    } else if (_status == "sold_out") {
      this.status = DisplateStatus.SOLD_OUT;
    } else {
      this.status = DisplateStatus.UNKNOWN;
    }

    this.numberAvailable = data.edition.available;
    this.initialAvailable = data.edition.size;

    const _type = data.edition.type;
    if (_type == "standard") {
      this.type = DisplateType.STANDARD;
    } else if (_type == "ultra") {
      this.type = DisplateType.ULTRA;
    } else {
      this.type = DisplateType.UNKNOWN;
    }

    const _format = data.edition.format;
    if (_format == "M") {
      this.format = DisplateFormat.MEDIUM;
    } else if (_format == "L") {
      this.format = DisplateFormat.LARGE;
    } else if (_format == "XL") {
      this.format = DisplateFormat.XL;
    } else {
      this.format = DisplateFormat.UNKNOWN;
    }

    this.imageUrl = data.images.main.url;
  }
}

export enum DisplateStatus {
  UNKNOWN,
  ACTIVE,
  UPCOMING,
  SOLD_OUT,
}

export enum DisplateType {
  UNKNOWN,
  STANDARD,
  ULTRA,
}

export enum DisplateFormat {
  UNKNOWN,
  MEDIUM,
  LARGE,
  XL,
}
