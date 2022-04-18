import { injectable } from "inversify";
import React from 'react'
import { DictionaryStrict } from '@kookjs-client/core/common/DictionaryStrict'

@injectable()
export default class MobxStore {
  private stores: DictionaryStrict<any>;
  constructor() {
    this.stores = {} 
  }

  add<T>(c: new (...args: any) => T, attribs?: any) {
    this.stores[c.name] = new c(attribs);
  }

  get<T>(c: new (...args: any) => T): T {
		return this.stores[c.name] as T;
	}

  boot() {
    
  }
}

export const MobxStoreContext = React.createContext<MobxStore>(null)

export const useMobxStore = () => {
  const store = React.useContext(MobxStoreContext)
  // if (!store) {
  //   // this is especially useful in TypeScript so you don't need to be checking for null all the time
  //   throw new Error('useStore must be used within a StoreProvider.')
  // }
  return store
}