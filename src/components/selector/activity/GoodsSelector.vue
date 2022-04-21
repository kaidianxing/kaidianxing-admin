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
        :value="value"
        title="商品选择器"
        width="1000"
        ok-text="保存"
        @on-ok="handleSave"
        @on-cancel="handleCancel"
    >
        <div class="goods-preview">
            <div class="goods-preview-content" ref='scrollBox'>
                <div class="search" v-if="!activity.show">
                    <Input
                        v-model="search.keywords"
                        search
                        enter-button="搜索"
                        placeholder="请输入"
                        @on-search="handleSearch"
                        @on-enter="handleSearch"
                        class="width-250"
                    />
                    <!--<span class="label">商品组：</span>-->
                    <!--<Select v-model="search.group" class="width-160" @on-change="handleSearch">-->
                    <!--<Option v-for="item in goodsGroup" :key="item.id" :value="item.id">{{item.name}}</Option>-->
                    <!--</Select>-->
                </div>
                <Table v-if="!activity.show" ref="table" :columns="columns" :data="table.data" v-loading="table.loading">
                    <template slot-scope="{ row }" slot="date">
                        <div class="time">起：{{ getTime(row.activitys[activity_type].start_time) }}</div>
                        <div class="time">止：{{ getTime(row.activitys[activity_type].end_time) }}</div>
                    </template>
                </Table>

                <Table v-if="activity.show" ref="activityTable" :columns="activity.columns" :data="activity.data">
                    <template slot-scope="{ row }" slot="status">
                        <kdx-status-text type="success" v-if="+row.status === 1">进行中</kdx-status-text>
                        <kdx-status-text type="danger" v-if="+row.status === -1">已停止</kdx-status-text>
                        <kdx-status-text type="danger" v-if="+row.status === -2">手动停止</kdx-status-text>
                        <kdx-status-text type="warning" v-if="+row.status === 0">未开始</kdx-status-text>
                    </template>
                    <template slot-scope="{ row }" slot="date">
                        <div class="time">起：{{ getTime(row.start_time) }}</div>
                        <div class="time">止：{{ getTime(row.end_time) }}</div>
                    </template>
                </Table>
            </div>
            <div class="footer-page" v-show="table.total > 10&&!activity.show">
                <kdx-page-component ref="page" :total="table.total" @on-change="handlePageChange"></kdx-page-component>
            </div>
        </div>

        <template #footer>
            <div class="btn-group" v-if="activity.show">
                <Button type="primary" @click="activity.show=false">返回选择商品</Button>
            </div>
        </template>

    </kdx-modal-frame>
</template>

