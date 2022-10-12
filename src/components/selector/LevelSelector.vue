/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <kdx-modal-frame v-model="value" title="会员等级标签" :loading="loading" class-name="shop-label-modal" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <div class="shop-label">
            <!--自定义标签-->
            <div class="custom">
                <div v-if="list.length > 0" class="recommend">
                    <!--                    <p class="title">自定义标签</p>-->
                    <div class="label-content">
                        <div v-for="(item, index) in list" :key="index" class="shop-label-item"
                             :class="{checked: item.checked}"
                             @click="setLabelChecked(index, !item.checked)">
                            <span> {{item.level_name}}</span>
                            <kdx-svg-icon type="icon-chenggong-shixin" class="icon"></kdx-svg-icon>
                        </div>
                    </div>
                </div>
                <div v-else style="text-align: center">
                    暂无数据
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    import {memberApi} from "../../api/member";

    export default {
        name: "levelSelector",
        props: {
            currentList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                value: false,
                selectRows: [], // 选中的值
                list: [],
              loading: false
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                  this.selectRows = [...this.currentList] || [];
                    this.getLabelData();
                }
            },
            handleCancel() {
                this.setValue();
            },
            handleOk() {
                this.$emit('on-change', JSON.parse(JSON.stringify(this.selectRows)));
                this.setValue();
            },
            // 初始化默认选中设置
            initDefaultChecked() {
                if (this.currentList.length > 0) {
                    this.list.forEach((item, index) => {
                        for (let current of this.selectRows) {
                            if (item.id === current.id) {
                                this.$set(this.list[index], 'checked', true);
                                break;
                            }
                        }
                    });
                }
            },
            // 选中与取消选中
            setLabelChecked(index, checked) {
                this.$set(this.list[index], 'checked', checked);
                if (checked) {
                    this.selectRows.push(this.list[index]);
                } else {
                    let selectIndex = -1;
                    this.selectRows.forEach((item, i) => {
                        if (item.id === this.list[index].id) {
                            selectIndex = i;
                        }
                    });
                    this.selectRows.splice(selectIndex, 1);
                }
            },
            getLabelData() {
              this.loading = true;
                this.$api.memberApi.getLevelList({is_all: 1})
                    .then(res => {
                      this.loading = false;
                        if (res.error === 0) {
                            this.list = res.list || [];
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
                padding: 0 20px 20px 0;
            }
            .label-content {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 20px;
                .shop-label-item {
                    position: relative;
                    color: $text-first;
                    @include font-14-20;
                    padding: 2px 8px;
                    border: 1px solid $border-color;
                    margin: 0 10px 20px 0;
                    border-radius: 2px;
                    cursor: pointer;
                    .icon {
                        position: absolute;
                        font-size: 14px;
                        right: -7px;
                        bottom: -7px;
                        display: none;
                    }
                }
                .checked {
                    background-color: $brand-light;
                    border-color: $brand-color;
                    color: $brand-color;
                    .icon {
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>
