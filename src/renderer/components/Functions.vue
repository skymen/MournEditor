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
        title: 'Functions',
        content: [
          'This page is divided in 3 parts:',
          '1 - Instance Constructor Body',
          'This is the code that gets added to the OnCreate method. This can be used to get properties and initialize them.',
          '2 - Routines',
          'These are global functions accessible from the other functions but that can\'t access the plugin\'s prototype (aka this).',
          '3 - Instance Object',
          'These are functions attached to the object. They can access the object\'s attributes and get accessed through "this.functionName" from other functions.',
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