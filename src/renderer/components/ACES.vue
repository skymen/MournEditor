<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-navigation-drawer right clipped enable-resize-watcher fixed app v-model="rightDrawer">
      <draggableList :data="aces" :update="sortUpdate" prename="ACE #" :clicked="picked"/>
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
      <v-layout column v-for="(ace, index) in aces" :id="'ace' + index" :key="index">
        <v-card>
          <v-card-title class="headline">
          ACE #{{index}} : {{ace.name}}
          <v-spacer></v-spacer>
          <v-tooltip top>
            <v-btn slot="activator" :color="color" icon :disabled="index == 0" @click.stop="moveUpAce(index)">
              <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
            Move Up
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" :color="color" icon :disabled="index >= aces.length - 1" @click.stop="moveDownAce(index)">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
            Move Down
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" :color="color" icon @click.stop="ace.visible = !ace.visible">
              <v-icon> {{ace.visible? 'remove' : 'add'}}</v-icon>
            </v-btn>
            {{ace.visible? 'Hide' : 'Show'}}
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" :color="color" icon @click.stop="removeAce(index)">
              <v-icon>clear</v-icon>
            </v-btn>
            Remove
          </v-tooltip>
          </v-card-title>
          <v-flex v-if="ace.visible" v-for="(item, k) in acePage" :key="k">
            <v-text-field v-if="item.type == 'text'"
              :name="index"
              :label="item.label"
              id="id"
              v-model="ace[item.bound]"
            ></v-text-field>

            <v-divider v-if="item.type == 'div'"></v-divider>
            
            <v-combobox v-if="item.type == 'combo'"
              v-model="ace[item.bound]"
              :name="index"
              :items="item.items"
              :label="item.label"
              :multiple="item.multiple"
            ></v-combobox>

            <v-checkbox v-if="item.type == 'check'"
              v-model="ace[item.bound]"
              :label="item.label"
            ></v-checkbox>

            <v-card v-if="item.type == 'code'">
              <v-card-title class="headline">
                {{item.label}}
              </v-card-title>
              <codemirror v-model="ace[item.bound]"></codemirror>
            </v-card>
            
            <v-container v-if="item.type == 'props'">
              <v-card>
                  <v-card-title class="headline">
                  Properties
                  </v-card-title>
              </v-card>
              <v-flex v-for="(prop, j) in ace.props" :key="j">
                <v-card>
                  <v-card-title class="headline">
                  Property #{{j}} : {{prop.label}}
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <v-btn slot="activator" :color="color" icon :disabled="j == 0" @click.stop="moveUpProp(index, j)">
                      <v-icon>keyboard_arrow_up</v-icon>
                    </v-btn>
                    Move Up
                  </v-tooltip>
                  <v-tooltip top>
                    <v-btn slot="activator" :color="color" icon :disabled="j >= ace.props.length - 1" @click.stop="moveDownProp(index, j)">
                      <v-icon>keyboard_arrow_down</v-icon>
                    </v-btn>
                    Move Down
                  </v-tooltip>
                  <v-tooltip top>
                    <v-btn slot="activator" :color="color" icon @click.stop="prop.visible = !prop.visible">
                      <v-icon> {{prop.visible? 'remove' : 'add'}}</v-icon>
                    </v-btn>
                    {{prop.visible? 'Hide' : 'Show'}}
                  </v-tooltip>
                  <v-tooltip top>
                    <v-btn slot="activator" :color="color" icon @click.stop="removeProp(index, j)">
                      <v-icon>clear</v-icon>
                    </v-btn>
                    Remove
                  </v-tooltip>
                  </v-card-title>
                </v-card>
                <v-card :color="color" v-if="prop.visible" >
                  <v-flex v-for="(property, l) in propPage" :key="l">
                    <v-text-field v-if="property.type == 'text' && checkPropAppearance(property.needsCombo, prop.isCombo)"
                      :name="index"
                      :label="property.label"
                      id="id"
                      v-model="prop[property.bound]"
                    ></v-text-field>

                    <v-divider v-if="property.type == 'div' && checkPropAppearance(property.needsCombo, prop.isCombo)"></v-divider>
                    
                    <v-combobox v-if="property.type == 'combo' && checkPropAppearance(property.needsCombo, prop.isCombo)"
                      v-model="prop[property.bound]"
                      :name="index"
                      :items="property.items"
                      :label="property.label"
                      :multiple="property.multiple"
                    ></v-combobox>

                    <v-checkbox v-if="property.type == 'check' && checkPropAppearance(property.needsCombo, prop.isCombo)"
                      v-model="prop[property.bound]"
                      :label="property.label"
                    ></v-checkbox>

                    <v-container v-if="property.type == 'comboParams' && checkPropAppearance(property.needsCombo, prop.isCombo)">
                      <v-card>
                        <v-card-title class="headline">
                        Combo Params
                        </v-card-title>
                      </v-card>
                      <v-flex v-for="(comboParam, comboIndex) in prop.comboParams" :key="comboIndex">
                        <v-card>
                          <v-card-title class="headline">
                          Combo Param #{{comboIndex}} : {{comboParam.text}}
                          <v-spacer></v-spacer>
                          <v-tooltip top>
                            <v-btn slot="activator" :color="color2" icon :disabled="comboIndex == 0" @click.stop="moveUpCombo(index, j, comboIndex)">
                              <v-icon>keyboard_arrow_up</v-icon>
                            </v-btn>
                            Move Up
                          </v-tooltip>
                          <v-tooltip top>
                            <v-btn slot="activator" :color="color2" icon :disabled="comboIndex >= prop.comboParams.length - 1" @click.stop="moveDownCombo(index, j, comboIndex)">
                              <v-icon>keyboard_arrow_down</v-icon>
                            </v-btn>
                            Move Down
                          </v-tooltip>
                          <v-tooltip top>
                            <v-btn slot="activator" :color="color2" icon @click.stop="comboParam.visible = !comboParam.visible">
                              <v-icon> {{comboParam.visible? 'remove' : 'add'}}</v-icon>
                            </v-btn>
                            {{comboParam.visible? 'Hide' : 'Show'}}
                          </v-tooltip>
                          <v-tooltip top>
                            <v-btn slot="activator" :color="color2" icon @click.stop="removeCombo(index, j, comboIndex)">
                              <v-icon>clear</v-icon>
                            </v-btn>
                            Remove
                          </v-tooltip>
                          </v-card-title>
                        </v-card>
                        <v-card v-if="comboParam.visible">
                          <v-flex v-for="(param, paramIndex) in comboPage" :key="paramIndex">
                            <v-text-field v-if="param.type == 'text'"
                              :name="j"
                              :label="param.label"
                              id="id"
                              v-model="comboParam[param.bound]"
                            ></v-text-field>
                          </v-flex>
                        </v-card>
                      </v-flex>
                      <v-layout column align-center>
                        <v-tooltip top>
                          <v-btn slot="activator" :color="color2" icon @click.stop="addCombo(index, j)">
                            <v-icon>add</v-icon>
                          </v-btn>
                          Add
                        </v-tooltip>
                      </v-layout>
                    </v-container>
                  </v-flex>
                </v-card>
              </v-flex>
              <v-layout column align-center>
                <v-tooltip top>
                  <v-btn slot="activator" :color="color" icon @click.stop="addProp(index)">
                    <v-icon>add</v-icon>
                  </v-btn>
                  Add
                </v-tooltip>
              </v-layout>
            </v-container>
          </v-flex>
          
          <v-divider v-if="index < aces.length - 1"></v-divider>
        </v-card>
        <br  v-if="index < aces.length - 1">
      </v-layout>
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
      rightDrawer: false,
      acePage: [
        {
          type: 'combo',
          label: 'Type C2',
          bound: 'typeC2',
          multiple: false,
          items: ['Condition', 'Action', 'Expression']
        },
        {
          type: 'combo',
          label: 'Type C3',
          bound: 'typeC3',
          multiple: false,
          items: ['conditions', 'actions', 'expressions']
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
          label: 'C2 Id',
          bound: 'idC2'
        },
        {
          type: 'text',
          label: 'C3 Id',
          bound: 'idC3'
        },
        {
          type: 'combo',
          label: 'Flags C2',
          bound: 'flagC2',
          multiple: true,
          items: ['cf_none', 'cf_trigger', 'cf_fake_trigger', 'cf_static', 'cf_not_invertible', 'cf_deprecated', 'cf_incompatible_with_triggers', 'cf_looping', 'af_none', 'af_deprecated', 'ef_return_number', 'ef_return_string', 'ef_return_any', 'ef_variadic_parameters', 'ef_deprecated']
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
          label: 'Display string',
          bound: 'displayString'
        },
        {
          type: 'div'
        },
        {
          type: 'text',
          label: 'Script name',
          bound: 'displayString'
        },
        {
          type: 'props',
          label: 'Properties',
          bound: 'props'
        },
        {
          type: 'code',
          label: 'Code C2',
          bound: 'codeC2'
        },
        {
          type: 'code',
          label: 'Code C3',
          bound: 'codeC3'
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
        visible: true,
        isCombo: false,
        typeC2: '',
        typeC3: '',
        categoryName: '',
        categoryId: '',
        idC2: 0,
        idC3: '',
        flagC2: [],
        highlight: false,
        name: '',
        displayString: '',
        description: '',
        script: '',
        props: [],
        codeC2: '',
        codeC3: ''
      },
      defaultProp: {
        visible: true,
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
        visible: true,
        id: '',
        text: ''
      },
      info: {
        title: 'Test',
        content: ['Test']
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
    },
    moveUpAce (index) {
      var temp = this.aces[index - 1]
      this.aces[index - 1] = this.aces[index]
      this.aces[index] = temp
      this.aces.push({})
      this.aces.splice(this.aces.length - 1, 1)
    },
    moveDownAce (index) {
      var temp = this.aces[index + 1]
      this.aces[index + 1] = this.aces[index]
      this.aces[index] = temp
      this.aces.push({})
      this.aces.splice(this.aces.length - 1, 1)
    },
    removeAce (index) {
      this.aces.splice(index, 1)
    },
    addProp (index) {
      var toAdd = JSON.parse(JSON.stringify(this.defaultProp))
      this.aces[index].props.push(toAdd)
    },
    moveUpProp (index, subindex) {
      var temp = this.aces[index].props[subindex - 1]
      this.aces[index].props[subindex - 1] = this.aces[index].props[subindex]
      this.aces[index].props[subindex] = temp
      this.aces[index].props.push({})
      this.aces[index].props.splice(this.aces[index].props.length - 1, 1)
    },
    moveDownProp (index, subindex) {
      var temp = this.aces[index].props[subindex + 1]
      this.aces[index].props[subindex + 1] = this.aces[index].props[subindex]
      this.aces[index].props[subindex] = temp
      this.aces[index].props.push({})
      this.aces[index].props.splice(this.aces[index].props.length - 1, 1)
    },
    removeProp (index, subindex) {
      this.aces[index].props.splice(subindex, 1)
    },
    addCombo (index, subindex) {
      var toAdd = JSON.parse(JSON.stringify(this.defaultComboParam))
      this.aces[index].props[subindex].comboParams.push(toAdd)
    },
    moveUpCombo (index, subindex, combo) {
      var temp = this.aces[index].props[subindex].comboParams[combo - 1]
      this.aces[index].props[subindex].comboParams[combo - 1] = this.aces[index].props[subindex].comboParams[combo]
      this.aces[index].props[subindex].comboParams[combo] = temp
      this.aces[index].props[subindex].comboParams.push({})
      this.aces[index].props[subindex].comboParams.splice(this.aces[index].props[subindex].comboParams.length - 1, 1)
    },
    moveDownCombo (index, subindex, combo) {
      var temp = this.aces[index].props[subindex].comboParams[combo + 1]
      this.aces[index].props[subindex].comboParams[combo + 1] = this.aces[index].props[subindex].comboParams[combo]
      this.aces[index].props[subindex].comboParams[combo] = temp
      this.aces[index].props[subindex].comboParams.push({})
      this.aces[index].props[subindex].comboParams.splice(this.aces[index].props[subindex].comboParams.length - 1, 1)
    },
    removeCombo (index, subindex, combo) {
      this.aces[index].props[subindex].comboParams.splice(combo, 1)
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
      this.aces[index].visible = true
      setTimeout(() => {
        this.$vuetify.goTo('#ace' + index, {duration: 500, offset: -100, easing: 'easeInOutCubic'})
      }, 10)
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