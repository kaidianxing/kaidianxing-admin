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
    <div class="good-classification-tree-table">
        <div class="header">
            <div class="name">
                分类名称
            </div>
            <div class="image">
                分类图片
            </div>
            <div class="add-time">
                添加时间
            </div>
            <div class="status">
                状态
            </div>
            <div class="action">
                操作
            </div>
        </div>
        <div ref="draggle" class="tree-table-box">
            <div v-if="list.length > 0">
                <!-- 第一层级的列表+拖动组件 -->
                <DragSortList v-model='list' v-slot={data}>
                    <!-- 第一层级的列表项模板 -->
                    <DragSortItem1 v-model='data' v-slot='{data:children}' @handler='handler(list,$event)'>
                        <!-- 第二层级的列表+拖动组件 -->
                        <DragSortList v-model='children' v-slot='{data:itemChildren}' v-if="level != '0'">
                            <!-- 第二层级的列表项模板 -->
                            <DragSortItem2 v-model='itemChildren' v-slot='{data:items}' @handler='handler(children,$event)'>
                                <!-- 第三层级的列表+拖动组件 -->
                                <DragSortList v-model='items' v-slot='{data:item}' v-if="level == '2'">
                                    <!-- 第三层级的列表项模板 -->
                                    <DragSortItem3 v-model='item' @handler='handler(items,$event)'></DragSortItem3>
                                </DragSortList>
                            </DragSortItem2>
                        </DragSortList>
                    </DragSortItem1>
                </DragSortList>
            </div>
            <div v-else>
                <div style="text-align: center">
                    暂无数据
                </div>
            </div>
        </div>
        <image-selector ref="image_selector" :current="currentItem.thumb" @on-change="changeSelector"></image-selector>
    </div>
</template>

<script>
    import ImageSelector from "@/components/selector/ImageSelector";
    import DragSortList from './DragSortList';
    import DragSortItem1 from './DragSortItem1'
    import {
        mapMutations,
        mapState
    } from 'vuex'
    export default {
        name: "TreeTable",
        components: {
            ImageSelector,
            DragSortList,
            DragSortItem1,
            DragSortItem2: () =>
                import ('./DragSortItem2'),
            DragSortItem3: () =>
                import ('./DragSortItem3'),
        },
        computed: {
            list: {
                get() {
                    let list = this.$store.state.createGoodClassification.list;
                    // if (list && list.length > 1) {
                    //     console.log(this.$store.state.createGoodClassification.list[1].children.map(item => item.name))
                    // }
                    return list
                },
                set(val) {
                    this.setList(val);
                }
            },
            ...mapState('createGoodClassification', {
                level: state => state.level,
            }),
        },
        data() {
            return {
                model: {},
                currentItem: {
                    thumb: '',
                }
            };
        },
        methods: {
            ...mapMutations('createGoodClassification', ['setList', 'refreshList', 'addFirstClassify', 'setLevel']),
            handler(list /* list为当前模板所在列表的数组 */ , {
                event /* 事件名 */ ,
                params: item /* 当前模板所绑定的数据 */ ,
            }) {
                switch (event) {
                    case 'setExpand':
                        item.expand = !item.expand;
                        this.refreshList();
                        break;
                    case 'addTwoChild':
                    case 'addThreeChild':
                        this.addChild(item)
                        break;
                    case 'deleteImage':
                        item.thumb = '';
                        this.refreshList()
                        break;
                    case 'addImage':
                        this.currentItem = item;
                        this.$nextTick(() => {
                            this.$refs['image_selector'].setValue();
                        });
                        break;
                    case 'setIsShow':
                        this.setIsShow(item)
                        break;
                    case 'handleDelete':
                        this.handleDelete(list, item)
                        break;
                }
            },
            // 图片选择器
            changeSelector(image) {
                this.currentItem.thumb = image
                this.refreshList()
            },
            addChild(item) {
                item.expand = true;
                if (item.children) {
                    item.children.push({
                        id: `cus_${Date.now()}`,
                        name: '',
                        thumb: '',
                        time: '',
                        status: '1'
                    })
                } else {
                    item.children = [{
                        id: `cus_${Date.now()}`,
                        name: '',
                        thumb: '',
                        time: '',
                        status: '1'
                    }]
                }
                this.refreshList();
            },
            // 设置是否显示隐藏
            setIsShow(item) {
                this.$api.goodsApi.editGoodClassifyStatus({
                        id: item.id
                    })
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('商品分类状态修改成功');
                            item.status = item.status == '0'?'1':'0';
                            this.refreshList();
                        }
                    });
            },
            delClass(list, item) {
                let index = -1
                list.forEach((val, idx) => {
                    if (val === item) {
                        index = idx;
                    }
                })
                list.splice(index, 1);
                this.refreshList();
            },
            handleDelete(list, item) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该商品分类?',
                    onOk: () => {
                        // 排除手动添加的分类
                        if (item?.id?.indexOf('cus_') === -1) {
                            // 接口进行删除
                            this.$api.goodsApi.deleteGoodClassify({
                                    id: item.id
                                })
                                .then(res => {
                                    if(res.error=='0') {
                                        this.$Message.success('商品分类删除成功');
                                         this.delClass(list, item)
                                    }
                                });
                        } else {
                            this.$Message.success('商品分类删除成功');
                            this.delClass(list, item)
                        }
                    },
                    onCancel: () => {}
                });
            },
            // 获取list
            getDataList() {
                this.$emit('on-refresh');
            },
        }
    };
