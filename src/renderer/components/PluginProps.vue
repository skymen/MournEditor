<template>
<v-layout row wrap justify-center id="wrapper">
  <v-navigation-drawer right clipped enable-resize-watcher fixed app v-model="rightDrawer">
    <draggableList :data="properties" :update="sortUpdate" prename="Property #" :clicked="picked"/>
    <v-layout column align-center>
      <v-tooltip top>
        <v-btn slot="activator" :color="color" icon @click.stop="add()">
          <v-icon>add</v-icon>
        </v-btn>
        Add
      </v-tooltip>
    </v-layout>
  </v-navigation-drawer>

  <v-flex xs11 class="mt-4">

    <v-card>
      <v-layout row>
        <v-card-title class="headline">Plugin Properties</v-card-title>
        <v-spacer></v-spacer>
        <v-layout column align-end>
          <v-layout row align-center>
            <info :title="info.title" :content="info.content"/>
            <v-btn flat icon @click.stop="rightDrawer = !rightDrawer">
              <v-icon>menu</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
      </v-layout>
      <v-divider></v-divider>
    </v-card>
    <br>
    <v-expansion-panel popout :value="expandIndex">
      <v-expansion-panel-content v-for="(property, index) in properties" :id="'prop' + index" :key="index">
        <div slot="header">
          <v-card-title class="headline">
          Property #{{index}} : {{property.name}}
          <v-spacer></v-spacer>
          <v-tooltip top>
            <v-btn slot="activator" icon :disabled="index === 0" @click.stop="moveUp(index)">
              <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
            Move Up
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" icon :disabled="index >= properties.length - 1" @click.stop="moveDown(index)">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
            Move Down
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" icon @click.stop="remove(index)">
              <v-icon>clear</v-icon>
            </v-btn>
            Remove
          </v-tooltip>
          </v-card-title>
        </div>
        <v-layout column justify-center>
          <v-card>
            <v-flex xs10 offset-xs1 v-for="(item, k) in propPage" :key="k">
              <v-text-field v-if="item.type === 'text'"
                :name="index"
                :label="item.label"
                id="id"
                v-model="property[item.bound]"
              ></v-text-field>

              <v-divider v-if="item.type === 'div'"></v-divider>
              
              <v-combobox v-if="item.type === 'combo'"
                v-model="property[item.bound]"
                :name="index"
                :items="item.items"
                :label="item.label"
                :multiple="item.multiple"
              ></v-combobox>

              <v-checkbox v-if="item.type === 'check'"
                v-model="property[item.bound]"
                :label="item.label"
              ></v-checkbox>
            </v-flex>
          </v-card>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <br>
    <v-card>
      <v-divider></v-divider>
      <v-layout column align-center>
        <v-tooltip top>
          <v-btn slot="activator" :color="color" icon @click.stop="add()">
            <v-icon>add</v-icon>
          </v-btn>
          Add
        </v-tooltip>
      </v-layout>
    </v-card>
  </v-flex>
</v-layout>

</template>

<script>
import info from './Misc/Info'
import draggableList from './Misc/DraggableList'
export default {
  name: 'PluginProps',
  components: {info, draggableList},
  data () {
    return {
      rightDrawer: false,
      propPage: [
        {
          type: 'text',
          label: 'Property Name',
          bound: 'name'
        },
        {
          type: 'text',
          label: 'Property Description',
          bound: 'description'
        },
        {
          type: 'text',
          label: 'Initial Value',
          bound: 'initialValue'
        },
        {
          type: 'div'
        },
        {
          type: 'combo',
          label: 'Type C2',
          bound: 'typeC2',
          multiple: false,
          items: ['ept_integer', 'ept_float', 'ept_text', 'ept_color', 'ept_font', 'ept_combo', 'ept_link', 'ept_section']
        },
        {
          type: 'combo',
          label: 'Type C3',
          bound: 'typeC3',
          multiple: false,
          items: ['integer', 'float', 'percent', 'text', 'longtext', 'check', 'font', 'combo', 'color', 'group', 'link', 'info']
        },
        {
          type: 'text',
          label: 'ID C3',
          bound: 'idC3'
        }
      ],
      properties: [],
      defaultProp: {
        visible: true,
        name: '',
        description: '',
        initialValue: '',
        typeC2: '',
        typeC3: '',
        idC3: ''
      },
      justUpdated: false,
      info: {
        title: 'Properties',
        content: [
          'Here you can add properties to the plugin, using the plus button at the bottom of the page, or on the side bar.',
          'Using the sidebar you can navigate to a specific property and reorder them to your liking.',
          'Properties in C2 and C3 are different, so you need to be careful if you\'re using a C3 only property type.'
        ]
      },
      expandIndex: 0
    }
  },
  computed: {
    color () {
      return (localStorage.darkMode === '1' ? 'grey darken-4' : 'grey lighten-3')
    }
  },
  watch: {
    properties: {
      handler (val) {
        localStorage.properties = JSON.stringify(this.properties)
      },
      deep: true,
      immediate: false
    }
  },
  mounted () {
    if (localStorage.properties) {
      this.properties = JSON.parse(localStorage.properties)
    }
    setTimeout(() => {
      this.rightDrawer = true
    }, 700)
  },
  beforeRouteLeave (to, from, next) {
    if (this.rightDrawer) {
      this.rightDrawer = false
      setTimeout(next, 300)
    } else {
      next()
    }
  },
  methods: {
    add () {
      var toAdd = JSON.parse(JSON.stringify(this.defaultProp))
      this.properties.push(toAdd)
      setTimeout(() => {
        this.expandIndex = this.properties.length - 1
        setTimeout(() => {
          this.$vuetify.goTo('#prop' + this.expandIndex, {duration: 500, offset: -100, easing: 'easeInOutCubic'})
        }, 400)
      }, 100)
    },
    moveUp (index) {
      const temp = this.properties[index - 1]
      this.properties[index - 1] = this.properties[index]
      this.properties[index] = temp
      this.properties.push({})
      this.properties.splice(this.properties.length - 1, 1)
      this.expandIndex -= this.expandIndex === index
    },
    moveDown (index) {
      const temp = this.properties[index + 1]
      this.properties[index + 1] = this.properties[index]
      this.properties[index] = temp
      this.properties.push({})
      this.properties.splice(this.properties.length - 1, 1)
      this.expandIndex += this.expandIndex === index
    },
    remove (index) {
      this.properties.splice(index, 1)
      this.expandIndex -= this.expandIndex === this.properties.length
    },
    sortUpdate (data) {
      this.properties = data
    },
    picked (index) {
      setTimeout(() => {
        this.$vuetify.goTo('#prop' + index, {duration: 500, offset: -100, easing: 'easeInOutCubic'})
      }, 400 * (this.expandIndex !== index))
      this.expandIndex = index
    }
  }
}
</script>


<style scoped>
  img {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
</style>
