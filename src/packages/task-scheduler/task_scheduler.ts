export default class TaskScheduler {
  public tasks: Map<string, Function>;
  constructor() {
    this.clear();
    this.tasks = new Map();
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (this.tasks.has(alarm.name)) {
        this.tasks.get(alarm.name)();
      }
    });
  }
  public clear(name?: string) {
    if (name) {
      chrome.alarms.clear(name);
    } else {
      chrome.alarms.clearAll();
    }
  }
  public add(name: string, options: chrome.alarms.AlarmCreateInfo) {
    chrome.alarms.create(name, options);
  }
  public remove(name: string) {
    this.tasks.delete(name);
  }
  public register(name: string, callback: Function) {
    this.tasks.set(name, callback);
    return this;
  }
}