<script>
export default {
    name: 'goodsSelector',
    props: {
        current: {
            type: [String, Object],
            default: () => { }
        },
        currentList: {
            type: Array,
            default: () => []
        },
        value: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number
        },
        // 商品库
        isStore: {
            type: Boolean,
            default: false
        },
        params: { // 特殊请求参数 search
            type: Object,
            default: () => {}
        },
        type: { //商品类型
            type: String,
            default: ''
        },
        flag: {
            type: String,
            default: ''
        },
        show_activity: { // 是否显示活动
            type: [Number],
            default: 0
        },
        activity_type: {
            type: String
        }
    },
    computed:{
        columns(){
            let columns =[
                {
                    title: '商品',
                    key: 'shop',
                    width: 450,
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
                    title: '活动时间',
                    slot: 'date',
                    minWidth: 130,
                    maxWidth: 300
                },
                {
                    title: '价格',
                    key: 'activity_price',
                    minWidth: 60,
                    render: (h, params) => {
                        // 多规格
                        if (params.row.has_option === '1') {
                            let length = params.row.activitys[this.activity_type].price_range.min_price.length +
                                params.row.activitys[this.activity_type].price_range.max_price.length;
                            if(length <=10) {
                                return (
                                    <div class="price" style="white-space: pre-wrap;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">
                                        <span>￥{params.row.activitys[this.activity_type].price_range.min_price} ~ ￥{params.row.activitys[this.activity_type].price_range.max_price}</span>
                                    </div>
                                );
                            }else {
                                return (
                                    <div class="price" style="white-space: pre-wrap;">
                                    <p>￥{params.row.activitys[this.activity_type].price_range.min_price} </p>
                                    <p>~ ￥{params.row.activitys[this.activity_type].price_range.max_price}</p>
                                </div>
                            );
                            }
                        }
                        return (
                            <div class="price">
                                <span>￥{params.row.activitys[this.activity_type][params.column.key]}</span>
                            </div>
                        );
                    }
                },
                {
                    title: '库存',
                    key: 'activity_stock',
                    width: 60,
                    render: (h, params) => {
                        let data = parseInt(params.row.activitys[this.activity_type][params.column.key])
                        if (params.row.type == '3') {
                            return h('div','-')
                        } else {
                            if (data || data === 0) {
                                if (data <= 999) {
                                    return h('div', data)
                                } else {
                                    return h('div', '999+')
                                }
                            } else {
                                return h('div', '-')
                            }
                        }

                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 80,
                    render: (h, params) => {
                        return (
                            <div class="action">
                                <Button class="default-primary"
                                    style={{ display: params.row.checked ? 'none' : 'block' }}
                                    onClick={() => {
                                        this.setChecked(params.index, true);
                                    }}
                                >选择</Button>
                                <Button type="primary"
                                    style={{ display: params.row.checked ? 'block' : 'none' }}
                                    onClick={() => {
                                        this.setChecked(params.index, false);
                                    }}
                                >已选</Button>
                            </div>
                        );
                    }
                }
            ]
            if (this.show_activity) {
                columns.splice(-1,0,{
                    title: '营销活动',
                    key: 'is_activity_goods',
                    render: (h,params) => {
                        return (
                            <div class={params.row.is_activity_goods === 1?'brand-color pointer':'pointer'} on-click={() => { this.viewActivity(params.row)}}>{params.row.is_activity_goods === 1?'查看参与的活动':'未参与活动'}</div>
                        )
                    }
                });
            }
            return columns
        }
    },
    data() {
        return {
            search: {
                keywords: '',
                group: ''
            },
            goodsGroup: [],
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            selectRows: [],
            selectRow: {},
            table: {
                data: [],
                loading: false,
                total: 0
            },
            activity: {
                show: false,
                columns: [
                    {
                        title: '活动名称',
                        key: 'title',
                    },
                    {
                        title: '活动状态',
                        key: 'status',
                    },
                    {
                        title: '活动时间',
                        key: 'time',
                    },
                    {
                        title: '活动类型',
                        key: 'type_text',
                    },
                    {
                        title: '活动来源',
                        key: 'sub_shop_id',
                        render: () => {
                            return (
                                <div>平台</div>
                            )
                        }
                    }
                ],
                data: []
            }
        }
    },
    methods: {
        handleSearch() {
            this.resetPage()
            this.getShopList()
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            }
            this.$refs['page']?.reset()
        },
        // 页码改变
        handlePageChange(page) {
            this.page = page
            this.getShopList()
            try {
                this.$refs.scrollBox.scrollTop=0
            }catch (e) {
                console.log(e)
            }
        },
        // 选择、取消选择
        setChecked(index, isChecked) {
            if (this.multiple) {
                if (this.limit && this.selectRows.length === this.limit && isChecked) {
                    this.$Message.error('已超出最大可选数量');
                    return;
                }
                this.$set(this.table.data[index], 'checked', isChecked)
                if (this.selectRows.length === 0) {
                    this.selectRows.push(this.table.data[index])
                } else {
                    if (isChecked) {
                        this.selectRows.push(this.table.data[index])
                    } else {
                        this.selectRows = this.selectRows.filter(item => item.id !== this.table.data[index].id);
                    }
                }
            } else {
                // 单选
                if (isChecked) {
                    this.table.data.forEach((item, i) => {
                        this.$set(this.table.data[i], 'checked', false)
                    })
                    this.$set(this.table.data[index], 'checked', true)
                    this.selectRow = this.table.data[index]
                } else {
                    this.$set(this.table.data[index], 'checked', false)
                    this.selectRow = {}
                }
            }
        },
        // 进行默认选中
        defaultChecked() {
            let key = this.isStore?'broadcast_goods_id': 'id'
            let currentKey = this.isStore? 'broadcast_goods_id': 'id'
            if (this.multiple) {
                this.table.data.forEach((item, index) => {
                    for (let current of this.selectRows) {
                        if (current[currentKey] === item[key]) {
                            this.$set(this.table.data[index], 'checked', true)
                            break
                        }
                    }
                })
            } else {
                this.table.data?.forEach((item, index) => {
                    if (this.selectRow && item[key] === this.selectRow[currentKey]) {
                        this.$set(this.table.data[index], 'checked', true)
                    } else {
                        this.$set(this.table.data[index], 'checked', false)
                    }
                })
            }
        },
        // 商品列表
        getShopList() {
            // 商品库查询
            if (this.isStore) {
                this.getGoodsStore()
                return
            }
            this.table.loading = true
            let params = Object.assign(
                {
                    page: this.page.pageNumber,
                    pagesize: this.page.pageSize,
                    type: this.type,
                    is_merchant: 1,
                    ...this.params
                },
                this.search
            );
            this.$api.goodsApi
                .getActivityGoods(params)
                .then(res => {
                    this.table.loading = false
                    if (res.error === 0) {
                        this.table.data = res.list
                        this.table.total = res.total
                        this.defaultChecked()
                    }
                })
                .catch()
        },
        // 获取商品库
        getGoodsStore() {
            this.table.loading = true
            let params = Object.assign(
                {
                    page: this.page.pageNumber,
                    pagesize: this.page.pageSize,
                    bro_goods_status: 2
                },
                {
                    title: this.search.keywords
                }
            )
            this.$api.liverApi
                .getGoodsStore(params)
                .then(res => {
                    this.table.loading = false
                    if (res.error === 0) {
                        this.table.data = res.list
                        this.table.total = res.total
                        this.defaultChecked()
                    }
                })
                .catch()
        },
        // 获取商品组
        goodGroupList() {
            this.$api.goodsApi.goodGroupList({ pager: 0 }).then(res => {
                if (res.error === 0) {
                    this.goodsGroup = res.list
                } else {
                    this.$Message.error('商品组获取失败')
                }
            })
        },
        handleSave() {
            if (this.multiple) {
                this.$emit('on-change', this.selectRows)
            } else {
                this.$emit('on-change', this.selectRow)
            }
            this.handleCancel()
        },
        handleCancel() {
            this.$emit('on-cancel')
        },
        resetSearch() {
            this.search = {
                keywords: '',
                group: ''
            }
        },
        viewActivity(data) {
            console.log(data,'data>>>>>>>>viewActivity');
            if (!data.is_activity_goods) { return }
            this.activity.show = true
            this.activity.data = data.join_activity
        },
        getTime(time) {
            if (time === '0000-00-00 00:00:00') {
                return '-'
            } else {
                return time
            }
        }
    },
    watch: {
        value: {
            handler(val) {
                if (val) {
                    if (this.multiple) {
                        this.selectRows = [...this.currentList] || []
                    } else {
                        this.selectRow = this.current
                    }
                    this.resetSearch()
                    this.resetPage()
                    this.getShopList()
                    // this.goodGroupList();
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped lang="scss">
.goods-preview {
    > .goods-preview-content {
        min-height: 400px;
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
                            border-radius: 2px;
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
                                width: 18px;
                                height: 18px;
                                text-align: center;
                                line-height: 18px;
                                display: inline-block;
                                &:nth-last-child(2) {
                                    margin-right: 6px;
                                }
                                &.real {
                                    background-color: #f0faff;
                                    color: $brand-color;
                                }
                                &.virtual {
                                    background-color: #e6fff9;
                                    color: #00c5c5;
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
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
</style>
