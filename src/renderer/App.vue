<template>
  <div id="app">
    <v-app :dark="dark">
      <v-navigation-drawer
        fixed
        :permanent="true"
        :mini-variant="miniVariant"
        :clipped="clipped"
        v-model="drawer"
        app
      >
        <v-list>
          <v-tooltip right :disabled="!miniVariant" v-for="(item, i) in items" :key="i">
            <v-list-tile
              router
              :to="item.to"
              exact
              slot="activator"
            >
              <v-list-tile-action>
                <v-icon v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            {{item.title}}
          </v-tooltip>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar fixed app :clipped-left="clipped" class="toolbar">
        <v-toolbar-side-icon @click.native.stop="miniVariant = !miniVariant"></v-toolbar-side-icon>
        <v-dialog v-if="dark"
          v-model="dialog1"
          max-width="500px"
        >
          <v-tooltip bottom slot="activator">
            <v-btn flat icon slot="activator">
              <v-icon>invert_colors</v-icon>
            </v-btn>
            {{dark ? 'Switch to light mode' : 'Switch to dark mode' }}
          </v-tooltip>

          <v-card>
            <v-card>
              <v-card-title
                class="headline red"
                primary-title
              >
                Are you sure?
              </v-card-title>

              <v-card-text>
                You are about to switch to light mode, potentially damaging your eye sight.
              </v-card-text>
              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  flat
                  @click="dialog1 = false"
                >
                  No, nevermind
                </v-btn>
                <v-btn
                  color="red"
                  flat
                  @click="dialog2 = true; dialog1 = false"
                >
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-dialog>

        <v-dialog v-if="dark"
          v-model="dialog2"
          max-width="500px"
        >
          <v-card>
            <v-card light>
              <v-card-title
                class="headline red"
                primary-title
              >
                Broooooo
              </v-card-title>

              <v-card-text>
                Think about what you're doing mate. Is this really what you want?
              </v-card-text>
              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  flat
                  @click="dialog2 = false"
                >
                  Dude you're right
                </v-btn>
                <v-btn
                  color="red"
                  flat
                  @click="dialog2 = false; dark = false"
                >
                  Let me burn my eyes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-dialog>

        <v-tooltip bottom v-if="!dark">
          <v-btn flat icon slot="activator" @click.stop="dark = !dark">
            <v-icon>invert_colors</v-icon>
          </v-btn>
          {{dark ? 'Switch to light mode' : 'Switch to dark mode' }}
        </v-tooltip>

        <v-dialog
          v-model="newFileDialog"
          max-width="500px"
        >
          <v-tooltip bottom slot="activator">
            <v-btn flat icon slot="activator">
              <v-icon>insert_drive_file</v-icon>
            </v-btn>
            New file
          </v-tooltip>

          <v-card>
            <v-card>
              <v-card-title
                class="headline grey-darken2"
                primary-title
              >
                Are you sure?
              </v-card-title>

              <v-card-text>
                You are about to switch to create a new file. Save current progress?
              </v-card-text>
              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  flat
                  @click="newFileDialog = false; save(true)"
                >
                  Yes
                </v-btn>
                <v-btn
                  color="red"
                  flat
                  @click="newFileDialog = false; newFile()"
                >
                  No
                </v-btn>
                <v-btn
                  flat
                  @click="newFileDialog = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-dialog>

        <v-tooltip bottom>
          <v-btn flat icon slot="activator" @click.stop="save()">
            <v-icon>save</v-icon>
          </v-btn>
          Save
        </v-tooltip>

        <v-tooltip bottom>
          <v-btn flat icon slot="activator" @click.stop="saveAs()">
            <v-icon>save_alt</v-icon>
          </v-btn>
          Save As
        </v-tooltip>

        <v-tooltip bottom>
          <v-btn flat icon slot="activator" @click.stop="open()">
            <v-icon>folder_open</v-icon>
          </v-btn>
          Load
        </v-tooltip>

        <v-toolbar-title v-text="title"></v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
      <v-snackbar
        absolute
        auto-height
        bottom
        left
        :timeout="2000"
        value="Saved"
        v-model="saveInfo"
      >
        Saved !
        <v-btn flat color="primary" @click.native="saveInfo = false">Close</v-btn>
      </v-snackbar>
      <v-footer app>
        <span class="ml-2">&copy; Dedra 2018</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import fs from 'fs'

