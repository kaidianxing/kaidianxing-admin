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
    <kdx-content-bar>
        <div class="good-group-add">
        <div class="add-group-content">
            <kdx-form-title>{{ type }}</kdx-form-title>
            <Form
                ref="form"
                :model="model"
                :rules="rules"
                :label-width="120"
            >
                <FormItem label="名称：" prop="name">
                    <Input
                        type="text"
                        v-model="model.name"
                        placeholder="请输入商品组名称"
                        class="width-160"
                    />
                </FormItem>
                <FormItem label="状态：" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.status">
                        <Radio :label="1">启用</Radio>
                        <Radio :label="0">禁用</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="组内商品：" prop="goods_id">
                    <div>
                        <Button class="default-primary" @click="addShop"
                            >+添加</Button
                        >
                    </div>
                    <div
                        class="goods-box"
                        v-show="shop.data && shop.data.length > 0"
                    >
                        <div class="goods-table">
                            <Table
                                ref="table"
                                :columns="shop.columns"
                                :data="shop.data"
                            ></Table>
                        </div>
                        <div class="footer-page" v-show="shop.total > 10">
                            <kdx-page-component
                                ref="page"
                                :total="shop.total"
                                @on-change="handlePageChange"
                            ></kdx-page-component>
                        </div>
                    </div>
                </FormItem>
            </Form>
        </div>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
            <Button class="default-long" @click="goBack">返回列表</Button>
        </template>
        <!--商品选择器-->
        <goods-selector
                v-model="selector.value"
                :multiple="true"
                :current-list="selector.data"
                @on-change="selectorChange"
                @on-cancel="selectorCancel"
        ></goods-selector>
    </kdx-content-bar>
</template>

