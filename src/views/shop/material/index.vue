<template>
    <div class="material">
        <div class="table-content">
            <div class="tab">
                <ul>
                    <li v-for="item in tabList" :key="item.id" :class="{'tab-active': type === item.id}"
                        @click="selectTab(item.id)">
                        <div class="name">{{ item.name }}</div>
                        <div class="line"></div>
                    </li>
                </ul>
            </div>
            <div class="table-list">
                <images v-if="type==10"></images>
                <videos v-if="type==20"></videos>
            </div>
        </div>
    </div>
</template>

<script>
import images from "./components/images";
import videos from "./components/videos";
export default {
    name: 'index',
    components: {
        images, videos
    },
    data() {
        return {
            value: true,
            type: '10',
            tabList: [
                {
                    id: '10',
                    name: '图片',
                    funName: '',
                    loading: false,
                },
                {
                    id: '20',
                    name: '视频',
                    funName: '',
                    loading: false,
                }
            ],

        };
    },
    computed: {
    },
    created() {

    },
    methods: {
        // 上面tab切换
        selectTab(tab) {
            this.type = tab;
        },
    }
};
</script>

<style scoped lang="scss">
.material {
    min-height: calc(100% - 40px) !important;
    margin: 20px auto;
}
.table-content {
    background-color: #ffffff;
    border-radius: 2px;
    .tab {
        > ul {
            display: flex;
            align-items: center;
            padding-left: 30px;
            border-bottom: 1px solid $border-color;

            > li {
                position: relative;
                padding: 12px 0;
                @include font-18-25-bold;
                color: $text-first;
                cursor: pointer;
                text-align: center;
                box-sizing: content-box;
                width: 90px;
                margin-left: 10px;
                &:first-child {
                    margin-left: 0;
                }

                &.tab-active {
                    color: $brand-color;
                    .line {
                        display: block;
                    }
                }

                .line {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background-color: $brand-color;
                    display: none;
                }
            }
        }
    }
}
</style>
