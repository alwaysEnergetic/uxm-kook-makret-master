
### How to add custom Global Store

#### Adding the Store as Provider
```
// First Register the PLugin
import MobxStore, { MobxStoreContext } from "@kookjs-client/mobx-store";
app.registerPlugin(MobxStore);
app.boot()
const mobxStore = app.getPlugin(MobxStore);

return (
  <MobxStoreContext.Provider value={mobxStore}>
      <App />
  </MobxStoreContext.Provider>
)
```

#### 1. Create a `store.ts` file in any packages
```
import { makeAutoObservable } from "mobx"
import { getPlugin } from '@kookjs-client/core'
import MobxStore from '@kookjs-client/mobx-store'

export class MarketStore {
  secondsPassed = 0

  constructor() {
      makeAutoObservable(this)
  }

  increaseTimer() {
      this.secondsPassed += 1
  }
}

export const createMarketStore = () => {
  const mobxStore = getPlugin(MobxStore)
  mobxStore.add(MarketStore)
}

export const useMarketStore = () => {
  const mobxStore = getPlugin(MobxStore)
  return mobxStore.get(MarketStore)
}
```


#### 2. Init your custom store in package boot function 
```
import { injectable, inject } from "inversify";
import { createMarketStore } from "./store"

@injectable()
export default class Market {
  boot() {
    createMarketStore() // Init your store
  }
}
```


#### 3. Now you are ready to use the store anywhere in the packages like below
```
import React from "react";
import { observer } from "mobx-react-lite";
import { useMarketStore } from "../../store"
const ItemInfo = observer(() => {
	const marketStore = useMarketStore()

	const handleClick = () => {
		marketStore.increaseTimer()
		console.log("Clicked")
	}
	return (
		<div>
			<button class="btn btn-primary" onClick={handleClick}>Increase</button>
			<div>{marketStore.secondsPassed}</div>
		</div>
	)
})
```