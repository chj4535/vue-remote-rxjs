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
    export default {
        name: 'Philipshue',
        props: ["infos"],
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