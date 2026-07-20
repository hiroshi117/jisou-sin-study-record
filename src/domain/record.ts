export class Record {
  id: string;
  title: string;
  time: string;

  constructor(id: string, title: string, time: string) {
    this.id = id;
    this.title = title;
    this.time = time;
  }
}
