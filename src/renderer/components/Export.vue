<template>
    <v-layout column wrap align-center fill-height>
        <v-layout row wrap align-center fill-height>
            <v-card ripple class="image" @click.stop="exportPlugin()">
                <v-layout column align-center class="image headline grey darken-2">
                    <v-layout row align-center>
                        Export
                    </v-layout>
                </v-layout>
            </v-card>    
        </v-layout>
    </v-layout>
</template>

<script>
export default {
  methods: {
    exportPlugin () {
      console.log('test')
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
