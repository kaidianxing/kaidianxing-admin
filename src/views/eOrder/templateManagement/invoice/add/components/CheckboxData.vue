/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
<template>
    <div class="invoice-checkbox-data">
        <ul>
            <template v-for="(item, index) in list">
                <li :key="index" :class="{action: checkedKey === item.key}">
                    <div class="title">
                        <Checkbox :value="item.checked" :indeterminate="item.indeterminate" :disabled="item.disabled" @on-change="changeItem(index)">
                            <span>{{item.name}}</span>
                        </Checkbox>
                    </div>
                    <ul v-if="item.children">
                        <li v-for="(child, childIndex) in item.children" :key="childIndex">
                            <Checkbox :value="child.checked" :disabled="child.disabled" @on-change="changeChildItem(index, childIndex)">
                                <span>{{child.name}}</span>
                            </Checkbox>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "CheckboxData",
        props: {
            list: {
                type: Array,
                default: () => []
            },
            checkedKey: {
                type: String
            }
        },
        methods: {
            // 第一层级选中
            changeItem(index) {
                let item = this.list[index];
                item.checked = !item.checked;
                item.indeterminate = false;
                item.children.forEach(child => {
                    child.checked = item.checked;
                })
                this.changeKey(item.key);
               this.refreshList();
            },
            // 第二层选中
            changeChildItem(index, childIndex) {
                let item = this.list[index],
                    childItem = item.children[childIndex];
                childItem.checked = !childItem.checked;
                this.changeKey(item.key)
                this.setChecked(item)
                this.refreshList();
            },
            setChecked(item) {
                let childChecked = item.children.filter(child => {
                    return child.checked
                })
                if (childChecked.length === item.children.length) {
                    item.checked = true;
                    item.indeterminate = false;
                } else {
                    item.checked = false;
                    item.indeterminate = !!childChecked.length;
                }
            },
            setDefault(list) {
                list.forEach(item => {
                    this.changeChildItem(item)
                })
                this.list = list;
            },
            refreshList() {
               this.$emit('on-change', this.list);
            },
            changeKey(key) {
                this.$emit('on-change-key', key)
            }
        }
    };
</script>

<style scoped lang="scss">
    .invoice-checkbox-data {
        border: 1px solid $border-color;
        min-width: 480px;
        max-width: 900px;
        >ul {
            > li {
                display: flex;
                align-items: center;
                border-bottom: 1px solid $border-color;
                //background-color: $background-color;
                box-sizing: border-box;
                &:last-child {
                    border-bottom: none;
                }
                &.action {
                    background-color: $brand-light;
                }
                > .title {
                    padding: 16px 20px;
                    @include font-14-20-bold;
                    color: $text-first;

                    flex-shrink: 0;
                    width: 180px;
                }
                > ul {
                    display: flex;
                    align-items: center;
                    padding: 16px 16px 0 16px;
                    /*background-color: #ffffff;*/
                    width: 0;
                    flex: 1;
                    flex-wrap: wrap;
                    border-left: 1px solid $border-color;
                    margin-right: -15px;
                    > li {
                        width: 140px;
                        padding-bottom: 16px;
                        padding-right: 10px;
                        /*width: 50%;*/
                    }
                }
            }
        }
    }
</style>
