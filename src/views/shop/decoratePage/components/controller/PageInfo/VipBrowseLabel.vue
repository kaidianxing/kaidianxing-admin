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
    <div class="select-level">
        <Table draggable border :columns="columns" :data="getLabels" size="small"></Table>
        <div class="add" @click="addLabel">+添加会员标签组</div>
        <!-- 会员标签组选择器 -->
        <vip-label-selector ref="vip_label_selector" multiple :current-list="getLabels" @on-change="changeLabel"></vip-label-selector>
       
    </div>
</template>

<script>
import mixin from '../mixin.js'
import VipLabelSelector from "@/components/selector/VipLabelSelector";
export default {
    components: { 
        VipLabelSelector
     },
    mixins: [mixin],
    computed:{
        getLabels(){
            if(!this.currentModal.params.browsepermlabels){
                this.$set(this.currentModal.params,'browsepermlabels',[])
            }
            return this.currentModal.params.browsepermlabels?.map(item=>item)||[]
        }
    },
    data() {
        return {
            show: false,
            columns: [
                {
                    key: 'group_name',
                    title: '会员标签组',
                },
                {
                    key: 'option',
                    title: '操作',
                    align: 'center',
                    width:70,
                    render: (h, params) => {
                        return (
                            <p class="option" style="text-align:center;">
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
            replaceIndex: -1 // 替换索引值
        }
    },
    methods: {
        delete(val){
            let idx=-1
            this.currentModal.params.browsepermlabels.forEach((item,index)=>{
                if(item.id==val.row.id){
                    idx=index
                }
            })
            this.currentModal.params.browsepermlabels.splice(idx,1) 
        },
        addLabel(){
            this.$refs['vip_label_selector'].setValue();
        },
        changeLabel(val) {
            this.currentModal.params.browsepermlabels=val.map(item=>{
                return {
                    id:item.id,
                    group_name:item.group_name
                }
            });
        }, 
    },
}
</script>

<style lang="scss" scoped>
@import '../common.scss';
.select-level {
    /deep/ .ivu-table-cell {
        padding: 16px !important;
    }
    /deep/ .ivu-table-row {
        td {
            border-right: none;
        }
    }
    /deep/ thead {
        th {
            border-right: none; 
            &:first-child {
                .ivu-table-cell {
                    padding-left: 16px !important;
                }
            }
        }
    }

    /deep/ .option {
        display: flex;
        justify-content: center;
        span {
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 16px;
            /* identical to box height, or 133% */
            display: flex;
            align-items: center;
            cursor: pointer;
            /* brand/def */
            color: $brand-color;
            margin: auto 5px;
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
    }
}
</style>
