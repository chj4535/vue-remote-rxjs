<template>
    <div>
        remotepage
        <Philipshue :infos="philipshueInfo"/>
        <Sensibo :infos="sensiboInfo"/>
        <Weather :infos="weatherInfo"/>
        
    </div>
</template>

<script>
    import Philipshue from '@/components/Philipshue.vue'
    import Weather from '@/components/Weather.vue'
    import Sensibo from '@/components/Sensibo.vue'

    export default {
        data() {
            return {
                philipshueInfo:{},
                weatherInfo:{},
                sensiboInfo:{},
            }
        },
        created() {
            console.log("Remote page create");
            const $ths = this;


        },
        components: {
            'Philipshue': () => import('@/components/Philipshue.vue'),
            'Weather': () => import('@/components/Weather.vue'),
            'Sensibo': () => import('@/components/Sensibo.vue'),
        }
    }
</script>
