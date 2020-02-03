<template>
    <div>
        <div>
            Philipshue
        </div>

        <table>
            <td v-for="(infotitem,index) in infos" v-bind:key="index">
            [[ {{index}} - {{infotitem}} ]]
        </td>
        </table>
    </div>
</template>
<script>
const url="http://localhost:3000/getPhilipshueInfo"
    export default {
        name: 'Philipshue',
        data() {
            return {
                infos: ''
            }
        },
        created() {
            console.log("Philipshue page create");
            const $ths = this;
            fetch(url).then(function(response){
                response.json().then(function(data) {
                    console.log(data);
                    $ths.infos=data;
                });
            })
            
            
        },
        methods: {
        },
    };
</script>