import {StoreService} from './store.service';

describe('StoreService', () => {
  interface State {
    foo?: string;
    bar?: number;
  }
  let store: StoreService<State>;

  beforeEach(() => {
    store = new StoreService<State>({});
  });

  it('should provide pub/sub caching of values', () => {
    let fooVal;
    let barVal;

    const fooSub = store.select("foo")
      .subscribe((foo: string) => fooVal = foo);

    const barSub = store.select("bar")
      .subscribe((bar: number) => barVal = bar);

    store.update('foo', 'value1');
    store.update('bar', 1);

    expect(fooVal).toEqual('value1');
    expect(barVal).toEqual(1);

    store.update('foo', 'value2');
    store.update('bar', 2);

    expect(fooVal).toEqual('value2');
    expect(barVal).toEqual(2);

    fooSub.unsubscribe();
    barSub.unsubscribe();
  });

  it('should provide cached value on new subscription', () => {
    let fooVal;
    let barVal;

    // setting the value before subscribing
    store.update('foo', 'value1');
    store.update('bar', 1);

    // should get last value on subscription
    const fooSub = store.select("foo")
      .subscribe((foo: string) => fooVal = foo);

    const barSub = store.select("bar")
      .subscribe((bar: number) => barVal = bar);

    expect(fooVal).toEqual('value1');
    expect(barVal).toEqual(1);

    fooSub.unsubscribe();
    barSub.unsubscribe();
  });

  it('should only notify listeners for the portion of state that changed', () => {
    const fooValues: string[] = [];
    const barValues: number[] = [];

    store.update('foo', 'value1');
    store.update('bar', 1);

    const fooSub = store.select("foo")
      .subscribe((foo: string) => fooValues.push(foo));

    const barSub = store.select("bar")
      .subscribe((bar: number) => barValues.push(bar));

    // sending the same value twice in a row should only result in one notification
    store.update('foo', 'value2');
    store.update('foo', 'value2');

    // foo has only had 2 unique values published
    expect(fooValues).toEqual(['value1', 'value2']);
    // bar has only had 1 unique value published
    expect(barValues).toEqual([1]);

    fooSub.unsubscribe();
    barSub.unsubscribe();
  });
});
