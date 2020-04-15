import './worker.polyfill'

import renderToString from 'vue-server-renderer'
import { range } from 'lodash'
import Vue from 'vue'
import ViewDesign from 'view-design'

import Commits from './commits.vue'
import Tracer from './tracer.vue'

Vue.use(ViewDesign)

async function renderString(commits) {

  const vm = new Vue({
    el: '#app',

    render: (h) => h(Tracer, range(0, 50).map(() => h(Commits, {
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

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('https://api.github.com')) {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp || fetch(event.request, {
          mode: 'cors',
          credentials: 'include',
        }).then((response) => {
          return caches.open(event.request.url).then((cache) => {
            cache.put(event.request, response.clone())
            return response
          })
        })
      })
      .then(async (response) => {
        const commits = await response.json()
        const now = performance.now()
        const html = await renderString(commits)
        console.log('render to string cost', performance.now() - now)
        return new Response(JSON.stringify({
          html,
          commits,
        }), {
          headers: {
            'x-render-by-sw': true,
            'x-rendering-start': now            
          }
        })
      })
    )
  }
})
