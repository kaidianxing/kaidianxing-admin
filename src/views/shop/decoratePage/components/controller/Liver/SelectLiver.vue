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
    <div class="select-liver">
        <Table
            draggable
            border
            :columns="columns"
            :data="currentModal.data"
            size="small"
            :key="refreshkey"
            @on-drag-drop="draggeTable"
        ></Table>
        <div
            class="add"
            @click="addLiver"
            v-if="currentModal.data && currentModal.data.length < getLimit"
        >+添加直播间 ({{currentModal.data.length}}/{{getLimit}})</div>
        <!--商品选择器-->
        <div v-if="show">
            <LiverSelector
                v-model="show"
                multiple
                :current-list="currentModal.data"
                @on-change="liverChange"
            />
        </div>
        <div v-if="singleShow">
            <LiverSelector
                v-model="singleShow"
                :current="getSingData"
                @on-change="singleChange"
            />
        </div>
    </div>
</template>

<script>
import mixin from '../mixin.js'
import AddImgImg from '@/components/decorate/AddImgImg'
import LiverSelector from '@/components/selector/LiverSelector'

const keysLimit = {
    big_pic: 20,
    cell_two: 20,
    cell_two_long: 20,
    list: 20,
    title_pic: 3
}


export default {
    mixins: [mixin],
    components: {
        LiverSelector
    },
    data() {
        return {
            refreshkey: '0',
            columns: [
                {
                    minWidth: 410,
                    title: '直播间',
                    align: 'left',
                    render: (h, params) => {
                        return (
                            <div class="liver-list">
                                <i
                                    class='iconfont icon-move'
                                    alt=""
                                />
                                <AddImgImg class="liver-thumb" value={params.row.imgurl || this.$utils.getWechatImg(params.row.share_img)} onChange={(e) => { this.changeIcon(e, params.index) }} size="mini" />
                                <div class="two-line-hide title">{params.row.title}</div>
                            </div>
                        )
                    }
                },
                {
                    key: 'option',
                    title: '操作',
                    align: 'left',
                    minWidth: 80,
                    render: (h, params) => {
                        return (
                            <p class="option">
                                <span
                                    onClick={() => {
                                        this.replace(params)
                                    }}
                                >
                                    替换
                                </span>
                                <span
                                    onClick={() => {
                                        this.delete(params)
                                    }}
                                >
                                    删除
                                    </span>
                            </p>
                        )
                    }
                }
            ],
            replaceIndex: -1, // 替换索引值
            singleShow: false,
            show: false
        }
    },
    computed: {
        getSingData() {
            return this.currentModal.data[this.replaceIndex] || {}
        },
        getLimit() {
            return keysLimit[this.currentModal.params.liverstyle]
        }
    },
    methods: {
        addLiver() {
            this.show = true
        },
        draggeTable(nIndex, oIndex) {
            this.$emit('on-dragdrop', {
                nIndex,
                oIndex
            })
           
        },
        changeIcon(e, i) {
            if(e) {
                     this.currentModal.data[i] = { ...this.currentModal.data[i], imgurl: e }
            this.refreshCurrentModal()
            } else {
                this.currentModal.data[i] = { ...this.currentModal.data[i], imgurl: e,share_img:e }
                this.refreshCurrentModal()
            }
       
        },
        liverChange(e) {
            this.$emit('on-change', e)
        },
        replace(params) {
            this.replaceIndex = params.index
            this.singleShow = true
        },
        delete(params) {
            this.currentModal.data.splice(params.index, 1)

        },
        singleChange(val) {
            this.$emit('on-single',{
                val,
                index: this.replaceIndex
            })
        },
    }

}
</script>

<style lang="scss" scoped>
@import "../common.scss";
.select-liver {
    /deep/ .ivu-table-cell {
        padding: 10px 0 !important;
    }
    /deep/ .ivu-table-row {
        td {
            border-right: none;
        }
    }

    /deep/ .img-img-box {
        width: 50px;
        height: 40px;
    }
    /deep/ thead {
        th {
            background: #f4f6f8 !important;
            border-right: none;
        }

        .ivu-table-column-left {
            padding-left: 10px;
        }
    }

    /deep/ .option {
        padding-left: 10px;
        display: flex;
        justify-content: flex-start;
        span {
            font-size: 12px;
            line-height: 16px;
            cursor: pointer;
            /* brand/def */
            color: $brand-color;
            margin-right:10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .add {
        border: 1px solid #e9edef;
        border-top: none;
        box-sizing: border-box;
        line-height: 52px;
        text-align: center;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $brand-color;
        cursor: pointer;
        background: #fff;
    }

    /deep/ .liver-list {
        display: flex;
        align-items: center;

        .icon-move {
            margin: 0 10px;
            font-size: 24px;
            color: #b8b9bd;
        }

        .liver-thumb {
            margin-right: 10px;
            width: 50px;
            height: 40px;
        }

        .title {
            width: 200px;
            font-size: 12px;
            line-height: 16px;
            color: #262b30;
        }
    }
}
</style>
