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
    <kdx-modal-frame :value="value" width="810" @on-cancel="handleCancel">
        <template #header>
            <div class="header">
                <div class="steps">
                    <div class="step" v-for="(item, index) in content" :key="index" :class="{active: index == 0 || type=='goods'}">
                        <div class="step-icon">{{ index + 1 }}</div>
                        <span class="step-text">{{ item }}</span>
                        <div class="step-line" :class="{ active: type == 'goods' }" v-if="index != content.length - 1"></div>
                    </div>
                </div>
            </div>
        </template>
        <div class="goods-preview">
            <div class="goods-preview-content" ref='scrollBox'>
                <template v-if="type == 'activity' &&value">
                    <seckill-table v-if="activeType=='seckill'"  :list="activity.list" :loading="activity.loading" @on-search="handleSearch" @on-change="chooseActivity"></seckill-table>
                </template>
                <template v-if="type == 'goods' && value">
                    <goods-table :goods-params="goodsParams" @on-change="goodsChange" :list="selectGoods" multiple ref="goods"></goods-table>
                </template>
            </div>
        </div>
        <template #footer>
          <div>
            <div class="btn-group" v-if="type=='goods'">
                <Button type="default" @click.native="backChoose">重选活动</Button>
                <Button type="primary" @click="saveHandler">保存</Button>
            </div>
            <div class="footer-page" v-else>
                <kdx-page-component
                    ref="page"
                    :total="activity.total"
                    @on-change="handlePageChange"
                    limit-default
                ></kdx-page-component>
            </div>
          </div>
        </template>
    </kdx-modal-frame>
</template>

<script>
import SeckillTable from './SeckillTable.vue';
import GoodsTable from './GoodsTable.vue';

// 活动列表map
const apiMap = {
    'seckill': 'getSeckillActivities',
}
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        // 活动内容
        activeData: {
           type: Object,
           default: ()=> {}
        },
        goods: {
            type: Array,
            default: () => [],
        },
        selectorType: {
            type: String,
            default: 'activity',
            validator: (t)=> {
                return ['activity','goods',].indexOf(t)>-1
            }
        },
        // 活动类型
        activeType: {
            type: String,
            required: true,
            validator: (t)=> {
                return ['seckill'].indexOf(t)>-1
            }
        }
    },
    components: {
        SeckillTable,
        GoodsTable,
    },
    data() {
        return {
            content: ["选择活动", "选择商品"],
            search: {
                keyword: "",
            },
            activity: {
                list: [],
                total: 0,
                loading: false
            },
            goodsParams: {
                activity_type: this.activeType,
                
            },
            page: {
                pageNumber: 1,
                pageSize: 10
            },
            selectGoods: [], // 已选商品
            chooseActive: {}, //活动id
            type: '', // activity选择活动 goods选择商品
        };
    },
    watch: {
        value: {
            handler(status){
                if(status){
                    // 清空搜索
                    this.search.keyword = '';
                    this.init()
                }
            },
            immediate: true
        }
    },
    methods: {
       
        init(){
            this.type = this.activeType;
           this.chooseActive =this.activeData;
            // this.activeData?.id && (this.goodsParams.activity_id = this.activeData?.id || '')
            this.goodsParams.activity_id = this.activeData?.id

            this.selectGoods = [...this.goods]
            this.getActivies()
        },
        getActivies() { // 获取活动列表
            this.activity.loading = true;
            let params = Object.assign(
                {
                    page: this.page.pageNumber,
                    pagesize: this.page.pageSize,
                    activity_select: '1', // 进行中的活动
                },
                this.search
            );
            this.$api.seckillApi[apiMap[this.activeType]](params).then(res => {
                console.log('res', res)
                    this.activity.loading = false
                    if (res.error === 0) {
                        res.list.map(v=> {
                            this.$set(v,'checked',  v.id == this.chooseActive.id)
                            return v
                        })
                        this.activity.list = res.list;
                        this.activity.total = res.total;
                        this.initGoodsParams()
                    }
                })
                .catch()
        },
        // 初始化商品查询参数
        initGoodsParams(){
            this.activity.list.forEach((item)=> {
                if(item.id == this.chooseActive.id) {
                    if(item.goods_ids.length) {
                        this.goodsParams.ids = item.goods_ids
                    }
                }
            })

             if(this.selectorType =='goods'){
                   this.type = this.activeData?.id?this.selectorType:'activity';
             } else {
                 this.type = this.selectorType
             }
        },
        // 选择活动
        chooseActivity({status,index}){
            this.activity.list.forEach(v=> v.checked = false)
            this.activity.list[index].checked = status
            this.chooseActive =status? this.activity.list[index]: {};
            this.selectGoods = []
            if(this.activity.list[index].goods_ids.length) {
                this.goodsParams.ids = this.activity.list[index].goods_ids
            }
           this.goodsParams.activity_id = this.chooseActive?.id

            if(status){
                this.type = 'goods'
            }
        },
        goodsChange(e){
            this.$emit("on-change", {
                activeData: this.chooseActive,
                goods: e
            });
        },
        backChoose() {
            this.type = 'activity'
        },
        saveHandler() {
            this.$refs.goods.handleSave()
        },
        handlePageChange(page) {
            this.page = page
            this.getActivies()
            
            try {
                this.$refs.scrollBox.scrollTop=0
            }catch (e) {
                console.log(e)
            }
        },
        handleCancel(){
            this.$emit('input', false)
        },
         handleSearch(search){
            this.search = search
            this.resetPage()
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            }
            this.$refs['page']?.reset()
            this.getActivies()
        },
    },
};
</script>

<style lang="scss" scoped>
.header {
    .steps {
        display: flex;
        justify-content: center;
        .step {
            display: flex;
            align-items: center;

            &.active {
                .step-icon {
                    border: 1px solid $brand-color;
                    color: #ffffff;
                    background: $brand-color;
                }

                .step-text {
                    color: $brand-color;
                }
            }
            &-icon {
                margin-right: 6px;
                border: 1px solid $border-color;
                border-radius: 50%;
                height: 24px;
                width: 24px;
                font-size: 14px;
                text-align: center;
                line-height: 24px;
                color: #b8b9bd;
            }

            &-text {
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                color: #636669;
            }

            &-line {
                margin: 0 12.5px 0 10px;
                width: 80px;
                height: 1px;
                background: #B8B9BD;

                &.active {
                    background: $brand-color;
                }
            }
        }
    }
}

.goods-preview {
    > .goods-preview-content {
        max-height: calc(100vh - 110px - 160px - 75px);
        padding: 20px;
        overflow-y: auto;
        > .search {
            display: flex;
            padding-bottom: 20px;
            .label {
                display: inline-block;
                width: 100px;
                padding-top: 6px;
                text-align: right;
                color: $text-first;
                @include font-14-20;
            }
        }
    }
    .footer-page {
        background-color: #ffffff;
        padding: 10px 0;
        display: flex;
        justify-content: center;
        border-top: 1px solid $border-color;
    }
}
@media only (max-width: 1550px) {
    .goods-preview {
        > .goods-preview-content {
            max-height: calc(100vh - 110px - 80px - 75px);
        }
    }
}

.btn-group {
    /deep/ .ivu-btn {
        height: 32px;
        width: 100px;
        font-size: 14px;
        line-height: 20px;
    }
}
</style>
