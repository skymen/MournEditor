<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-4">
      <v-card>
        <v-layout row>
          <v-card-title class="headline">Functions</v-card-title>
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
        <v-card-title class="headline">Instance Constructor body</v-card-title>
        <div class="main">
          <codemirror v-model="functions.cons"></codemirror>
          <br>
        </div>
        <v-divider></v-divider>
      </v-card>
      <br>
      <v-card>
        <v-card-title class="headline">Routines</v-card-title>
        <div class="main">
          <codemirror v-model="functions.routines"></codemirror>
          <br>
        </div>
        <v-divider></v-divider>
      </v-card>
      <br>
      <v-card>
        <v-card-title class="headline">Instance Object</v-card-title>
        <div class="main">
          <codemirror v-model="functions.instance"></codemirror>
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
  name: 'Functions',
  components: {info},
  data () {
    return {
      functions: {
        cons: 'this.testProperty = this.properties[0];',
        routines: 'var SomeFunction = function()\n{\n  //\n}',
        instance: '{\n  Foo(num)\n  {\n    console.log( "I got the number: " + num );\n  },\n\n  Bar(str)\n  {\n    console.log( "I got the string: " + str );\n  }\n}'
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
    functions: {
      handler (val) {
        localStorage.functions = JSON.stringify(this.functions)
      },
      deep: true,
      immediate: false
    }
  },
  mounted () {
    if (localStorage.functions) {
      this.functions = JSON.parse(localStorage.functions)
    }
  }
}
</script>