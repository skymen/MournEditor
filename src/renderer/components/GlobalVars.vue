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
        title: 'Test',
        content: ['Test']
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