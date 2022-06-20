<template>
    <div class="distribution-info">
        <div class="info-item" v-for="item in infoList" :key="item.id" :class="{checked: current === item.id}" @click="clickItem(item.id)">
            <div class="checkbox">
                <Checkbox :value="value.includes(item.id)" @on-change="changeChecked($event, item.id)"></Checkbox>
            </div>
            <div class="image">
                <img :src="item.image" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DistributionInfo",
        props: {
            value: {
                type: Array,
                default: () => []
            },
            infoList: {
                type: Array,
                default: () => []
            },
            current: {
                type: [Number, String],
                default: ''
            }
        },
        data() {
            return {};
        },
        computed: {

        },
        methods: {
            changeChecked(value, id) {
                let checked = [...this.value];
                if (value) {
                    checked.push(id);
                } else {
                    let index = checked.indexOf(id);
                    checked.splice(index, 1);
                }
                this.$emit('on-checked-change', checked);
            },
            clickItem(id) {
                if (this.current !== id) {
                    this.$emit('on-tab-change', id);
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .distribution-info {
        display: flex;
        align-items: center;

        .info-item {
            margin-right: 4px;
            padding: 14px 16px;
            border-radius: 2px 2px 0 0;
            background-color: $border-color;
            display: flex;
            align-items: center;
            cursor: pointer;

            &.checked {
                background-color: #FFFFFF;
            }

            .checkbox {
                line-height: 14px;
                .ivu-checkbox-wrapper {
                    margin-right: 10px;
                    line-height: 14px;
                }
            }

            .image {
                width: 76px;
                height: 20px;

                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }

        }
    }
</style>
