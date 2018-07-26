<template>
  <v-list>
    <draggable 
      v-model="dataFiltered" 
      element="div"
      :options="{handle: '.handle'}"
      @start="drag = true" 
      @end="drag = false">
    <transition-group name="list-complete">
      <div 
        v-for="(el, index) in dataFiltered"
        @click="onSelect(el)"
        :key="index"
        class="list-complete-item"
      >
        <v-list-tile 
          :key="index"
        >
        <v-list-tile-action>
          <v-btn flat icon @click="clicked(index)">
            <v-icon>subdirectory_arrow_right</v-icon>
          </v-btn>
        </v-list-tile-action>
          <v-list-tile-title>
            {{prename}}{{index}}: {{el.name}}
          </v-list-tile-title>
          <v-spacer/>
          <v-icon class="handle">drag_handle</v-icon>
        </v-list-tile>
        <v-divider v-if="index < dataFiltered.length - 1"/>
      </div>
    </transition-group>
    </draggable>
  </v-list>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'DraggableList',
  props: {
    data: {
      type: Array,
      required: true
    },
    update: {
      type: Function,
      required: true
    },
    clicked: {
      type: Function,
      required: false,
      default: null
    },
    name: {
      type: String,
      required: false,
      default: 'name'
    },
    prename: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    dataFiltered: {
      get () {
        return this.data
      },
      set (data) {
        this.update(data)
      }
    }
  },
  components: { draggable },
  methods: {
    onSelect (el) {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-complete-item {
  transition: all 1s;
}
</style>
