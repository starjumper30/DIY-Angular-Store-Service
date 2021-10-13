import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

type ValueOf<T, K extends keyof T> = T[K];

export class StoreService<T> {
  protected _state: BehaviorSubject<T>;

  constructor(initialValue: T) {
    this._state = new BehaviorSubject<T>(initialValue);
  }

  select<K extends keyof T>(key: K): Observable<ValueOf<T, K> | undefined> {
    return this._state.pipe(
      map((s) => s[key]),
      distinctUntilChanged()
    );
  }

  update<K extends keyof T>(key: K, value: ValueOf<T, K> | undefined) {
    this._state.next({ ...this._state.getValue(), [key]: value });
  }
}
