<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-4">
      <v-card>
        <v-layout row>
          <v-card-title class="headline">Global Variables</v-card-title>
          <v-spacer></v-spacer>
          <v-layout column align-end>
            <v-layout row align-center>
              <info :title="info.title" :content="info.content"/>
            </v-layout>
          </v-layout>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
      <br>
      <v-card>
        <v-card-title class="headline">C2 runtime</v-card-title>
        <div class="main">
          <codemirror v-model="globalVarsCode.c2"></codemirror>
          <br>
        </div>
        <v-divider></v-divider>
      </v-card>
      <br>
      <v-card>
        <v-card-title class="headline">C2.3 runtime</v-card-title>
        <div class="main">
          <codemirror v-model="globalVarsCode.c23"></codemirror>
          <br>
        </div>
        <v-divider></v-divider>
      </v-card>
      <br>
      <v-card>
        <v-card-title class="headline">C3 runtime</v-card-title>
        <div class="main">
          <codemirror v-model="globalVarsCode.c3"></codemirror>
          <br>
        </div>
        <v-divider></v-divider>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import info from './Misc/Info'
export default {
  name: 'GlobalVars',
  components: {info},
  data () {
    return {
      globalVarsCode: {
        c2: '',
        c23: '',
        c3: ''
      },
      info: {
        title: 'Global variables',
        content: [
          'This is code that will be added at the top of the runtime files. This can be used to define global variables that can then be accessed from all the other functions.',
          'Tips for the code editor:',
          'You can use F11 to toggle fullscreen (or Escape to get out of fullscreen).',
          'You can use CTRL+F to search in the code editor, and ALT+F to make the search bar persistant.',
          'You can use CTRL+Q to fold the current line.',
          'You can use CTRL+Space to use autocomplete. If multiple choices are available a small menu will appear. Else it will automatically complete the word. Using CTRL+Space when not in the middle of a word, all of the possible completes appear.'
        ]
      }
    }
  },
  computed: {
    color () {
      return (localStorage.darkMode === '1' ? 'monokai' : 'mdn-like')
    }
  },
  watch: {
    globalVarsCode: {
      handler (val) {
        localStorage.globalVarsCode = JSON.stringify(this.globalVarsCode)
      },
      deep: true,
      immediate: false
    }
  },
  mounted () {
    if (localStorage.globalVarsCode) {
      this.globalVarsCode = JSON.parse(localStorage.globalVarsCode)
    }
  }
}
</script>