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
    <kdx-modal-frame v-model="value" title="添加商品" :width="800" :loading="loading" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <div class="add-goods">
            <Form ref="form" :model="model" :rules="rules" :label-width="100" @submit.native.prevent>
                <FormItem label="选择分类：" prop="classify">
                    <Cascader :value="Cascader" :data="classifyData" transfer filterable
                              @on-change="changeClassify" class="width-340"></Cascader>
                    <kdx-hint-text>分类必选，此分类为调取的微信分类内容</kdx-hint-text>
                </FormItem>
                <FormItem label="选择商品：" prop="goodsList">
                    <div class="btn">
                        <Button type="primary" @click="addGoods">上传商品</Button>
                        <kdx-hint-text class="marginB-10">请选择需要关联至视频号直播的商品</kdx-hint-text>
                    </div>
                    <div class="goods-box">
                        <Table :columns="columns" :data="goodsList" border>
                            <template #goods="{row}">
                                <div class="goods">
                                    <div class="image">
                                        <img :src="$utils.media(row.thumb)" alt="">
                                    </div>
                                    <div class="content">
                                        <span class="mark more" v-show="1 === +row.has_option">多</span>
                                        <span class="mark" :class="goodsType(row.type).goodsName">{{ goodsType(row.type).goodsText }}</span>
                                        {{ row.title }}
                                    </div>
                                </div>
                            </template>
                            <template #action="{row}">
                                <Button type="text" @click="deleteGoods(row)">删除</Button>
                            </template>
                        </Table>
                        <div class="footer-page" v-show="total > 3">
                            <kdx-page-component :current='page.pageNumber' :pageSize='page.pageSize' ref="page"
                                            :total="total" :show-sizer="false" @on-change="changePage"></kdx-page-component>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="商品资质：">
                    <kdx-image-video :current-list="model.certification" multiple :limit="50" :width="80" :height="80"
                                 @on-change="changeImage"></kdx-image-video>
                    <kdx-hint-text>请上传相应的商品资质</kdx-hint-text>
                </FormItem>
            </Form>
        </div>
        <goods-selector :value="selector.value" type="0" :limit="10" multiple :current-list="model.goodsList"
                        @on-cancel="cancelSelector" @on-change="changeSelector"></goods-selector>
    </kdx-modal-frame>
</template>

<script>
import GoodsSelector from '@/components/selector/GoodsSelector';

export default {
    name: "AddGoods",
    components: {
        GoodsSelector
    },
    data() {
        return {
            value: false,
            model: {
                classify: '',
                classifyName: '',
                goodsList: [],
                certification: [],
            },
            Cascader: [],
            rules: {
                classify: [
                    {required: true, message: '分类必填'}
                ],
                goodsList: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value?.length > 0) {
                                callback();
                            }
                            callback(new Error('请选择要上传的商品'));
                        }
                    }
                ]
            },
            columns: [
                {
                    title: '商品',
                    slot: 'goods'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 100
                }
            ],
            selector: {
                value: false
            },
            loading: false,
            classifyData: [],
            goodsList: [],
            page: {
                pageSize: 3,
                pageNumber: 1
            }
        };
    },
    computed: {
        total() {
            return this.model.goodsList.length;
        }
    },
    methods: {
        setValue() {
            this.value = !this.value;
            if (this.value) {
                this.resetModel();
                !this.classifyData?.length && this.getCategory();
                this.model.goodsList = [];
                this.resetPage();
                this.getGoodsList();
            }
        },
        getCategory() {
            this.$api.wxTransactionComponentApi.getCategory().then(res => {
                if (res.error === 0) {
                    this.classifyData = res.data || [];
                }
            });
        },
        handleOk() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.loading = true;
                    let params = {
                        goods_id: this.model.goodsList.map(item => item.id),
                        category_id: this.model.classify,
                        category_name: this.model.classifyName,
                        goods_qualification: this.model.certification?.length ? this.model.certification : ''
                    };
                    this.$api.wxTransactionComponentApi.addGoods(params).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('商品添加成功');
                            this.setValue();
                            this.$emit('on-refresh');
                        }
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            });
        },
        handleCancel() {
            this.setValue();
        },
        addGoods() {
            this.selector.value = true;
        },
        cancelSelector() {
            this.selector.value = false;
        },
        changeSelector(list) {
            this.model.goodsList = list;
            this.cancelSelector();
            this.resetPage();
            this.getGoodsList();
        },
        changeClassify(list, data) {
            data = data?.length ? data: this.getSelectClassify(list, this.classifyData);
            let item = data[data.length - 1];
            this.model.classify = item.value;
            this.model.classifyName = item.label;
            this.Cascader = list.map(item => parseInt(item));
        },
        getSelectClassify(list, classifyData, data = []) {
            classifyData.forEach(item => {
                if (item.value === +list[data?.length || 0]) {
                    data.push(item);
                    item.children?.length && this.getSelectClassify(list, item.children, data);
                }
            })
            return data;
        },
        resetModel() {
            this.model = {
                classify: '',
                classifyName: '',
                goodsList: [],
                certification: [],
            };
            this.Cascader = [];
        },
        changeImage(imgList) {
            this.model.certification = imgList;
        },
        resetPage() {
            this.page = {
                pageSize: 3,
                pageNumber: 1
            }
            this.$refs['page'].reset(this.page);
        },
        changePage(page) {
            this.page = page;
            this.getGoodsList();
        },
        deleteGoods(row) {
            this.model.goodsList = this.model.goodsList.filter(item => item.id !== row.id);
            this.resetPage();
            this.getGoodsList();
        },
        getGoodsList() {
            let start = (this.page.pageNumber - 1) * this.page.pageSize,
                end = this.page.pageNumber * this.page.pageSize;
            this.goodsList = this.model.goodsList.slice(start, end);
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
.add-goods {
    padding: 30px 40px 0 20px;
    /deep/ .ivu-table {
        th,
        td {
            border-right: none;
            border-color: $border-color;
            padding-left: 30px;
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
    .footer-page {
        border: 1px solid $border-color;
        border-top: 0;
        padding: 15px 0;
    }
    /deep/ .slide-image {
        >ul {
            margin-bottom: -20px;
            margin-right: -15px;
            li {
                margin-bottom: 15px;
                margin-right: 15px;
            }
        }
    }
}

.goods {
    display: flex;
    align-items: center;

    .image {
        width: 40px;
        height: 40px;
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        border-radius: 2px;
        overflow: hidden;
        flex-shrink: 0;

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
