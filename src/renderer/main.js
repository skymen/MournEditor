import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueCodemirror from '../../node_modules/vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/mdn-like.css'

import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint.js'

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'

import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/jump-to-line.js'

import 'codemirror/addon/selection/active-line.js'

import 'codemirror/addon/comment/continuecomment.js'
import 'codemirror/addon/comment/comment.js'

import 'codemirror/addon/display/placeholder.js'
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/addon/display/fullscreen.css'

import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'

import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/trailingspace.js'

import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'

import App from './App'
import router from './router'
import store from './store'

Vue.use(Vuetify)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

const theme = (localStorage.darkMode === '1' ? 'monokai' : 'mdn-like')

Vue.use(VueCodemirror,
  {
    options: {
      scrollbarStyle: 'native',
      autoCloseBrackets: true,
      placeholder: 'Code goes here...',
      tabSize: 2,
      matchBrackets: true,
      styleActiveLine: true,
      lineNumbers: true,
      showTrailingSpace: true,
      line: true,
      mode: 'text/javascript',
      foldGutter: true,
      gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      theme: theme,
      completeSingle: false,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'F11': function (cm) {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'))
        },
        'Esc': function (cm) {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false)
        },
        'Ctrl-Q': function (cm) {
          cm.foldCode(cm.getCursor())
        },
        'Alt-F': 'findPersistent'
      }
    }
  }
)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
