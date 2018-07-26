<template>
    <v-layout column wrap align-center fill-height>
        <v-layout row wrap align-center fill-height>
            <v-card ripple class="image">
                <v-card-media src="./src/renderer/assets/logo.png" height="600px" @click="$router.push('/info')">
                </v-card-media>
            </v-card>    
        </v-layout>
    </v-layout>
</template>

<style scoped>
.image {
    width: 800px;
    transition: all 0.5s;
}
.image:hover {
    width: 1000px;
}
</style>
