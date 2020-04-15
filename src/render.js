import renderToString from 'vue-server-renderer'
import { range } from 'lodash'
import Vue from 'vue'
import ViewDesign from 'view-design'

import Commits from './commits.vue'
import Tracer from './tracer.vue'

self.process = {
  env: {
    VUE_ENV: 'server',
  }
}

async function main(commits) {

  Vue.use(ViewDesign)

  const vm = new Vue({
    el: '#app',
  
    render: (h) => h(Tracer, range(0, 10).map(() => h(Commits, {
      props: {
        commits,
      }
    }))),
  })

  return new Promise((resolve, reject) => renderToString(vm, (e, html) => {
    if (e) {
      console.error(e)
      reject(e)
    } else {
      resolve(html)
    }
  }))
}

main().then((result) => {
  const dest = new SharedArrayBuffer(result.length)
  const destBuffer = new Uint8Array(dest)
  let index = 0
  for (const str of result) {
    Atomics.store(destBuffer, index, str.charCodeAt(0))
    index++
  }
  postMessage(destBuffer)
})
