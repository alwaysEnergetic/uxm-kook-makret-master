import React, { Suspense, lazy } from 'react';
import { injectable, inject } from "inversify";
// import { createStore } from 'redux'
// import { TRoute, routeStore } from './store'
import { getPlugin } from '@kookjs-client/core'
import Route from '@kookjs-client/route'
import Auth from "@kookjs-client/auth";

// import Home from './components/Home'
// import JoinAndProsper from './components/user/JoinAndProsper'
// import Register from './components/user/Register'
// import NewsletterInviteFriend from './components/user/NewsletterInviteFriend'

// import ItemArchive from './components/pim/ItemArchive'
// import Item from './components/pim/Item'
// import Carts from './components/order/Carts'
// import Checkout from './components/order/Checkout'
// // import PaymentCancel from './components/order/PaymentCancel'
// // import PaymentProcess from './components/order/PaymentProcess'
// import PaymentSuccess from './components/order/PaymentSuccess'

const Home = lazy(() => import('./components/Home'));

const JoinAndProsper  = lazy(() => import('./components/user/JoinAndProsper'));
const Register  = lazy(() => import('./components/user/Register'));
const NewsletterInviteFriend  = lazy(() => import('./components/user/NewsletterInviteFriend'));
// const LazyModuleOne = lazy(() => import('./components/ModuleOne'));
// const LazyModuleTwo = lazy(() => import('./components/ModuleTwo'));

const ItemArchive = lazy(() => import('./components/pim/ItemArchive'));
const Item = lazy(() =>  import('./components/pim/Item'));
const Carts = lazy(() =>  import('./components/order/Carts'));
const Checkout = lazy(() =>  import('./components/order/Checkout'));
const OrderSuccess = lazy(() =>  import('./components/order/OrderSuccess'));
const OrderFailed = lazy(() =>  import('./components/order/OrderFailed'));

@injectable()
export default class Market {
  boot() {
    const route = getPlugin(Route)
    route.add({
      path: "/",
      exact: true,
      component: "Home",
      // authenticate: "Private"
      layoutCssClass: "layoutHome",
      title: "Home"
    }, Home)

    // route.add({
    //   path: "/module-two",
    //   exact: true,
    //   component: "LazyModuleTwo",
    //   // authenticate: "Private"
    //   layoutCssClass: "layoutHome"
    // }, LazyModuleTwo)

    route.add({
      path: "/join_prosper",
      exact: true,
      component: "JoinAndProsper",
      authenticate: "Public",
      layoutCssClass: "center",
      layoutName:"generic",
      priority: 1000,
      title: "Join and Prosper"
    }, JoinAndProsper)

    route.add({
      path: "/register",
      exact: true,
      component: "Register",
      authenticate: "Public",
      layoutCssClass: "center",
      layoutName:"generic",
      title: "Register"
    }, Register)

    route.add({
      path: "/newsletter/send_to_friend",
      exact: true,
      component: "NewsletterInviteFriend",
      layoutCssClass: "center",
      title: "Send Newsletter to Friend"
    }, NewsletterInviteFriend)

    route.add({
      path: "/catalogue",
      exact: true,
      component: "ItemArchive",
      title: "Item Catalogue"
    }, ItemArchive)

    route.add({
      path: "/catalogue/page/:pageno",
      exact: true,
      component: "ItemArchive",
      title: "Item Catalogue"
    }, ItemArchive)

    route.add({
      path: "/item/:slug",
      exact: true,
      component: "Item",
      title: "Item"
    }, Item)

    route.add({
      path: "/carts",
      exact: true,
      component: "Carts",
      layoutCssClass: "center",
      title: "Carts"
    }, Carts)

    route.add({
      path: "/checkout/:cartId",
      exact: true,
      component: "Checkout",
      // authenticate: "Private",
      layoutCssClass: "checkout",
      title: "Checkout"
    }, Checkout)

    route.add({
      path: "/order/success",
      exact: true,
      component: "OrderSuccess",
      // authenticate: "Private",
      layoutCssClass: "center",
      title: "Order Successfull"
    }, OrderSuccess)

    route.add({
      path: "/order/failed",
      exact: true,
      component: "OrderFailed",
      // authenticate: "Private",
      layoutCssClass: "center",
      title: "Order Failed"
    }, OrderFailed)

    

    // route.add({
    //   path: "/payment/cancel",
    //   exact: true,
    //   component: PaymentCancel,
    //   authenticate: "Private",
    //   // layoutCssClass: "checkout"
    // })

    // route.add({
    //   path: "/payment/process",
    //   exact: true,
    //   component: PaymentProcess,
    //   authenticate: "Private",
    //   // layoutCssClass: "checkout"
    // })
  }
}