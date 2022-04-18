import { injectable, inject } from "inversify";
import { getPlugin } from '@kookjs-client/core'
import { createSeoStore } from "./store"


@injectable()
export default class Seo {
  boot() {
    createSeoStore()
  }
}