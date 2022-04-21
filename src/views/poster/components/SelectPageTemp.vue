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
    <kdx-modal-frame
        v-model="value"
        :width="1000"
        class="select-page-temp"
        @on-cancel="handleCancel"
    >
        <template #header>
            <div class="flex modal-header">
                <div class="back" @click="chooseAgain">
                    <i class="iconfont icon-line-left back-icon"></i>
                    <span class="back-text">返回</span>
                </div>
                <div class="header-title">选择模板</div>
            </div>
        </template>
        <div class="tab-content">
            <Tabs v-model="checkType" :animated="false">
                <TabPane v-for="item in typeList" :label="item.name" :name="item.id" :key="item.id">
                    <div class="flex temp-content" v-if="lists.length || (tempType ==='0'&&checkType=='0')">
                       <div class="flex" style="flex-wrap: wrap;">
                            <blank-temp tempHover v-if="tempType ==='0'" @click.native="clickItem(0)"></blank-temp>
                        <page-temp
                            @on-use="clickItem"
                            @on-delete='delItem'
                            :delabled="false"
                            :info="list"
                            v-for="list in lists"
                            :key="list.id"
                            :showUpdate="checkType=='0'"
                            tempHover
                        ></page-temp>
                       </div>
                    </div>
                    <div class="flex temp-content" v-else>
                        <div class="empty-data">
                            <i class="iconfont icon-fenxiao-leijiyongjin- empty-icon"></i>
                            <div class="empty-text" v-if="checkType =='1'">暂无模板</div>
                            <div class="empty-text" v-else>
                                暂无可使用的模板
                                <!-- <span class="empty-btn" @click="changeTempList">去模板市场</span> -->
                            </div>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <template #footer>
            <div class="modal-footer flex">
                <Page
                    :total="total"
                    :page-size="10"
                    show-total
                    show-elevator
                    transfer
                    @on-change="pageChange"
                />
            </div>
        </template>
    </kdx-modal-frame>
</template>

<script>
import PageTemp from './PageTemp'
import BlankTemp from './BlankTemp'
export default {
    components: {
        PageTemp,
        BlankTemp
    },
    data() {
        return {
            value: false,
            typeList: [
                {
                    id: '0',
                    name: '我的模板'
                },
                // {
                //     id: '1',
                //     name: '模板市场'
                // }
            ],
            checkType: '0',
            page: 1,
            total: 0,
            lists: [],
            tempType:10
        }
    },
    watch: {
        checkType() {
            this.page = 1
            this.getList()
        },
        value() {
            if (this.value) {
                this.getList()
            }
        }
    },
    methods: {
        getList() {
            if (this.checkType == '0') {//
                this.$api.posterApi
                    .getSysTempList({
                        type: this.tempType,
                        pagesize: 10,
                        page: this.page
                    })
                    .then(res => {
                        let { error, list, total } = res
                        if (error === 0) {
                            this.page = this.page + 1
                            this.lists = list
                            this.total = total
                        }
                    })
            } else {
                this.$api.posterApi
                    .getSysTempList({
                        type:this.tempType,
                        pagesize: 10,
                        page: this.page
                    })
                    .then(res => {
                        let { error, list, total } = res
                        if (error === 0) {
                            this.page = this.page + 1
                            this.lists = list
                            this.total = total
                        }
                    })
            }
        },
        changeTempList() {
            this.checkType = '1'
        },
        clickItem(item) {
            this.$emit('on-use', item)
        },
        delItem(item){
            this.$emit('on-del', item)
        },
        handleCancel() {
            this.$emit('on-close')
        },
        chooseAgain() {
            this.$emit('on-choose')
        },
        pageChange(e) {
            this.page = e
            this.getList()
        },
        setValue(type) {
            this.tempType=type
            this.page = 1
            this.value = !this.value
        }
    }
}
</script>
<style lang="scss" scoped>
.select-page-temp {
    .modal-header {
        align-items: center;
        
        .back {
            margin-right: 10px;
            padding-right: 10px;
            height: 14px;
            line-height: 14px;
            border-right: 1px solid #939799;
            cursor: pointer;

            &:hover {
                .back-icon,.back-text {
                    color: $brand-color;
                }
            }
            &-icon {
                margin-right: 4px;
                font-size: 14px;
                color: #939799;
            }

            &-text {
                font-size: 14px;
                font-weight: bold;
                color: #262B30;
            }
        }

        .header-title {
            font-weight: bold;
            color: #262B30;
        }
    }


    .tab-content {
        background-color: #ffffff;
        border-radius: 2px;

        /deep/ .ivu-tabs {
            overflow: visible;

            .ivu-tabs-bar {
                margin-bottom: 0;
            }
            .ivu-tabs-nav-scroll {
                padding: 0 20px;

                .ivu-tabs-tab {
                    width: 72px;
                    text-align: center;
                }

                .ivu-tabs-ink-bar {
                    height: 2px;
                    box-sizing: content-box;
                }
            }
        }

        .temp-type {
            padding: 20px 20px 0;

            &-list {
                padding: 0 12px;
                height: 28px;
                font-size: 12px;
                line-height: 28px;
                color: #262b30;
                cursor: pointer;

                &:hover {
                    color: $brand-color;
                }

                &.on {
                    border-radius: 3px;
                    font-size: 14px;
                    font-weight: bold;
                    color: $brand-color;
                    background: #f0faff;
                }
            }
        }

        .temp-content {
            padding: 20px 20px 0;
            flex-wrap: wrap;
            height: 505px;
            overflow-y: scroll;
                align-items: flex-start;


            &::-webkit-scrollbar {
                width: 0;
            }

            /deep/ .page-temp {
                margin: 0 18px 20px 0;
                min-height: 347px;
                // &.blank-temp {
                //     height: 347px;
                // }
              
                &:nth-child(4n) {
                    margin-right: 0;
                }
            }
            /deep/ .blank-temp {
                margin: 0 18px 20px 0;
            }

            .empty-data {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                align-self: center;
                .empty-icon {
                    margin-bottom: 20px;
                    font-size: 80px;
                    color: #b8b9bd;
                }

                .empty-text {
                    font-size: 14px;
                    line-height: 20px;
                    color: #636669;

                    .empty-btn {
                        color: $brand-color;
                        cursor: pointer;
                    }
                }
            }
        }
      
    }

    .modal-footer {
        height: 60px;
        align-items: center;
        justify-content: center;

        .choose-again,
        .back-icon {
            font-size: 14px;
            cursor: pointer;
            color: #262b30;
        }

        .back-icon {
            margin-right: 7px;
        }
    }

    /deep/ .ivu-modal-footer {
        height: 60px;
        padding: 0 18px;
    }
}
</style>