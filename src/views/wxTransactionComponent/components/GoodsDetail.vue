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
    <kdx-modal-frame v-model="value" title="商品详情" :width="500" :loading="loading" @on-cancel="setValue"
                 @on-ok="setValue">
        <div class="goods-detail">
            <Form :label-width="120">
                <FormItem label="选择分类：">
                    {{data.category_name}}
                </FormItem>
<!--                <FormItem label="选择品牌："></FormItem>-->
                <FormItem label="商品资质：">
                    <div class="image">
                        <img v-for="(item, index) in data.goods_qualification" :src="$utils.media(item)"
                             :key="index"  alt="" @error="replaceImage">
                    </div>
                </FormItem>
                <FormItem label="商品：">
                    <Table :columns="columns" :data="goodsList">
                        <template #goods="{row}">
                            <div class="goods">
                                <div class="image">
                                    <img :src="$utils.media(row.thumb)" alt="" @error="replaceImage">
                                </div>
                                <div class="content">
                                    <span class="mark more" v-show="1 === +row.has_option">多</span>
                                    <span class="mark" :class="goodsType(row.type).goodsName">{{ goodsType(row.type).goodsText }}</span>
                                    {{ row.title }}
                                </div>
                            </div>
                        </template>
                    </Table>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: "GoodsDetail",
    props: {
        id: [String, Number]
    },
    data() {
        return {
            columns: [
                {
                    title: '商品',
                    slot: 'goods'
                },
            ],
            value: false,
            goodsList: [],
            data: {},
            loading:false
        };
    },
    methods: {
        setValue() {
            this.value = !this.value;
            if (this.value) {
                this.getData();
            }
        },
        getData() {
            this.loading = false;
            this.$api.wxTransactionComponentApi.getAuditGoodsDetail({id: this.id}).then(res => {
                if (res.error === 0) {
                    let {goods_info, ...data} = res.data;
                    console.log('res', res)
                    this.data = data;
                    this.goodsList = goods_info ? [goods_info] : [];
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        // 商品类型
        goodsType(type) {
            let getType = {
                goodsName : '',
                goodsText: ''
            };
            switch (type) {
                case '0':
                    getType = {
                        goodsName : 'real',
                        goodsText : '实'
                    }
                    break;

                case '1':
                    getType = {
                        goodsName : 'virtual',
                        goodsText : '虚'
                    }
                    break;

                case '2':
                    getType = {
                        goodsName: 'secret',
                        goodsText: '密'
                    }
                    break;

                case '3':
                    getType = {
                        goodsName: 'appoint',
                        goodsText: '预'
                    }
                    break;
                case '5':
                    getType = {
                        goodsName: 'verifyCount',
                        goodsText: '次'
                    }
                    break;
                default:
                    getType = {
                        goodsName: '',
                        goodsText: ''
                    }
                    break;
            }
            return getType
        },
    }
};
</script>

<style scoped lang="scss">
.goods-detail {
    padding: 20px 20px 0 20px;
    .image {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: -10px;
        >img {
            width: 80px;
            height: 80px;
            border-radius: 2px;
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }
}
.goods {
    display: flex;
    align-items: center;

    .image {
        width: 60px;
        height: 60px;
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        border-radius: 2px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .content {
        padding-left: 10px;
        @include font-14-20;
        color: $text-first;
        @include font-multiple-omit(2);

        .mark {
            padding: 1px 3px;
            @include font-12-16;
            border-radius: 2px;
            margin-right: 5px;
        }

        .real {
            background-color: $brand-light;
            color: $brand-color;
        }

        .more {
            background-color: $warning-light;
            color: $warning-color;
        }

        .virtual {
            color: #00C5C5;
            background-color: #E6FFF9;
        }

        .verifyCount {
            background-color: #FEE3FF;
            color: #FA00FF;
        }

        .fruit {
            color: $danger-color;
            background-color: $danger-light;
        }
    }

    .price {
        font-weight: bold;
    }
}
</style>
