<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-navigation-drawer right clipped enable-resize-watcher fixed app v-model="rightDrawer">
      <draggableList :data="aces" :update="sortUpdate" :clicked="picked"/>
      <v-layout column align-center>
        <v-tooltip top>
          <v-btn slot="activator" :color="color" icon @click.stop="addAce()">
            <v-icon>add</v-icon>
          </v-btn>
          Add
        </v-tooltip>
      </v-layout>
    </v-navigation-drawer>
    <v-flex xs10 class="mt-4">
      <v-card>
        <v-layout row>
          <v-card-title class="headline">Plugin ACES</v-card-title>
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
        <v-expansion-panel-content lazy v-for="(ace, index) in aces" :id="'ace' + index" :key="index">
          <div slot="header">
            <v-card-title class="headline">
              <v-layout row>
                {{ace.type === undefined ? 'ACE' : ace.type}} #{{index}} : {{ace.name}}
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <v-btn slot="activator" icon @click.stop="copyAce(index)">
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                  Duplicate
                </v-tooltip>
                <v-tooltip top>
                  <v-btn slot="activator" icon :disabled="index === 0" @click.stop="moveUpAce(index)">
                    <v-icon>keyboard_arrow_up</v-icon>
                  </v-btn>
                  Move Up
                </v-tooltip>
                <v-tooltip top>
                  <v-btn slot="activator" icon :disabled="index >= aces.length - 1" @click.stop="moveDownAce(index)">
                    <v-icon>keyboard_arrow_down</v-icon>
                  </v-btn>
                  Move Down
                </v-tooltip>
                <v-tooltip top>
                  <v-btn slot="activator" icon @click.stop="removeAce(index)">
                    <v-icon>clear</v-icon>
                  </v-btn>
                  Remove
                </v-tooltip>  
              </v-layout>
              
            </v-card-title>
          </div>
          <v-layout column>
            <v-card>
              <v-flex v-for="(item, k) in acePage" :key="k">
                <v-text-field v-if="item.type === 'text'"
                  :name="index"
                  :label="item.label"
                  id="id"
                  v-model="ace[item.bound]"
                ></v-text-field>

                <v-divider v-if="item.type === 'div'"></v-divider>
                
                <v-combobox v-if="item.type === 'combo' && (item.aceType === undefined || item.aceType === ace.type)"
                  v-model="ace[item.bound]"
                  :name="index"
                  :items="item.items"
                  :label="item.label"
                  :multiple="item.multiple"
                  :chips="item.multiple"
                  :deletable-chips="item.multiple"
                ></v-combobox>

                <v-checkbox v-if="item.type === 'check'"
                  v-model="ace[item.bound]"
                  :label="item.label"
                ></v-checkbox>

                <v-card v-if="item.type === 'code'  && (item.aceType === undefined || item.aceType === ace.type)">
                  <v-card-title class="headline">
                    {{item.label}}
                  </v-card-title>
                  <codemirror v-model="ace[item.bound]"></codemirror>
                </v-card>
                
                <v-card v-if="item.type === 'props'" :color="color">
                  <br>
                  <v-expansion-panel>
                    <v-expansion-panel-content lazy>
                      <div slot="header">
                        <v-card-title class="headline">
                        Properties
                        </v-card-title>
                      </div>
                      <br>
                      <v-divider></v-divider>
                      <v-expansion-panel popout :value="ace.expandIndex">
                        <v-expansion-panel-content lazy v-for="(prop, j) in ace.props" :key="j">
                          <div slot="header">
                            <v-card-title class="headline">
                              <v-layout row>
                                Property #{{j}} : {{prop.label}}
                                <v-spacer></v-spacer>
                                <v-tooltip top>
                                  <v-btn slot="activator" icon @click.stop="copyProp(index, j)">
                                    <v-icon>file_copy</v-icon>
                                  </v-btn>
                                  Duplicate
                                </v-tooltip>
                                <v-tooltip top>
                                  <v-btn slot="activator" icon :disabled="j === 0" @click.stop="moveUpProp(index, j)">
                                    <v-icon>keyboard_arrow_up</v-icon>
                                  </v-btn>
                                  Move Up
                                </v-tooltip>
                                <v-tooltip top>
                                  <v-btn slot="activator" icon :disabled="j >= ace.props.length - 1" @click.stop="moveDownProp(index, j)">
                                    <v-icon>keyboard_arrow_down</v-icon>
                                  </v-btn>
                                  Move Down
                                </v-tooltip>
                                <v-tooltip top>
                                  <v-btn slot="activator" icon @click.stop="removeProp(index, j)">
                                    <v-icon>clear</v-icon>
                                  </v-btn>
                                  Remove
                                </v-tooltip>  
                              </v-layout>
                              
                            </v-card-title>
                          </div>
                          <v-card>
                            <v-flex v-for="(property, l) in propPage" :key="l">
                              <v-text-field v-if="property.type === 'text' && checkPropAppearance(property.needsCombo, prop.isCombo)"
                                :name="index"
                                :label="property.label"
                                id="id"
                                v-model="prop[property.bound]"
                              ></v-text-field>

                              <v-divider v-if="property.type === 'div' && checkPropAppearance(property.needsCombo, prop.isCombo)"></v-divider>
                              
                              <v-combobox v-if="property.type === 'combo' && checkPropAppearance(property.needsCombo, prop.isCombo)"
                                v-model="prop[property.bound]"
                                :name="index"
                                :items="property.items"
                                :label="property.label"
                                :multiple="property.multiple"
                              ></v-combobox>

                              <v-checkbox v-if="property.type === 'check' && checkPropAppearance(property.needsCombo, prop.isCombo)"
                                v-model="prop[property.bound]"
                                :label="property.label"
                              ></v-checkbox>

                              <v-card :color="color" v-if="property.type === 'comboParams' && checkPropAppearance(property.needsCombo, prop.isCombo)">
                                <br>
                                <v-expansion-panel>
                                  <v-expansion-panel-content lazy>
                                    <div slot="header">
                                      <v-card-title class="headline">
                                      Combo Params
                                      </v-card-title>
                                    </div>
                                    <br>
                                    <v-divider></v-divider>
                                    <v-expansion-panel popout :value="prop.expandIndex">
                                      <v-expansion-panel-content lazy v-for="(comboParam, comboIndex) in prop.comboParams" :key="comboIndex">
                                        <div slot="header">
                                          <v-card-title class="headline">
                                            <v-layout row>
                                              Combo Param #{{comboIndex}} : {{comboParam.text}}
                                              <v-spacer></v-spacer>
                                              <v-tooltip top>
                                                <v-btn slot="activator" icon @click.stop="copyCombo(index, j, comboIndex)">
                                                  <v-icon>file_copy</v-icon>
                                                </v-btn>
                                                Duplicate
                                              </v-tooltip>
                                              <v-tooltip top>
                                                <v-btn slot="activator" icon :disabled="comboIndex === 0" @click.stop="moveUpCombo(index, j, comboIndex)">
                                                  <v-icon>keyboard_arrow_up</v-icon>
                                                </v-btn>
                                                Move Up
                                              </v-tooltip>
                                              <v-tooltip top>
                                                <v-btn slot="activator" icon :disabled="comboIndex >= prop.comboParams.length - 1" @click.stop="moveDownCombo(index, j, comboIndex)">
                                                  <v-icon>keyboard_arrow_down</v-icon>
                                                </v-btn>
                                                Move Down
                                              </v-tooltip>
                                              <v-tooltip top>
                                                <v-btn slot="activator" icon @click.stop="removeCombo(index, j, comboIndex)">
                                                  <v-icon>clear</v-icon>
                                                </v-btn>
                                                Remove
                                              </v-tooltip>  
                                            </v-layout>
                                            
                                          </v-card-title>
                                        </div>
                                        <v-card>
                                          <v-flex v-for="(param, paramIndex) in comboPage" :key="paramIndex">
                                            <v-text-field v-if="param.type === 'text'"
                                              :name="j"
                                              :label="param.label"
                                              id="id"
                                              v-model="comboParam[param.bound]"
                                            ></v-text-field>
                                          </v-flex>
                                        </v-card>
                                      </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-divider></v-divider>
                                    <v-layout column align-center>
                                      <v-tooltip top>
                                        <v-btn slot="activator" :color="color2" icon @click.stop="addCombo(index, j)">
                                          <v-icon>add</v-icon>
                                        </v-btn>
                                        Add
                                      </v-tooltip>
                                    </v-layout>    
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                                <br>
                              </v-card>
                            </v-flex>
                          </v-card>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-divider></v-divider>
                      <v-layout column align-center>
                        <v-tooltip top>
                          <v-btn slot="activator" :color="color" icon @click.stop="addProp(index)">
                            <v-icon>add</v-icon>
                          </v-btn>
                          Add
                        </v-tooltip>
                      </v-layout>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <br>
                </v-card>
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
            <v-btn slot="activator" :color="color" icon @click.stop="addAce()">
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
  name: 'PluginAces',
  components: {info, draggableList},
  data () {
    return {
      expandIndex: 0,
      rightDrawer: false,
      acePage: [
        {
          type: 'combo',
          label: 'Type',
          bound: 'type',
          multiple: false,
          items: ['Condition', 'Action', 'Expression']
        },
        {
          type: 'text',
          label: 'Category Name',
          bound: 'categoryName'
        },
        {
          type: 'text',
          label: 'Category Id',
          bound: 'categoryId'
        },
        {
          type: 'div'
        },
        {
          type: 'text',
          label: 'C3 Id',
          bound: 'idC3'
        },
        {
          type: 'combo',
          label: 'Condition Flags',
          bound: 'Cflags',
          multiple: false,
          aceType: 'Condition',
          items: ['None', 'Trigger', 'Fake trigger', 'Static', 'Not invertible', 'Deprecated', 'Incompatible with triggers', 'Looping']
        },
        {
          type: 'combo',
          label: 'Action Flags',
          bound: 'Aflags',
          multiple: false,
          aceType: 'Action',
          items: ['None', 'Deprecated']
        },
        {
          type: 'combo',
          label: 'Expression Flags',
          bound: 'Eflags',
          multiple: false,
          aceType: 'Expression',
          items: ['Return Number', 'Return String', 'Return Any', 'Variadic Parameters', 'Deprecated']
        },
        {
          type: 'check',
          label: 'Highlight',
          bound: 'highlight'
        },
        {
          type: 'text',
          label: 'Name',
          bound: 'name'
        },
        {
          type: 'text',
          label: 'Display string',
          bound: 'displayString'
        },
        {
          type: 'text',
          label: 'Description',
          bound: 'description'
        },
        {
          type: 'div'
        },
        {
          type: 'text',
          label: 'Script name',
          bound: 'script'
        },
        {
          type: 'div'
        },
        {
          type: 'props',
          label: 'Properties',
          bound: 'props'
        },
        {
          type: 'div'
        },
        {
          type: 'code',
          label: 'Code',
          bound: 'codeC2'
        },
        {
          type: 'code',
          label: 'Code C3 Runtime (Expression)',
          bound: 'codeC3',
          aceType: 'Expression'
        }
      ],
      propPage: [
        {
          type: 'check',
          label: 'Is Combo',
          bound: 'isCombo',
          needsCombo: 0
        },
        {
          type: 'combo',
          label: 'Type C2',
          bound: 'typeC2',
          multiple: false,
          items: ['NumberParam', 'StringParam', 'AnyTypeParam', 'CmpParam', 'ComboParam', 'ObjectParam', 'LayerParam', 'LayoutParam', 'KeybParam', 'AnimationParam', 'AudioFileParam'],
          needsCombo: 0
        },
        {
          type: 'combo',
          label: 'Type C3',
          bound: 'typeC3',
          multiple: false,
          items: ['number', 'string', 'any', 'cmp', 'combo', 'object', 'objectname', 'layer', 'layout', 'keyb', 'instancevar', 'instancevarbool', 'eventvar', 'eventvarbool', 'animation', 'variadic', 'objinstancevar'],
          needsCombo: 0
        },
        {
          type: 'text',
          label: 'C3 ID',
          bound: 'idC3',
          needsCombo: 0
        },
        {
          type: 'text',
          label: 'Property Label',
          bound: 'label',
          needsCombo: 0
        },
        {
          type: 'text',
          label: 'Property Description',
          bound: 'description',
          needsCombo: 0
        },
        {
          type: 'div',
          needsCombo: 0
        },
        {
          type: 'text',
          label: 'Initial Value',
          bound: 'initialValue',
          needsCombo: 1
        },
        {
          type: 'text',
          label: 'Init combo C2',
          bound: 'comboC2Init',
          needsCombo: 2
        },
        {
          type: 'text',
          label: 'Init combo C3',
          bound: 'comboC3Init',
          needsCombo: 2
        },
        {
          type: 'comboParams',
          label: 'Combo Params',
          bound: 'comboParams',
          needsCombo: 2
        }
      ],
      comboPage: [
        {
          type: 'text',
          label: 'C3 ID',
          bound: 'id'
        },
        {
          type: 'text',
          label: 'Text',
          bound: 'text'
        }
      ],
      aces: [],
      defaultAce: {
        isCombo: false,
        expandIndex: 0,
        type: '',
        categoryName: '',
        categoryId: '',
        idC3: '',
        Aflags: ['None'],
        Cflags: ['None'],
        Eflags: ['Return Number'],
        highlight: false,
        name: '',
        displayString: '',
        description: '',
        script: 'Script',
        props: [],
        codeC2: 'Script () {\n\t//Code\n}',
        codeC3: 'Script () {\n\t//Code\n}'
      },
      defaultProp: {
        isCombo: false,
        expandIndex: 0,
        typeC2: '',
        typeC3: '',
        idC3: '',
        label: '',
        description: '',
        initialValue: '',
        comboC2Init: '',
        comboC3Init: '',
        comboParams: []
      },
      defaultComboParam: {
        id: '',
        text: ''
      },
      info: {
        title: 'ACES',
        content: [
          'Here you can define all of the ACES.',
          'The ACE card\'s title changes according to its type (Condition, Action, Expression).',
          'On each ACE, you can add properties.',
          'If the property is a combo property, then you can also add combo params.',
          'You can also use the side bar to navigate between ACES and reorder them.',
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
      return (localStorage.darkMode === '1' ? 'grey darken-4' : 'grey lighten-3')
    },
    color2 () {
      return 'grey'
    }
  },
  watch: {
    aces: {
      handler (val) {
        localStorage.aces = JSON.stringify(this.aces)
      },
      deep: true,
      immediate: false
    }
  },
  mounted () {
    if (localStorage.aces) {
      this.aces = JSON.parse(localStorage.aces)
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
    addAce () {
      var toAdd = JSON.parse(JSON.stringify(this.defaultAce))
      this.aces.push(toAdd)
      setTimeout(() => {
        this.expandIndex = this.aces.length - 1
        setTimeout(() => {
          this.$vuetify.goTo('#ace' + this.expandIndex, {duration: 500, offset: -100, easing: 'easeInOutCubic'})
        }, 800)
      }, 100)
    },
    copyAce (index) {
      var temp = JSON.parse(JSON.stringify(this.aces[index]))
      temp.name += ' (copy)'
      this.aces.splice(index + 1, 0, temp)
    },
    moveUpAce (index) {
      var temp = this.aces[index - 1]
      this.aces[index - 1] = this.aces[index]
      this.aces[index] = temp
      this.aces.push({})
      this.aces.splice(this.aces.length - 1, 1)
      this.expandIndex -= (this.expandIndex === index)
    },
    moveDownAce (index) {
      var temp = this.aces[index + 1]
      this.aces[index + 1] = this.aces[index]
      this.aces[index] = temp
      this.aces.push({})
      this.aces.splice(this.aces.length - 1, 1)
      this.expandIndex += (this.expandIndex === index)
    },
    removeAce (index) {
      this.aces.splice(index, 1)
      this.expandIndex -= (this.expandIndex === this.aces.length)
    },
    addProp (index) {
      var toAdd = JSON.parse(JSON.stringify(this.defaultProp))
      this.aces[index].props.push(toAdd)
      setTimeout(() => {
        this.aces[index].expandIndex = this.aces[index].props.length - 1
      }, 500)
    },
    copyProp (index, subindex) {
      var temp = JSON.parse(JSON.stringify(this.aces[index].props[subindex]))
      temp.label += ' (copy)'
      this.aces[index].props.splice(subindex + 1, 0, temp)
    },
    moveUpProp (index, subindex) {
      var temp = this.aces[index].props[subindex - 1]
      this.aces[index].props[subindex - 1] = this.aces[index].props[subindex]
      this.aces[index].props[subindex] = temp
      this.aces[index].props.push({})
      this.aces[index].props.splice(this.aces[index].props.length - 1, 1)
      this.aces[index].expandIndex -= (this.aces[index].expandIndex === subindex)
    },
    moveDownProp (index, subindex) {
      var temp = this.aces[index].props[subindex + 1]
      this.aces[index].props[subindex + 1] = this.aces[index].props[subindex]
      this.aces[index].props[subindex] = temp
      this.aces[index].props.push({})
      this.aces[index].props.splice(this.aces[index].props.length - 1, 1)
      this.aces[index].expandIndex += (this.aces[index].expandIndex === subindex)
    },
    removeProp (index, subindex) {
      this.aces[index].props.splice(subindex, 1)
      this.aces[index].expandIndex -= (this.aces[index].expandIndex === this.aces[index].props.length)
    },
    addCombo (index, subindex) {
      var toAdd = JSON.parse(JSON.stringify(this.defaultComboParam))
      this.aces[index].props[subindex].comboParams.push(toAdd)
      setTimeout(() => {
        this.aces[index].props[subindex].expandIndex = this.aces[index].props[subindex].comboParams.length - 1
      }, 500)
    },
    copyCombo (index, subindex, combo) {
      var temp = JSON.parse(JSON.stringify(this.aces[index].props[subindex].comboParams[combo]))
      temp.text += ' (copy)'
      this.aces[index].props[subindex].comboParams.splice(combo + 1, 0, temp)
    },
    moveUpCombo (index, subindex, combo) {
      var temp = this.aces[index].props[subindex].comboParams[combo - 1]
      this.aces[index].props[subindex].comboParams[combo - 1] = this.aces[index].props[subindex].comboParams[combo]
      this.aces[index].props[subindex].comboParams[combo] = temp
      this.aces[index].props[subindex].comboParams.push({})
      this.aces[index].props[subindex].comboParams.splice(this.aces[index].props[subindex].comboParams.length - 1, 1)
      this.aces[index].props[subindex].expandIndex -= (this.aces[index].props[subindex].expandIndex === combo)
    },
    moveDownCombo (index, subindex, combo) {
      var temp = this.aces[index].props[subindex].comboParams[combo + 1]
      this.aces[index].props[subindex].comboParams[combo + 1] = this.aces[index].props[subindex].comboParams[combo]
      this.aces[index].props[subindex].comboParams[combo] = temp
      this.aces[index].props[subindex].comboParams.push({})
      this.aces[index].props[subindex].comboParams.splice(this.aces[index].props[subindex].comboParams.length - 1, 1)
      this.aces[index].props[subindex].expandIndex += (this.aces[index].props[subindex].expandIndex === combo)
    },
    removeCombo (index, subindex, combo) {
      this.aces[index].props[subindex].comboParams.splice(combo, 1)
      this.aces[index].props[subindex].expandIndex -= (this.aces[index].props[subindex].expandIndex === this.aces[index].props[subindex].comboParams.length)
    },
    checkPropAppearance (needsCombo, isCombo) {
      if (needsCombo === 0) {
        return true
      }
      if (needsCombo === 1) {
        return !isCombo
      }
      if (needsCombo === 2) {
        return isCombo
      }
    },
    sortUpdate (data) {
      this.aces = data
    },
    picked (index) {
      setTimeout(() => {
        this.$vuetify.goTo('#ace' + index, {duration: 500, offset: -100, easing: 'easeInOutCubic'})
      }, 500 * (this.expandIndex !== index))
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