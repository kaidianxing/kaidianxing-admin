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
    <kdx-modal-frame v-model="value" title="添加标签" class-name="shop-label-modal" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <div class="shop-label">
            <!--默认标签-->
            <div v-if="recommendList.length > 0" class="recommend">
                <p class="title">推荐标签</p>
                <div class="label-content-recommend">
                    <div v-for="(item, index) in recommendList" :key="index" class="shop-label-item"
                         :class="{checked: item.checked}" @click="setLabelChecked('recommend', index, !item.checked)">
                       <span> {{item.name}}</span>
                       <kdx-svg-icon type="icon-chenggong-shixin-y" class="icon"></kdx-svg-icon>
                    </div>
                </div>
            </div>
            <!--自定义标签-->
            <div class="custom">
                <div class="recommend">
                    <p class="title">
                        <span class="custom">自定义标签组</span>
                        <Button type="text" @click="addLabel">+新建标签组</Button>
                        <Button type="text" @click="getLabelData">刷新</Button>
                    </p>
                    <div v-if="customList.length > 0" class="label-content">
                        <div v-for="(item, index) in customList" :key="index" class="label-content-box">
                            <div class="custom-title">
                                {{item.name}}
                            </div>
                            <div class="shop-label-item-box">
                                <div v-for="(child, childIndex) in item.label" :key="childIndex" class="shop-label-item"
                                     :class="{checked: child.checked}"
                                     @click="setLabelChecked('custom', childIndex, !child.checked, index)">
                                    <span> {{child.name}}</span>
                                    <kdx-svg-icon type="icon-chenggong-shixin-y" class="icon"></kdx-svg-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="label-no">暂无数据</div>
                </div>
            </div>
            <Spin fix v-show="loading"></Spin>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "ShopLabel",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            // 默认选中
            defaultCheckedList: {
                type: Array,
                default: () => []
            },
            // 当前选中值
            currentList: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                selectRows: [], // 选中的值
                // 推荐标签
                recommendList: [],
                // 自定义标签
                customList: [],
                loading: false
            };
        },
        watch: {
            value: {
                handler(val) {
                    if (val) {
                        if (this.currentList.length > 0) {
                            this.selectRows = [...this.currentList];
                        } else if (this.defaultCheckedList.length > 0) {
                            this.selectRows = [...this.defaultCheckedList];
                        }
                        this.getLabelData();
                    }
                },
                immediate: true
            }
        },
        methods: {
            handleCancel() {
                this.$emit('on-cancel');
                this.initData();
            },
            handleOk() {
                this.$emit('on-change', JSON.parse(JSON.stringify(this.selectRows)));
                this.initData();
            },
            addLabel() {
                this.handleCancel();
                this.$utils.openNewWindowPage('/goods/label/add')
            },
            // 初始化默认选中设置
            initDefaultChecked() {
                if (this.selectRows.length > 0) {
                    this.selectRows.forEach(current => {
                        this.recommendList.forEach((item, index) => {
                            if (item.id === current.id) {
                                this.$set(this.recommendList[index], 'checked', true);
                            }
                        });
                        this.customList.forEach((item, childIndex) => {
                            item.label && item.label.forEach((child,index) => {
                                if (child.id === current.id) {
                                    this.$set(this.customList[childIndex].label[index], 'checked', true);
                                }
                            })
                        });
                    });
                }
            },
            // 选中与取消选中
            setLabelChecked(type, index, checked, groupIndex) {
                if (type === 'recommend') { // 推荐
                    this.$set(this.recommendList[index], 'checked', checked);
                    if (checked) {
                        this.selectRows.push(this.recommendList[index]);
                    } else {
                        let selectIndex = -1;
                        this.selectRows.forEach((item, i) => {
                            if (item.id === this.recommendList[index].id) {
                                selectIndex = i;
                            }
                        });
                        this.selectRows.splice(selectIndex, 1);
                    }
                } else if (type === 'custom') { // 自定义
                    this.$set(this.customList[groupIndex].label[index], 'checked', checked);
                    if (checked) {
                        this.selectRows.push(this.customList[groupIndex].label[index]);
                    } else {
                        let selectIndex = -1;
                        this.selectRows.forEach((item, i) => {
                            if (item.id === this.customList[groupIndex].label[index].id) {
                                selectIndex = i;
                            }
                        });
                        this.selectRows.splice(selectIndex, 1);
                    }
                }
            },
            // 初始化data数据
            initData() {
                this.recommendList.forEach(item => {
                    item.checked = false;
                });
                this.customList.forEach(item => {
                    item.label && item.label.forEach(child => {
                        child.checked = false;
                    });
                });
            },
            getLabelData() {
                this.loading = true;
                this.$api.goodsApi.getGoodLabel({pager: '0'})
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.customList = res.data || [];
                            this.recommendList = res.recommend || [];
                            this.initDefaultChecked();
                        }
                    });
            },
        }
    };
</script>

<style scoped lang="scss">
    .shop-label-modal {
        .shop-label {
            padding: 30px 20px;

            .title {
                @include font-14-20-bold;
                color: $text-first;
                padding: 0 20px 10px 0;

                > .ivu-btn {
                    padding-left: 20px;
                }
            }
            .shop-label-item {
                position: relative;
                color: $text-first;
                @include font-14-20;
                padding: 2px 8px;
                border: 1px solid $border-color;
                margin: 0 10px 10px 0;
                border-radius: 2px;
                cursor: pointer;
                .icon {
                    position: absolute;
                    font-size: 14px;
                    color: $warning-color;
                    right: -7px;
                    bottom: -7px;
                    display: none;
                }
            }

            .checked {
                background-color: $warning-light;
                border-color: $warning-color;
                color: $warning-color;
                .icon {
                    display: inline-block;
                }
            }
            .label-content-recommend {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 30px;
            }
            .label-content {
                .label-content-box {
                    margin-bottom: 10px;
                    background-color: $background-color;
                    border-radius: 2px;
                    padding: 20px;
                    .custom-title {
                        font-weight: bold;
                        margin-bottom: 10px;
                        color: $text-first;
                    }
                    .shop-label-item-box {
                        display: flex;
                        flex-wrap: wrap;
                        margin-bottom: -10px;
                        .shop-label-item {
                            background-color: #ffffff;
                        }
                        .checked {
                            background-color: $warning-light;
                        }
                    }
                }
            }
        }
        .label-no {
            padding: 10px;
            text-align: center;
        }
    }
</style>
