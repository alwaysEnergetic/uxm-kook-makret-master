import React from "react"
import { Helmet } from "react-helmet"

import { useSeoStore } from "./store"
import { observer } from "mobx-react-lite";

export default observer((props: {title?: string}) => {
  let { title } = props
  const store = useSeoStore()
  const descr = store.description
  title = title ? title : store.title
  const lang = store.lang
  const meta = store.meta

  const defaultTitle = store.defaultTitle

  // console.log("title", descr)
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      link={[
        {
          rel: `canonical`,
          href: APP_CONFIG.domain
        }
      ]}
      meta={[
      
        {
          name: `description`,
          content: descr,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: descr,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        // {
        //   name: `twitter:creator`,
        //   content: site.siteMetadata?.social?.twitter || ``,
        // },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: descr,
        },
      ].concat(meta)}
    />
  )
})