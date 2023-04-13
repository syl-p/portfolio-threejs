export default class EventEmitter {
	private listeners: Map<string, Array<(...args: any[]) => void>>;
  
	constructor() {
	  this.listeners = new Map();
	}
  
	on(event: string, listener: (...args: any[]) => void) {
	  let listeners = this.listeners.get(event);
	  if (!listeners) {
		listeners = [];
		this.listeners.set(event, listeners);
	  }
	  listeners.push(listener);
	}
  
	emit(event: string, ...args: any[]) {
	  const listeners = this.listeners.get(event);
	  if (!listeners) {
		return;
	  }
	  listeners.forEach(listener => listener(...args));
	}
  
	off(event: string) {
	  const listeners = this.listeners.get(event);
	  if (!listeners) {
		return;
	  }
	  this.listeners.delete(event)
	}
  }