import { injectable } from "inversify";
// import { createStore } from 'redux'
import { TRoute, routeStore } from './store'

interface RouteComponents {
  [key: string]: React.ComponentType;
} 

@injectable()
export default class Route {
  public Components: RouteComponents
  constructor() {
    // this.version = "1.0.0"

    // React.ComponentType
    this.Components = {}
    
  }

  add(route: TRoute, component: React.ComponentType) {
    routeStore.routes.push(route)
    this.Components[route.component] = component;
  }

  boot() {
    
  }
}