const dialogOptions = {
  defaultPath: 'c:/',
  filters: [
    { name: 'Mourn editor file', extensions: ['mourn'] }],
  properties: ['openFile']
}

export default {
  name: 'mourn-editor',
  data: () => ({
    saveInfo: false,
    clipped: false,
    dark: true,
    reload: false,
    drawer: true,
    dialog1: false,
    dialog2: false,
    newFileDialog: false,
    pageId: null,
    items: [
      { icon: 'apps', title: 'Start', to: '/', needReload: 0 },
      { icon: 'info', title: 'Plugin Info', to: '/info', needReload: 0 },
      { icon: 'arrow_right_alt', title: 'Properties', to: '/props', needReload: 1 },
      { icon: 'vertical_align_top', title: 'Global variables', to: '/global', needReload: 2 },
      { icon: 'functions', title: 'Functions', to: '/functions', needReload: 2 },
      { icon: 'build', title: 'ACES', to: '/aces', needReload: 2 },
      { icon: 'done_all', title: 'Export', to: '/export', needReload: 2 }
    ],
    miniVariant: true,
    title: 'Mourn editor',
    saveFile: [
      'pluginInfo',
      'properties',
      'globalVarsCode',
      'functions',
      'aces'
    ]
  }),
  mounted () {
    if (localStorage.darkMode) {
      this.dark = (localStorage.darkMode === '1')
    }
    setTimeout(() => {
      this.reload = true
    }, 10)
  },
  watch: {
    dark (val) {
      if (!this.reload) return

      if (val) {
        localStorage.darkMode = '1'
      } else {
        localStorage.darkMode = '0'
      }

      const item = this.items.filter(item => item.to === this.$route.path)[0]
      if (item) {
        if (item.needReload === 1) {
          this.$router.push('reload')
        }
        if (item.needReload === 2) {
          location.reload()
        }
      }
    }
  },
  methods: {
    open () {
      this.$electron.remote.dialog.showOpenDialog(dialogOptions, fileName => {
        if (fileName !== undefined) {
          fs.readFile(fileName[0], 'utf-8', (err, data) => {
            if (err) {
              alert('An error occured while importing your file', err)
              return
            }
            const fileData = JSON.parse(data)
            this.saveFile.forEach(element => {
              if (fileData[element]) {
                localStorage[element] = fileData[element]
              }
            })
            this.$router.push('reload')
          })
        }
      })
    },
    save (newFile = false) {
      let fileData = {}
      this.saveFile.forEach(element => {
        if (localStorage[element]) {
          fileData[element] = localStorage[element]
        }
      })
      if (localStorage.savePath) {
        try {
          fs.writeFileSync(localStorage.savePath, JSON.stringify(fileData), 'utf-8')
          this.saveInfo = true
          if (newFile) {
            this.newFile()
          }
        } catch (e) {
          alert('Failed to save the file !')
        }
      } else {
        this.$electron.remote.dialog.showSaveDialog(dialogOptions, fileName => {
          if (fileName !== undefined) {
            try {
              fs.writeFileSync(fileName, JSON.stringify(fileData), 'utf-8')
              localStorage.savePath = fileName
              this.saveInfo = true
              if (newFile) {
                this.newFile()
              }
            } catch (e) {
              alert('Failed to save the file !')
            }
          }
        })
      }
    },
    saveAs () {
      localStorage.removeItem('savePath')
      this.save()
    },
    newFile () {
      this.saveFile.forEach(element => {
        localStorage.removeItem(element)
      })
      localStorage.removeItem('savePath')
      this.$router.push('reload')
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  .cm-trailingspace {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QUXCToH00Y1UgAAACFJREFUCNdjPMDBUc/AwNDAAAFMTAwMDA0OP34wQgX/AQBYgwYEx4f9lQAAAABJRU5ErkJggg==);
    background-position: bottom left;
    background-repeat: repeat-x;
  }
  .CodeMirror { z-index: 0 }
  .CodeMirror-fullscreen {
    z-index: 9999;
  }
  /* Global CSS */
</style>
