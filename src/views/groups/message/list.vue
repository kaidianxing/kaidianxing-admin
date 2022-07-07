<template>
    <div class="presell-message-list">
        <div class="presell-message-list-index">
            <notice-list :type="type" @toDetail="toDetail"></notice-list>
        </div>
    </div>
</template>

<script>
    import noticeList from '@/components/notice/noticeList'
    export default {
        name: "index",
        components: {
            noticeList
        },
        props: {},
        data() {
            return {
                type: {
                    plugin_name: 'groups',
                    group_name: 'buyer_notice',
                    group_item_name: 'buyer_notice'
                },
            }
        },
        computed: {},
        created() {
        },
        mounted() {},
        methods: {
            toDetail(obj) {
                this.$router.push({
                    path: '/groups/message/index',
                    query: {
                        type_code: obj.type_code,
                        items: obj.items
                    }
                })
            }
        },
    }
</script>

<style lang="scss">
    .presell-message-list {
        margin-top: 20px;
    }
    .presell-message-list-index {
        padding: 40px;
        margin-top: 20px;
        min-height: 100%;
        background-color: #FFFFFF;
    }
</style>
