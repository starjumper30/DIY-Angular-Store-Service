import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

type ValueOf<T, K extends keyof T> = T[K];

export class Store<T> {
  private _state: BehaviorSubject<T>;

  constructor(initialValue: T) {
    this._state = new BehaviorSubject<T>(initialValue);
  }

  select<K extends keyof T>(
    key: K
  ): Observable<ValueOf<T, K> | undefined> {
    return this._state.pipe(
      map((s) => s[key]),
      distinctUntilChanged()
    );
  }

  update<K extends keyof T>(
    key: K,
    value: ValueOf<T, K> | undefined
  ) {
    this._state.next({ ...this._state.getValue(), [key]: value });
  }
}

function testTheStore() {
  interface State {
    foo?: string;
    bar?: number; 
  }

  const store = new Store<State>({});

  const fooSub = store.select("foo")
    .subscribe((foo: string) => console.log("foo", foo));
    
  const barSub = store.select("bar")
    .subscribe((bar: number) => console.log("bar", bar));

  store.update('foo', 'value1');
  store.update('bar', 1);

  fooSub.unsubscribe();
  barSub.unsubscribe();

}
testTheStore();