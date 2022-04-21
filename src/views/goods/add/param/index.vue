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
    <div class="good-add-param">
        <div class="box">
            <div class="edit">
                <div class="title">
                    <span>商品参数编辑：</span>
                    <RadioGroup v-model="model_params_switch">
                        <Radio label="1">开启</Radio>
                        <Radio label="0">关闭</Radio>
                    </RadioGroup>
                </div>
                <div v-if="model_params_switch === '1'">
                    <Table :columns="columns" :data="model_params" border draggable @on-drag-drop='dragSort'></Table>
                    <Button class="brand" @click="addSpecification">+添加参数</Button>
                </div>
            </div>
            <div class="preview" v-if="model_params_switch === '1'">
                <p class="title">
                    商品参数预览
                    <kdx-hint-tooltip type="image"
                                  :image="require('@/assets/image/example/shop_params.png')"></kdx-hint-tooltip>
                </p>
                <div class="page">
                    <div class="img-header">
                        <img src="@/assets/image/shop-detail/top-param.png" alt="">
                    </div>
                    <div class="content">
                        <table border="0" cellspacing="0" v-if="model_params.length > 0">
                            <tr v-for="(item, index) in model_params" :key="index">
                                <td>{{ item.key }}</td>
                                <td>{{ item.value }}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="img-footer">
                        <img src="@/assets/image/shop-detail/foot_tab.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    modelMap
} from '../base/components/binders';//所有的 model_params 参数集合
import Sortable from 'sortablejs';

export default {
    name: "index",
    computed: {
        ...modelMap()
    },
    data() {
        return {
            columns: [{
                title: ' ',
                key: 'icon',
                align: 'center',
                width: 40,
                render: h => {
                    return h('Icon', {
                        props: {
                            type: 'ios-menu'
                        },
                        style: {
                            cursor: 'move'
                        }
                    });
                }
            },
                {
                    title: '参数名称',
                    key: 'key',
                    render: (h, params) => {
                        return h('div', {
                            class: {
                                'edit-table-input': true
                            }
                        }, [
                            h('Input', {
                                props: {
                                    value: params.row[params.column.key],
                                    placeholder: '输入参数名称',
                                    maxlength: 10
                                },
                                style: {
                                    width: '100%'
                                },
                                on: {
                                    // 'on-change': val => {
                                    //     params.row[params.column.key] = val;
                                    // },
                                    input: val => {
                                        params.row[params.column.key] = val;
                                        this.setTableInput(params.index, params.column.key, val);
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '参数值',
                    key: 'value',
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    // type: 'textarea',
                                    value: params.row[params.column.key],
                                    placeholder: '输入参数值',
                                    maxlength: 200
                                },
                                style: {
                                    width: '100%'
                                },
                                on: {
                                    input: val => {
                                        params.row[params.column.key] = val;
                                        this.setTableInput(params.index, params.column.key, val);
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index);
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            item: {
                key: '',
                value: ''
            }
        };
    },
    methods: {
        dragSort(start, end) {//拖拽
            let startItem = this.model_params[start];
            this.model_params.splice(start, 1);
            this.model_params.splice(end, 0, startItem);
        },
        remove(index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除?',
                onOk: () => {
                    this.model_params.splice(index, 1);
                },
                onCancel: () => {
                }
            });
        },
        addSpecification() {
            this.model_params.push(Object.assign({}, this.item));
        },
        // table中表格中数据变化时设置
        setTableInput(index, key, value) {
            this.model_params[index][key] = value;
            this.model_params = [...this.model_params];
        },
        // 表格拖动初始化
        initSortable() {
            let el = document.querySelectorAll('.ivu-table-tbody')[0];
            el && new Sortable(el, {
                handle: '.ivu-icon',
                onEnd: this.endSortable
            });
        },
        endSortable(e) {
            let moveRow = this.model_params[e.oldIndex];
            this.model_params.splice(e.oldIndex, 1);
            this.model_params.splice(e.newIndex, 0, moveRow);
        }
    },
    mounted() {
        this.initSortable();
    }
};
</script>

<style scoped lang="scss">
.good-add-param {
    > .box {
        display: flex;
        flex-wrap: nowrap;
        overflow: hidden;
        padding-bottom: 35px;
        height: 100%;

        .title {
            @include font-16-22-bold;
            color: $text-first;
            margin-bottom: 20px;
            text-align: center;

            > span {
                @include font-14-20-bold;
            }
        }

        .edit {
            padding-left: 40px;
            width: 100%;
            flex: 1;

            .title {
                text-align: left;
                height: 22px;
                line-height: 22px;

                .ivu-radio-group {
                    transform: translateY(-2px);
                    font-weight: normal;
                }
            }

            .ivu-btn {
                width: 100%;
                padding-top: 16px;
                padding-bottom: 16px;
                height: inherit;
                transform: translateY(-1px);
            }

            /deep/ .ivu-table {
                th,
                td {
                    border-right: none;
                    border-color: $border-color;
                }

                .ivu-table-header {
                    thead tr th {
                        background-color: $background-color;
                    }

                    .ivu-table-cell {
                        padding: 16px 0;
                    }
                }

                .ivu-table-body {
                    .ivu-table-cell {
                        padding: 10px 0;

                        .edit-table-input {
                            padding-right: 10px;
                        }
                    }
                }
            }
        }

        .preview {
            min-width: 515px;
            max-width: 695px;
            flex: 1;

            .page {
                width: 375px;
                border: 1px solid $border-color;
                border-radius: 2px;
                margin: 0 auto;
                overflow: hidden;
                transform: scale(0.8);
                transform-origin: 0 0;

                .content {
                    overflow-y: auto;
                    overflow-x: hidden;
                    height: 534px;
                    padding: 20px;
                    box-sizing: border-box;

                    > table {
                        width: 100%;
                        border: 1px solid $border-color;
                        overflow: hidden;
                        /*内容超出后隐藏*/
                        border-collapse: collapse;

                        > tr {
                            > td {
                                padding: 6px 20px;
                                /*width: 50%;*/
                                word-break: break-all;
                                border: 1px solid $border-color;
                                height: 34px;
                                width: 50%;
                                /*overflow: hidden; !*内容超出后隐藏*!*/
                                /*text-overflow: ellipsis; !*超出部分以省略号显示*!*/
                                /*white-space: nowrap; !*文本不进行换行*!*/
                            }
                        }
                    }
                }

                .img-header,
                .img-footer {
                    width: 373px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}

.ivu-tooltip-popper.ivu-tooltip-light[x-placement] {
    padding: 0;

    .ivu-tooltip-content {
        .ivu-tooltip-inner {
            padding: 6px;
        }

        .ivu-tooltip-arrow {
            display: none;
        }
    }
}
</style>