<script>
import GoodsSelector from '@/components/selector/GoodsSelector'
export default {
    name: 'index',
    components: { GoodsSelector },
    data() {
        return {
            model: {
                name: '',
                status: 1,
                goods_id: []
            },
            rules: {
                name: [{ required: true, message: '商品组名称必填' }],
                goods_id: [
                    {
                        required: true,
                        type: 'array',
                        min: 1,
                        message: '商品必选'
                    }
                ]
            },
            shop: {
                columns: [
                    {
                        title: '商品',
                        key: 'shop',
                        minWidth: 200,
                        render: (h, params) => {
                            let getType;
                            switch (params.row.type) {
                                case '0':
                                    getType = {
                                        goodsText : '实'
                                    }
                                    break;

                                case '1':
                                    getType = {
                                        goodsText : '虚'
                                    }
                                    break;

                                case '2':
                                    getType = {
                                        goodsText: '密'
                                    }
                                    break;

                                case '3':
                                    getType = {
                                        goodsText: '预'
                                    }
                                    break;
                            }
                            return h(
                                'div',
                                {
                                    class: {
                                        'shop-box': true
                                    }
                                },
                                [
                                    // image
                                    h(
                                        'div',
                                        {
                                            class: {
                                                image: true
                                            }
                                        },
                                        [
                                            h('img', {
                                                attrs: {
                                                    src: this.$media(
                                                        params.row.thumb
                                                    )
                                                },
                                                on: {
                                                    error: e => {
                                                        this.replaceImage(e)
                                                    }
                                                }
                                            })
                                        ]
                                    ),
                                    // 商品标题
                                    h(
                                        'div',
                                        {
                                            class: {
                                                content: true
                                            }
                                        },
                                        [
                                            h(
                                                'div',
                                                {
                                                    class: {
                                                        'content-text': true
                                                    }
                                                },
                                                [
                                                    // 多规格标志
                                                    h(
                                                        'span',
                                                        {
                                                            class: {
                                                                mark: true
                                                            },
                                                            style: {
                                                                display:
                                                                    params.row
                                                                        .has_option ===
                                                                    '1'
                                                                        ? 'inline-block'
                                                                        : 'none'
                                                            }
                                                        },
                                                        '多'
                                                    ),
                                                    // 实体、虚拟商品标志
                                                    h(
                                                        'span',
                                                        {
                                                            class: {
                                                                mark: true,
                                                                real: params.row.type === '0',
                                                                virtual: params.row.type === '1',
                                                                secret: params.row.type === '2',
                                                            }
                                                        },
                                                        getType.goodsText
                                                    ),
                                                    h(
                                                        'span',
                                                        {
                                                            class: {
                                                                text: true
                                                            }
                                                        },
                                                        params.row.title
                                                    )
                                                ]
                                            )
                                        ]
                                    )
                                ]
                            )
                        }
                    },
                    {
                        title: '价格',
                        key: 'price',
                        minWidth: 80,
                        render: (h, params) => {
                            // 多规格
                            if (params.row.has_option === '1') {
                                return (
                                    <div class="price">
                                        <span>￥{params.row.min_price} ~ ￥{params.row.max_price}</span>
                                    </div>
                                );
                            }
                            return (
                                <div class="price">
                                    <span>￥{params.row[params.column.key]}</span>
                                </div>
                            );
                        }
                    },
                    {
                        title: '库存',
                        key: 'stock',
                        minWidth: 80,
                        render: (h, params) => {
                            let stock = params.row[params.column.key]
                            return (
                                <div class="inventory">
                                <span>{stock}</span>
                                </div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h(
                                'div',
                                {
                                    class: {
                                        action: true
                                    }
                                },
                                [
                                    h(
                                        'Button',
                                        {
                                            props: {
                                                type: 'text'
                                            },
                                            on: {
                                                click: () => {
                                                    this.deleteShop(
                                                        params.index,
                                                        params.row
                                                    )
                                                }
                                            }
                                        },
                                        '删除'
                                    )
                                ]
                            )
                        }
                    }
                ],
                data: [],
                total: 0
            },
            selector: {
                value: false,
                data: []
            },
            page: {
                pageSize: 10,
                pageNumber: 1 // 页码
            },
            id: 0,
            loading: false,
            type: '新增商品组'
        }
    },
    methods: {
        getData() {
            this.$api.goodsApi
                .getGoodGroup({ id: this.id })
                .then(res => {
                    if (res.error === 0) {
                        this.model = res.data
                        this.selector.data = res.data.goods || []
                        delete this.model.goods
                        this.model.goods_id = this.selector.data.map(
                            item => item.id
                        )
                        this.getPageShopData()
                    }
                })
                .catch()
        },
        selectorChange(list) {
            this.selector.data = list
            this.model.goods_id = list.map(item => item.id)
            this.resetPage()
            this.getPageShopData()
            this.selectorCancel()
            console.log(this.shop.data)
        },
        selectorCancel() {
            this.selector.value = false
        },
        addShop() {
            this.selector.value = true
        },
        // 删除组内商品
        deleteShop(index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除该商品？',
                onOk: () => {
                    let pageIndex =
                        (this.page.pageNumber - 1) * this.page.pageSize + index
                    this.selector.data.splice(pageIndex, 1)
                    this.model.goods_id.splice(pageIndex, 1)
                    this.resetPage()
                    this.getPageShopData()
                },
                onCancel: () => {}
            })
        },
        handlePageChange(page) {
            this.page = page
            this.getPageShopData()
        },
        // 重置页码信息
        resetPage() {
            this.page.pageSize = 10
            this.page.pageNumber = 1
            this.$refs['page'].reset()
        },
        // 获取当前显示的商品
        getPageShopData() {
            this.shop.total = this.selector.data.length
            let start = this.page.pageSize * (this.page.pageNumber - 1),
                end = this.page.pageSize * this.page.pageNumber
            this.shop.data = this.selector.data.slice(start, end)
        },
        handleSave() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.id) {
                        this.editGoodGroup()
                    } else {
                        this.addGoodGroup()
                    }
                }
            })
        },
        addGoodGroup() {
            this.loading = true
            this.$api.goodsApi.addGoodGroup(this.model).then(res => {
                this.loading = false
                if (res.error === 0) {
                    this.$Message.success('商品组新增成功')
                    this.$router.go(-1);
                }
            })
        },
        editGoodGroup() {
            this.loading = true
            let params = Object.assign({}, this.model, { id: this.id })
            this.$api.goodsApi.editGoodGroup(params).then(res => {
                this.loading = false
                if (res.error === 0) {
                    this.$Message.success('商品组修改成功')
                    this.$router.go(-1);
                }
            })
        },
        init() {
            this.id = this.$route.query.id || 0
            if (this.id) {
                this.getData()
                this.type = '修改商品组'
            } else {
                this.model = {
                    name: '',
                    status: 1,
                    goods_id: []
                }
                this.shop.data = []
                this.type = '新增商品组'
            }
        },
        goBack() {
            this.$router.go(-1);
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style scoped lang="scss">
.good-group-add {
    background-color: #FFFFFF;
    min-height: 100%;
    position: relative;
    .add-group-content {
        margin-top: 20px;
        background-color: #ffffff;
        height: 100%;
        padding: 40px;
        .goods-box {
            margin-top: 10px;
            border-radius: 2px;
            background-color: $background-color;
            padding: 20px;
            .goods-table {
                padding: 0 20px;
                background-color: #ffffff;
            }
        }
    }
    /deep/ .ivu-table {
        td {
            .shop-box {
                display: flex;
                flex-wrap: nowrap;
                .image {
                    width: 60px;
                    height: 60px;
                    margin-right: 10px;
                    border-radius: 2px;
                    border: 1px solid $border-color;
                    box-sizing: border-box;
                    > img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .content {
                    width: 100%;
                    flex: 1;
                    .content-text {
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        height: 50px;
                        padding: 10px 0;
                        .mark {
                            @include font-12-16;
                            color: #ed4014;
                            background-color: #ffefe6;
                            border-radius: 2px;
                            margin-right: 4px;
                            display: inline-block;
                            &:nth-last-child(2) {
                                margin-right: 6px;
                            }
                            &.real {
                                background-color: #F0FAFF;
                                color: $brand-color;
                            }
                            &.virtual {
                                background-color: #E6FFF9;
                                color: #00C5C5;
                            }
                            &.secret {
                                background-color: #FFCDD0;
                                color: #FF000F;
                            }
                        }
                        .text {
                            @include font-14-20;
                        }
                    }
                }
            }
            .price {
                color: $text-first;
                @include font-14-20-bold;
                .icon {
                    display: none;
                    cursor: pointer;
                }
                &:hover {
                    > .icon {
                        display: inline-block;
                    }
                }
            }
        }
    }
    .footer-page {
        background-color: #ffffff;
        padding-top: 20px;
        display: flex;
        justify-content: center;
    }
}
</style>
