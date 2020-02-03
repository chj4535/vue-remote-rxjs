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
            this.$socket.emit('getInfo', {})

            this.$socket.on('CurrentPhilipshueInfo', (data) => {
                console.log("socket on CurrentPhilipshueInfo");
                console.log(data.philipshueInfo);
                $ths.philipshueInfo=data.philipshueInfo;
            });

            this.$socket.on('CurrentWeatherInfo', (data) => {
                console.log("socket on CurrentWeatherInfo");
                console.log(data.weatherInfo);
                $ths.weatherInfo=data.weatherInfo;
            });

            this.$socket.on('CurrentSensiboInfo', (data) => {
                console.log("socket on CurrentSensiboInfo");
                console.log(data.sensiboInfo);
                $ths.sensiboInfo=data.sensiboInfo;
            });
        },
        components: {
            'Philipshue': Philipshue,
            'Weather': Weather,
            'Sensibo': Sensibo,
        }
    }
</script>
