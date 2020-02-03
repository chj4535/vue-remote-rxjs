<template>
    <div>
       <div>
            Weather
        </div>

        <!-- <div>
            {{infos}}
        </div> -->
        <table>
        <tr v-for="(infoitems,index) in infos" v-bind:key="index">
            <td v-for="(infotitem,index) in infoitems" v-bind:key="index" v-if>
            [[ {{index}} - {{infotitem}} ]]
        </td>
        </tr>
        </table>
    </div>
</template>
<script>
const url="http://localhost:3000/getWeatherInfo"
    export default {
        name: 'Weather',
        data() {
            return {
                infos: ''
            }
        },
        created() {
            console.log("Weather page create");
            const $ths = this;
            fetch(url).then(function(response){
                response.json().then(function(data) {
                    console.log(data);
                    $ths.infos=data;
                });
            })
            
            
        },
        methods: {
            sendSubmit() {
                console.log("sendSubmit", this.inputmsg);
                this.$emit('sendSubmit', this.inputmsg);
            }
        },
    };
</script>