import Vue from 'vue'
import ViewUI from 'view-design';
import { range } from 'lodash'
import 'view-design/dist/styles/iview.css';

import Commits from './commits.vue'
import Tracer from './tracer.vue'
import { fetchCommits } from './util'

Vue.use(ViewUI)

navigator.serviceWorker.register('http://localhost:8080/sw.js')

const vm = new Vue({
  el: '#app',

  data() {
    return {
      commits: [],
      shouldRender: false,
    }
  },

  created() {
    let now
    fetchCommits('master')
      .then((res) => {
        if (res.headers.get('x-render-by-sw')) {
          now = res.headers.get('x-rendering-start')
        }
        return res.json()
      })
      .then((commits) => {
        if (Array.isArray(commits)) {
          this.commits = commits
        } else {
          this.$el.innerHTML = commits.html
          // setTimeout(() => {
          //   this.commits = commits.commits
          // }, 1000)
          if (now) {
            console.log('renderToString + DOM mount cost: ', performance.now() - now)
          }
        }
      })
  },

  render(h) {
    if (!this.commits.length) {
      return h('div', 'loading')
    }
    return h(Tracer, range(0, 50).map(() => h(Commits, {
      props: {
        commits: this.commits
      }
    })))
  },
})

vm.$mount()
