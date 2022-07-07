<template>
    <kdx-modal-frame :value="value" title="全部团成员" :width="1000" footerHide @on-cancel="setValue">
        <div class="group-user">
            <ul>
                <li v-for="(item, index) in data" :key="index">
                    <div class="user-avatar">
                        <img :src="$media(item.avatar)" alt="" @error="replaceImage($event, 'avatar')">
                    </div>
                    <div class="user-name">
                        {{ item.order_no ? item.nickname : '虚拟' }}
                    </div>
                </li>
            </ul>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: "GroupUser",
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            value: false,
        };
    },
    methods: {
        setValue() {
            this.value = !this.value;
        },
    }
};
</script>

<style lang="scss" scoped>
.group-user {
    padding: 40px;
    ul {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: -20px;
        margin-bottom: -10px;
        li {
            width: 68px;
            flex-shrink: 0;
            margin-right: 10px;
            margin-bottom: 10px;
            .user-avatar {
                width: 48px;
                height: 48px;
                border-radius: 100%;
                margin: 0 auto;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;
                }
            }
            .user-name {
                width: 68px;
                text-align: center;
                @include font-multiple-omit(2);
            }
        }
    }
}
</style>