</script>

<style scoped lang="scss">
    .good-classification-tree-table {
        overflow: auto;
        >.header {
            height: 60px;
            @include font-14-20-bold;
            color: $text-first;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            width: 100%;
            >.name {
                min-width: 400px;
                padding-left: 80px;
                flex: 1;
            }
            >.image {
                max-width: 100px;
                min-width: 80px;
                padding: 0 10px;
                flex: 1;
            }
            >.id {
                max-width: 60px;
                min-width: 40px;
                padding: 0 10px;
                flex: 1;
            }
            >.add-time {
                max-width: 150px;
                min-width: 120px;
                padding: 0 10px;
                flex: 1;
            }
            >.status {
                width: 80px;
                padding: 0 10px;
                /*flex: 1;*/
            }
            >.action {
                min-width: 120px;
                max-width: 200px;
                padding: 0 10px;
                flex: 1;
            }
        }
        >.tree-table-box {
            >.tree-table {
                border: 1px solid $border-color;
                margin-bottom: 10px;
                border-radius: 2px;
                .content {
                    border-bottom: 1px solid $border-color;
                    display: flex;
                    flex-wrap: nowrap;
                    @include font-14-20;
                    color: $text-first;
                    /*height: 72px;*/
                    align-items: center;
                    .icon-box {
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        cursor: pointer;
                        >.iconfont {
                            font-size: 18px;
                            color: $text-zhushi;
                            &:hover{
                                color: $brand-color;
                            }
                        }
                    }
                    .icon {
                        padding: 0 20px;
                        cursor: move;
                    } // 层级前面的图标
                    .level-icon {
                        color: $text-zhushi;
                        padding-right: 15px;
                    }
                    >.tree {
                        padding: 0 10px;
                        @include font-14-20-bold;
                        color: $text-first;
                        min-width: 300px;
                        flex: 1;
                        >.content {
                            >.title {
                                padding: 0 10px;
                            }
                            >button {
                                margin-left: 20px;
                            }
                            >.ivu-input-wrapper {
                                margin: 20px 0;
                            }
                            >i {
                                cursor: pointer;
                            }
                            .icon {
                                color: $text-zhushi;
                            }
                        }
                        >.two {
                            padding-left: 60px;
                            .title {
                                color: $text-second;
                            }
                        }
                        >.three {
                            padding-left: 160px;
                            .title {
                                color: $text-third;
                            }
                        }
                    }
                    >.image {
                        max-width: 100px;
                        min-width: 80px;
                        padding: 0 10px;
                        flex: 1;
                        >.image-content {
                            width: 40px;
                            height: 40px;
                            position: relative;
                            &:hover {
                                >.close {
                                    display: block;
                                    color: $text-zhushi;
                                }
                                >.shade {
                                    display: block;
                                }
                                >.single-replace {
                                    display: block;
                                }
                            }
                            >img {
                                width: 40px;
                                height: 40px;
                                box-sizing: border-box;
                                border-radius: 2px;
                                border: 1px solid $border-color;
                            }
                            >.close {
                                position: absolute;
                                top: -10px;
                                right: -10px;
                                font-size: 20px;
                                cursor: pointer;
                                color: $text-zhushi;
                                display: none;
                                &:hover {
                                    color: $text-second;
                                }
                            }
                            >.single-replace {
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                height: 20px;
                                cursor: pointer;
                                background-color: rgba(0, 0, 0, 0.7);
                                text-align: center;
                                line-height: 20px;
                                color: #ffffff;
                                font-size: 12px;
                                display: none;
                            }
                        }
                        >.add-image {
                            width: 40px;
                            height: 40px;
                            box-sizing: border-box;
                            border: 1px solid $border-color;
                            border-radius: 2px;
                            position: relative;
                            .icon {
                                position: absolute;
                                top: 0;
                                bottom: 0;
                                left: -20px;
                                right: 0;
                                color: $brand-color;
                                font-size: 40px;
                                cursor: pointer;
                            }
                        }
                    }
                    >.id {
                        max-width: 60px;
                        min-width: 40px;
                        padding: 0 10px;
                        flex: 1;
                        word-break: normal;
                    }
                    >.add-time {
                        max-width: 150px;
                        min-width: 120px;
                        padding: 0 10px;
                        flex: 1;
                        word-break: normal;
                    }
                    >.status {
                        width: 80px;
                        padding: 0 10px;
                        /*flex: 1;*/
                        >.show {
                            color: #19BE6B;
                        }
                        >.hide {
                            color: #939799;
                        }
                    }
                    >.action {
                        min-width: 120px;
                        max-width: 200px;
                        padding: 0 10px;
                        flex: 1;
                        .ivu-btn-text {
                            margin-right: 10px;
                        }
                    }
                }
                .content-bg-one {
                    background-color: #F4F6F8;
                }
                .content-bg-two {
                    background-color: #FAFDFF;
                }
                .content-bg-three {
                    background-color: #FFFDF9;
                }
            }
        }
    }
</style>
