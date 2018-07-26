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
        :key="el.id"
      class="list-complete-item"
      >
        <v-divider v-if="index === 0"/>
        <v-list-tile 
          :key="el.id" 
          ripple
        >
          <v-list-tile-title>
            {{index}}. {{el.name}}
          </v-list-tile-title>
          <v-spacer/>
          <v-icon class="handle">menu</v-icon>
        </v-list-tile>
        <v-divider/>
      </div>
    </transition-group>
    </draggable>
  </v-list>
</template>
<script>
import draggable from "vuedraggable";

export default {
  name: "DraggableList",
  props: {
    data: {
      type: Array,
      required: true
    },
    update: {
      type: Function,
      required: true
    },
    name: {
      type: String,
      required: false,
      default: "name"
    }
  },
  data() {
    return {};
  },
  computed: {
    dataFiltered: {
      get() {
        return this.data;
      },
      set(data) {
        this.update(data);
      }
    }
  },
  components: { draggable },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-complete-item {
  transition: all 0.3s;
}
</style>
