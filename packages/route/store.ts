import React from 'react'
import { observable } from 'mobx';
// import { observer, useLocalStore } from 'mobx-react-lite' // 6.x or mobx-react-lite@1.4.0
import {  AuthenticateValues } from '@kookjs-client/core'
export type TRoute = {
  path: string;
  exact: boolean;
  component: string;
  priority?: number;

  // Layout Props
  layoutCssClass?: string;  
  layoutName?: string;  
  
  // For AUTH purpose only
  authenticate?: AuthenticateValues;
  roles?: string[];
  capabilites?: string[];
  
  // page title
  title?: string; 
}

export const routeStore = observable({
    routes: [] as TRoute[],  
})