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
    export default {
        name: 'Weather',
        props:['infos'],
        data() {
            return {
                inputmsg: ''
            }
        },
        methods: {
            sendSubmit() {
                console.log("sendSubmit", this.inputmsg);
                this.$emit('sendSubmit', this.inputmsg);
            }
        },
    };
</script>