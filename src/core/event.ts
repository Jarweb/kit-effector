export default class EventEmitter {
  private listeners: any = {}

  // 需要先监听，事件触发时派送数据到对应的监听者
  public on(eventType: any, cb: any) {
    this.listeners[eventType] = this.listeners[eventType]
      ? [...this.listeners[eventType], cb]
      : [cb]
  }

  public emit(eventType: any, ...data: any) {
    if (!this.listeners[eventType]) return
    this.listeners[eventType].forEach((cb: any) => {
      cb(...data)
    })
  }

  public off(eventType: any) {
    this.listeners[eventType] = undefined
  }

  public once(eventType: any, cb: any) {
    const callback = (...data: any) => {
      cb(...data)
      this.off(eventType)
    }
    this.on(eventType, callback)
  }
}