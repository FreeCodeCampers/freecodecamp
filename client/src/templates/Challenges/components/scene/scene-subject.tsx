type Observer = (eventType: 'play' | 'pause' | 'stop') => void;

export class SceneSubject {
  #observers: Observer[];
  constructor() {
    this.#observers = [];
  }

  attach(observer: Observer) {
    this.#observers.push(observer);
  }

  detach(observer: Observer) {
    this.#observers = this.#observers.filter(obs => obs !== observer);
  }

  // For now, we don't need to pass any data to the observers, so notify()
  // doesn't take any arguments.
  notify(eventType: 'play' | 'pause' | 'stop') {
    this.#observers.forEach(observer => observer(eventType));
  }
}
