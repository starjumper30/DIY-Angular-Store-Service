import { StoreService } from './store.service';


function testTheStore() {
  interface State {
    foo?: string;
    bar?: number; 
  }

  const store = new StoreService<State>({});

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