<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-4">
      <v-card>
        <v-layout row>
          <v-card-title class="headline">Plugin Info</v-card-title>
          <v-spacer></v-spacer>
          <v-layout column align-end>
            <v-layout row align-center>
              <info :title="info.title" :content="info.content"/>
            </v-layout>
          </v-layout>
        </v-layout>
        <v-divider></v-divider>
        <v-container grid-list-md>
          <v-layout column>
            <v-flex v-for="(item, index) in page" :key="index">
              <v-text-field v-if="item.type == 'text'"
                :name="index"
                :label="item.label"
                id="id"
                v-model="pluginInfo[item.bound]"
              ></v-text-field>

              <v-divider v-if="item.type == 'div'"></v-divider>
              
              <v-combobox v-if="item.type == 'combo'"
                v-model="pluginInfo[item.bound]"
                :name="index"
                :items="item.items"
                :label="item.label"
                :multiple="item.multiple"
                :chips="item.multiple"
                :deletable-chips="item.multiple"
                hide-no-data
              ></v-combobox>

              <v-checkbox v-if="item.type == 'check'"
                v-model="pluginInfo[item.bound]"
                :label="item.label"
              ></v-checkbox>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import info from './Misc/Info'
export default {
  name: 'PluginInfo',
  components: {info},
  data () {
    return {
      page: [
        {
          type: 'text',
          label: 'Plugin Name',
          bound: 'name'
        },
        {
          type: 'text',
          label: 'Version',
          bound: 'version'
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
          label: 'Author',
          bound: 'author'
        },
        {
          type: 'text',
          label: 'Website',
          bound: 'website'
        },
        {
          type: 'text',
          label: 'Help URL',
          bound: 'helpUrl'
        },
        {
          type: 'div'
        },
        {
          type: 'text',
          label: 'C2 Category',
          bound: 'c2Category'
        },
        {
          type: 'combo',
          label: 'C3 Category',
          bound: 'c3Category',
          multiple: false,
          items: ['data-and-storage', 'form-controls', 'general', 'input', 'media', 'monetisation', 'platform-specific', 'web', 'other']
        },
        {
          type: 'div'
        },
        {
          type: 'text',
          label: 'Plugin ID',
          bound: 'id'
        },
        {
          type: 'div'
        },
        {
          type: 'combo',
          label: 'Type',
          bound: 'type',
          multiple: false,
          items: ['object', 'world']
        },
        {
          type: 'check',
          label: 'Rotatable',
          bound: 'rotatable'
        },
        {
          type: 'check',
          label: 'C3 Supports Effects',
          bound: 'supportsEffects'
        },
        {
          type: 'check',
          label: 'C3 Can Be Bundled',
          bound: 'canBeBundled'
        },
        {
          type: 'check',
          label: 'C3 Is Resizable',
          bound: 'resizable'
        },
        {
          type: 'check',
          label: 'C3 Must Predraw',
          bound: 'mustPredraw'
        },
        {
          type: 'combo',
          label: 'Flags',
          bound: 'flags',
          multiple: true,
          items: ['Single Global', 'Texture', 'Animations', 'Tiling', 'Position Aces', 'Angle Aces', 'Size Aces', 'Appearance Aces', 'Zorder Aces', 'Deprecated']
        },
        {
          type: 'combo',
          label: 'Supported runtimes',
          bound: 'supportedRuntimes',
          multiple: true,
          items: ['c2', 'c3']
        }
      ],
      pluginInfo: {
        name: 'MyPlugin',
        version: '',
        description: '',
        author: '',
        website: '',
        helpUrl: '',
        c2Category: '',
        c3Category: '',
        id: 'MyPlugin',
        type: '',
        rotatable: false,
        supportsEffects: true,
        canBeBundled: true,
        resizable: true,
        mustPredraw: false,
        flags: [],
        supportedRuntimes: ['c2', 'c3']
      },
      info: {
        title: 'Plugin Info',
        content: [
          'Here you specify the plugin\'s information.',
          'You\'ll specify which runtimes you support. So if you don\'t support one of them, you will not need to fill info about that unsupported runtime.'
        ]
      }
    }
  },
  watch: {
    pluginInfo: {
      handler (val) {
        localStorage.pluginInfo = JSON.stringify(this.pluginInfo)
      },
      deep: true,
      immediate: false
    }
  },
  mounted () {
    if (localStorage.pluginInfo) {
      this.pluginInfo = JSON.parse(localStorage.pluginInfo)
    }
  }
}
</script>

<style scoped>
  .centered
  {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo
  {
    max-width: 100%;
  }

  .link-btn
  {
    width: 150px;
  }
</style>
