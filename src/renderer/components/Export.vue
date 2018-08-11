<template>
    <v-layout column wrap align-center fill-height>
        <v-layout row wrap align-center fill-height>
            <v-btn block dark @click.stop="exportPlugin">Export</v-btn>
        </v-layout>
        <v-dialog
                v-model="sucessDialog"
                max-width="500px"
        >
            <v-card>
                <v-card-title primary-title class="headline success">
                    Success!
                </v-card-title>
                <v-card-text>
                    Your project was successfully exported.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click.stop="open(true)">Open Code Templater</v-btn>
                    <v-btn color="success" @click.stop="open(false)">Open in explorer</v-btn>
                    <v-btn color="success" @click.stop="sucessDialog = false">Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
  import fs from 'fs-extra'

  const dialogOptions = {
    defaultPath: 'c:/',
    filters: [
      {name: 'Code Templater Files',
        extensions: ['cote']
      }],
    properties: ['openDirectory']
  }

  export default {
    data () {
      return {
        saveFile: [
          'pluginInfo',
          'properties',
          'globalVarsCode',
          'functions',
          'aces'
        ],
        safeLS: [
          `{
            "name": "MyPlugin",
            "version": "",
            "description": "",
            "author": "",
            "website": "",
            "helpUrl": "",
            "c2Category": "",
            "c3Category": "",
            "id": "MyPlugin",
            "type": "",
            "rotatable": false,
            "supportsEffects": true,
            "flags": [],
            "supportedRuntimes": ["c2", "c3"]
          }`,
          '[]',
          '{"c2": "", "c23": "", "c3": ""}',
          '{"cons": "", "routines": "", "instance": ""}',
          '[]'
        ],
        flags: {
          'Action': {
            'None': 'af_none',
            'Deprecated': 'af_deprecated'
          },
          'Condition': {
            'None': 'cf_none',
            'Trigger': 'cf_trigger',
            'Fake trigger': 'cf_fake_trigger',
            'Static': 'cf_static',
            'Not invertible': 'cf_not_invertible',
            'Deprecated': 'cf_deprecated',
            'Incompatible with triggers': 'cf_incompatible_with_triggers',
            'Looping': 'cf_looping'
          },
          'Expression': {
            'Return Number': 'ef_return_number',
            'Return String': 'ef_return_string',
            'Return Any': 'ef_return_any',
            'Variadic Parameters': 'ef_variadic_parameters',
            'Deprecated': 'ef_deprecated'
          },
          'Plugin': {
            'Single Global': 'pf_singleglobal',
            'Texture': 'pf_texture',
            'Animations': 'pf_animations',
            'Tiling': 'pf_tiling',
            'Angle Aces': 'pf_angle_aces',
            'Position Aces': 'pf_position_aces',
            'Size Aces': 'pf_size_aces',
            'Appearance Aces': 'pf_appearance_aces',
            'Zorder Aces': 'pf_zorder_aces',
            'Deprecated': 'pf_deprecated'
          }
        },
        path: '',
        sucessDialog: false
      }
    },
    methods: {
      exportPlugin () {
        this.$electron.remote.dialog.showOpenDialog(dialogOptions, filePath => {
          if (filePath !== undefined) {
            try {
              this.safeLocalStorage()
              var ace = this.createACEFile()
              var general = this.createGeneralFile()
              var templatePath = this.$electron.remote.app.getAppPath().split('\\')
              templatePath.pop()
              templatePath = templatePath.join('\\') + '/pluginExport'
              fs.copySync(templatePath, filePath[0])
              fs.writeFileSync(filePath[0] + '/instructions/aces.cote', ace, 'utf-8')
              fs.writeFileSync(filePath[0] + '/instructions/general.cote', general, 'utf-8')
              this.path = filePath[0]
              this.sucessDialog = true
            } catch (e) {
              alert('Failed to save the file ! \nSee the console for more info.\nPlease report this to me so I can fix it.\n\nError: \n' + e)
            }
          }
        })
      },
      createACEFile () {
        const aces = JSON.parse(localStorage.aces)
        let fileText = ''

        for (let i = 0; i < aces.length; i++) {
          const ace = aces[i]
          const acesc2edittime = ace.type
          const acesc3edittime = ace.type.toLowerCase() + 's'
          const categoryname = ace.categoryName
          const categoryid = ace.categoryId
          /* ------------------ */
          const c2id = i
          const c3id = ace.idC3
          const c2flags = this.getFlags(ace)
          const highlight = ace.highlight
          const listname = ace.name
          const displaystring = ace.displayString
          const description = ace.description
          /* ------------------ */
          const scriptname = ace.script
          /* ------------------ */
          let hascomboprop = false
          ace.props.forEach(prop => {
            hascomboprop |= prop.isCombo
          })

          let propsText = ''

          for (let j = 0; j < ace.props.length; j++) {
            const prop = ace.props[j]
            const paramtypec2 = prop.typeC2
            const paramtypec3 = prop.typeC3
            const paramidc3 = prop.idC3
            const paramlabel = prop.label
            const paramdescription = prop.description
            const paraminitialvalue = prop.initialValue
            const paraminitcomboc2 = prop.comboC2Init
            const paraminitcomboc3 = prop.comboC3Init
            let comboParams = ''
            if (prop.isCombo) {
              prop.comboParams.forEach(combo => {
                const id = combo.id
                const text = combo.text
                const comboText = '@@@PARAM_COMBO_ID ' + id + '\n@@@PARAM_COMBO_TEXT ' + text
                comboParams += comboText + '\n\n'
              })
            }
            const paramText = '@@@PARAMSTART\n' +
            (hascomboprop ? '@@@IS_COMBO_PARAM ' + (prop.isCombo ? 'ligma' : '') + '\n' : '') +
            '@@@PARAM_TYPE_C2 ' + paramtypec2 + '\n' +
            '@@@PARAM_TYPE_C3 ' + paramtypec3 + '\n' +
            '@@@PARAM_ID_C3 ' + paramidc3 + '\n' +
            '@@@PARAM_LABEL ' + paramlabel + '\n' +
            '@@@PARAM_DESCRIPTION ' + paramdescription + '\n' +
            (prop.isCombo
              ? '@@@PARAM_INIT_COMBO_C3' + paraminitcomboc3 + '\n' +
              '@@@PARAM_INIT_COMBO_C2' + paraminitcomboc2 + '\n\n'
              : '@@@PARAM_INIT_VALUE ' + paraminitialvalue + '\n'
            ) +
            comboParams + ''

            propsText += paramText + '\n'
          }
          /* ------------------ */
          const script = ace.codeC2
          const scriptC3 = ace.codeC3

          const aceText = '{ ACE \n\n' +
          '@@@ACES_C2_EDITTIME ' + acesc2edittime + '\n' +
          '@@@ACES_C3_JSON_TYPE ' + acesc3edittime + '\n' +
          '@@@CATEGORY_ID ' + categoryid + '\n' +
          '@@@CATEGORY_NAME ' + categoryname + '\n\n' +
          '@@@ID_C2 ' + c2id + '\n' +
          '@@@ID_C3 ' + c3id + '\n' +
          '@@@FLAGS_C2 ' + c2flags + '\n' +
          '@@@HIGHLIGHT ' + highlight + '\n' +
          '@@@LIST_NAME ' + listname + '\n' +
          '@@@DISPLAY_STRING ' + displaystring + '\n' +
          '@@@DESCRIPTION ' + description + '\n\n' +
          '@@@SCRIPT_NAME ' + scriptname + '\n\n' +
          (propsText === '' ? '' : '{\n' + propsText + '}') +
          '\n###SCRIPT\n' + script + '\n###' + '\n' +
          (acesc2edittime === 'Expression' ? '###SCRIPT_C3_RUNTIME\n' + scriptC3 + '\n###' + '\n' : '') +
          '}'

          fileText += aceText + '\n\n'
        }
        return fileText
      },
      createGeneralFile () {
        const fileText = this.getPluginInfo() + '\n' +
        this.getProps() + '\n' +
        this.getGlobalVariables() + '\n' +
        this.getFunctions()
        return fileText
      },
      getPluginInfo () {
        const pluginInfo = JSON.parse(localStorage.pluginInfo)
        const fileText = '@@@PLUGIN_NAME ' + pluginInfo.name + '\n' +
        '@@@PLUGIN_VERSION ' + pluginInfo.version + '\n' +
        '@@@PLUGIN_DESCRIPTION ' + pluginInfo.description + '\n' +
        '@@@PLUGIN_AUTHOR ' + pluginInfo.author + '\n' +
        '@@@PLUGIN_AUTHOR_WEBSITE ' + pluginInfo.website + '\n' +
        '@@@PLUGIN_HELP_URL ' + pluginInfo.helpUrl + '\n\n' +
        '@@@PLUGIN_CATEGORY_C2 ' + pluginInfo.c2Category + '\n' +
        '@@@PLUGIN_CATEGORY_C3 ' + pluginInfo.c3Category + '\n\n' +
        '@@@PLUGIN_ID ' + pluginInfo.id + '\n' +
        '@@@PLUGIN_ID_IN_LOWER_CASE ' + pluginInfo.id.toLowerCase() + '\n\n' +
        '@@@PLUGIN_IS_OBJECT_TYPE ' + (pluginInfo.type === 'object' ? 'yes' : '') + '\n' +
        '@@@PLUGIN_IS_WORLD_TYPE ' + (pluginInfo.type === 'object' ? '' : 'yes') + '\n' +
        '@@@PLUGIN_FLAGS_C2 ' + this.getPluginFlagsC2(pluginInfo) + '\n' +
        '@@@PLUGIN_ISROTATABLE ' + pluginInfo.rotatable + '\n' +
        '@@@PLUGIN_CANBEBUNDELED_C3 ' + pluginInfo.canBeBundled + '\n' +
        '\n' + this.getPluginFlagsC3(pluginInfo) + '\n\n' +
        '@@@PLUGIN_SUPPORTED_RUNTIMES ' + this.getSupportedRuntimes(pluginInfo) + '\n'
        return fileText
      },
      getProps () {
        const props = JSON.parse(localStorage.properties)
        let fileText = '{ PROPS\n\n'
        props.forEach(prop => {
          const propText = '@@@PROPSTART\n' +
          '@@@ID_C3 ' + prop.name + '\n' +
          '@@@TYPE_C2 ' + prop.description + '\n' +
          '@@@TYPE_C3 ' + prop.initialValue + '\n' +
          '@@@NAME ' + prop.typeC2 + '\n' +
          '@@@DESCRIPTION ' + prop.typeC3 + '\n' +
          '@@@INIT_VALUE ' + prop.idC3 + '\n'
          fileText += propText + '\n'
        })
        fileText += '}'
        return fileText
      },
      getGlobalVariables () {
        const globalVarsCode = JSON.parse(localStorage.globalVarsCode)
        const fileText = '###CONSTRUCT2_C2_RUNTIME\n' +
        globalVarsCode.c2 + '\n' +
        '###\n\n###CONSTRUCT3_C2_RUNTIME\n' +
        globalVarsCode.c23 + '\n' +
        '###\n\n###CONSTRUCT3_C3_RUNTIME\n' +
        globalVarsCode.c3 + '\n' +
        '###'

        return fileText
      },
      getFunctions () {
        const functions = JSON.parse(localStorage.functions)
        const fileText = '###INSTANCE_CONSTRUCTOR_BODY\n' +
        functions.cons + '\n' +
        '###\n\n###ROUTINES\n' +
        functions.routines + '\n' +
        '###\n\n###INSTANCE_OBJECT\n' +
        (functions.instance === '' ? '{}' : functions.instance) + '\n' +
        '###'

        return fileText
      },
      getFlags (ace) {
        const flagsList = ace[ace.type[0] + 'flags']
        const replace = this.flags[ace.type]
        let endArr = []
        flagsList.forEach(flag => {
          endArr.push(replace[flag])
        })
        return endArr.join(' | ')
      },
      getPluginFlagsC2 (plugin) {
        const flagsList = plugin.flags
        const replace = this.flags['Plugin']
        let endArr = []
        flagsList.forEach(flag => {
          endArr.push(replace[flag])
        })
        return endArr.join(' | ')
      },
      getPluginFlagsC3 (plugin) {
        const flagsList = plugin.flags
        const text = '' +
        '@@@PLUGIN_ISSINGLEGLOBAL_C3 ' + this.getHasFlag(flagsList, 'Single Global', 'true', 'false') + '\n' +
        '@@@PLUGIN_ISRESIZABLE_C3 ' + (plugin.resizable ? 'true' : 'false') + '\n' +
        '@@@PLUGIN_HASIMAGE_C3 ' + this.getHasFlag(flagsList, 'Texture', 'true', 'false') + '\n' +
        '@@@PLUGIN_ISTILED_C3 ' + this.getHasFlag(flagsList, 'Tiling', 'true', 'false') + '\n' +
        '@@@PLUGIN_ISDEPRECATED_C3 ' + this.getHasFlag(flagsList, 'Deprecated', 'true', 'false') + '\n' +
        '@@@PLUGIN_SUPPORTSEFFECTS ' + (plugin.supportsEffects ? 'true' : 'false') + '\n' +
        '@@@PLUGIN_MUSTPREDRAW ' + (plugin.mustPredraw ? 'true' : 'false') + '\n\n' +
        '@@@PLUGIN_AddCommonPositionACEs ' + this.getHasFlag(flagsList, 'Position Aces', 'yes', '') + '\n' +
        '@@@PLUGIN_AddCommonSizeACEs ' + this.getHasFlag(flagsList, 'Size Aces', 'yes', '') + '\n' +
        '@@@PLUGIN_AddCommonAngleACEs ' + this.getHasFlag(flagsList, 'Angle Aces', 'yes', '') + '\n' +
        '@@@PLUGIN_AddCommonAppearanceACEs ' + this.getHasFlag(flagsList, 'Appearance Aces', 'yes', '') + '\n' +
        '@@@PLUGIN_AddCommonZOrderACEs ' + this.getHasFlag(flagsList, 'Zorder Aces', 'yes', '') + '\n'

        return text
      },
      getHasFlag (flagList, flag, ifHas, ifHasnt) {
        if (flagList.includes(flag)) {
          return ifHas
        } else {
          return ifHasnt
        }
      },
      getSupportedRuntimes (plugin) {
        let array = plugin.supportedRuntimes
        for (let index = 0; index < array.length; index++) {
          array[index] = '"' + array[index] + '"'
        }
        const result = array.join(', ')
        return result
      },
      open (CodeTemplater) {
        if (CodeTemplater) {
          this.$electron.shell.openExternal('https://valerypopoff-templater.glitch.me/')
        } else {
          this.$electron.shell.openItem(this.path)
        }
      },
      safeLocalStorage () {
        for (let index = 0; index < this.saveFile.length; index++) {
          const element = this.saveFile[index]
          if (!localStorage[element]) {
            localStorage[element] = this.safeLS[index]
          }
        }
      }
    }
  }
</script>


<style scoped>
    .image {
        width: 150px;
        height: 100px;
        transition: all 0.5s;
    }

    .image:hover {
        width: 200px;
    }
</style>
