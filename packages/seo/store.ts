import { makeAutoObservable } from "mobx"
import { getPlugin } from '@kookjs-client/core'
import MobxStore from '@kookjs-client/mobx-store'
import dotObject from "@khanakiajs/dot-object";

type SeoData = {
  defaultTitle?: string;
  lang?: string;
  title?: string
  description?: string
  meta: []
}

export class SeoStore {
  secondsPassed = 0

  lang = "en"

  title = null

  defaultTitle = null

  description = null

  meta: any = []

  constructor(seoData: SeoData) {
     this.setMeta(seoData)
      makeAutoObservable(this)
  }

  // increaseTimer() {
  //     this.secondsPassed += 1
  // }

  setMeta(seoData: SeoData) {
    if(seoData) {
      this.lang = seoData.lang
      this.title = seoData.title
      this.description = seoData.description
      this.meta = seoData.meta||[]
      this.defaultTitle = seoData.defaultTitle
    }
  }

  setMetaFromAjax(extra: any) {
    const metaTitle = dotObject.getArrayValue(extra, ["metaTitle"], null);
    if(metaTitle) this.title = metaTitle

    const metaDescr = dotObject.getArrayValue(extra, ["metaDescr"], null);
    if(metaDescr) this.description = metaDescr
  }
}

export const createSeoStore = () => {
  const mobxStore = getPlugin(MobxStore)
  mobxStore.add(SeoStore, {
    defaultTitle: APP_CONFIG.appName,
    description: APP_CONFIG.metaDescr
  })
}

export const useSeoStore = () => {
  const mobxStore = getPlugin(MobxStore)
  return mobxStore.get(SeoStore)
}