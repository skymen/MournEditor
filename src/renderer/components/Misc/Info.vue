<template>
    <v-dialog
        v-model="dialog"
        max-width="500px"
    >
        <v-tooltip bottom slot="activator">
            <v-btn flat icon slot="activator">
                <v-icon>info</v-icon>
            </v-btn>
            Info
        </v-tooltip>
        <v-card>
            <v-card>
                <v-card-title 
                class="headline grey darken-2"
                primary-title
                >
                    <span class="headline">{{title}}</span>
                </v-card-title>
                <v-card-text>
                    <p v-for="(item, i) in content" :key="i">
                        {{item}}
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="dialog = false">{{close}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'Info',
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: Array,
      required: true
    },
    close: {
      type: String,
      required: false,
      default: 'Ok'
    }
  },
  data () {
    return {
      dialog: false
    }
  }
}
</script>

