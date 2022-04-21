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
    <kdx-modal-frame v-model="value" title="会员选择器" :width="850" @on-ok="handleOk" @on-cancel="handleCancel">
        <div class="vip-selector">
            <div class="vip-selector-content" ref='scrollBox'>
                <div class="search">
                    <Form ref="form" :model="search" :label-width="100" inline @submit.native.prevent>
                        <FormItem class="search-content">
                            <Input v-model="search.keyword" search enter-button="搜索" placeholder="请输入"
                                   @on-search="handleSearch"
                                   class="width-250"/>
                        </FormItem>
                        <FormItem label="用户等级：">
                            <Select v-model="search.level_id" placeholder="请选择" @on-change="handleSearch" class="width-160">
                                <Option v-for="item in levels" :key="item.id" :value="item.id">{{item.level_name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="标签组：">
                            <Select v-model="search.group_id" placeholder="请选择" @on-change="handleSearch" class="width-160">
                                <Option v-for="item in groups" :key="item.id" :value="item.id">{{item.group_name}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
                <Table ref="table" :columns="columns" :data="data" v-loading="loading"></Table>
            </div>
            <div class="footer-page" v-show="total > 10">
                <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "VipSelector",
        props: {
            current: {
                type: [String, Object],
                default: () => {
                }
            },
            currentList: {
                type: Array,
                default: () => []
            },
            // 是否多选
            multiple: {
                type: Boolean,
                default: false
            },
            // 额外参数
            restParams: {
                type: Object,
                default: () => {}
            },
            passId: { // 不会被禁选的用户
                type: [String, Number]
            },
            source: {
                type: String
            },
            /*
            * 传入type是为了处理视频号链接会员选择
            * vip是默认调用
            * video表示视频号链接调用
            * */
            type: {
                type: String,
                default: 'vip'
            },
        },
        data() {
            return {
                value: false,
                search: {
                    keyword: '',
                    level_id: 'all',
                    group_id: 'all'
                },
                columns: [
                    {
                        title: '会员',
                        key: 'shop',
                        minWidth: 200,
                        render: (h, params) => {
                            const sourceTmp = {
                                '10': <kdx-svg-icon type="icon-H" class="platform-icon"></kdx-svg-icon>, // h5
                                '20': <kdx-svg-icon type="icon-weixin" class="platform-icon"></kdx-svg-icon>, // 公众号
                                '21': <kdx-svg-icon type="icon-weixinxiaochengxu" class="platform-icon"></kdx-svg-icon>, // 微信小程序
                                '30': <kdx-svg-icon type="icon-qudao-toutiao2" class="platform-icon"></kdx-svg-icon>, // 头条小程序
                                '31': <kdx-svg-icon type="icon-douyin" class="platform-icon"></kdx-svg-icon>, // 头条小程序
                                '32': <kdx-svg-icon type="icon-qudao-toutiaojisuban" class="platform-icon"></kdx-svg-icon> // 抖音小程序
                            }
                            let svgComponent = sourceTmp[params.row.source];

                            // else if (params.row.source === '5') {
                            //     // 支付宝小程序
                            //     svgComponent = (
                            //         <kdx-svg-icon type="icon-zhifubaoxiaochengxu" class="platform-icon"></kdx-svg-icon>
                            //     );
                            // } else if (params.row.source_name === '百度小程序') {
                            //     // 百度小程序
                            //     svgComponent = (
                            //         <kdx-svg-icon type="icon-baiduxiaochengxu" class="platform-icon"></kdx-svg-icon>
                            //     );
                            // }
                            return (
                                <div class="vip-info">
                                    <div class="user-image">
                                        <img src={this.$media(params.row.avatar)} alt="" onError={e => {
                                            this.replaceImage(e, 'avatar');
                                        }}/>
                                    </div>
                                    <div class="vip-content">
                                        <p class="vip-name line-hide">
                                            {params.row.nickname}
                                        </p>
                                        <div class="vip-platform">
                                            {svgComponent}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    },
                    {
                        title: '会员等级',
                        key: 'level_name',
                        minWidth: 100,
                        render: (h, params) => {
                            return (
                                <div>{params.row.level_name ? params.row.level_name : '普通会员'}</div>
                            );
                        }
                    },
                    {
                        title: '标签组',
                        key: 'group_name',
                        minWidth: 100,
                        render: (h, params) => {
                            return (
                                <div>{params.row.group_name ? params.row.group_name : '-'}</div>
                            );
                        }
                    },
                    {
                        title: '注册时间',
                        key: 'created_at',
                        width: 180
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render: (h, params) => {
                            return (
                                <div class="action">
                                    <Button class="default-primary"
                                            style={{display: params.row.checked ? 'none' : 'block'}}
                                            disabled={this.disabledBtn(params.row) && this.passId!== params.row.id }
                                            onClick={() => {
                                                this.setChecked(params.index, true);
                                            }}
                                    >选择</Button>
                                    <Button type="primary"
                                            style={{display: params.row.checked ? 'block' : 'none'}}
                                            onClick={() => {
                                                this.setChecked(params.index, false);
                                            }}
                                    >已选</Button>
                                </div>
                            );
                        }
                    }
                ],
                data: [],
                levels: [],
                groups: [],
                total: 0,
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                selectRow: {},
                loading: false
            };
        },
        methods: {
            // 进行弹窗打开和关闭
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    if (this.multiple) {
                        this.selectRows = [...this.currentList];
                    } else {
                        this.selectRow = this.current;
                    }
                    // 进行数据加载以及选中初始化
                    this.resetSearch();
                    this.resetPage();
                    this.getList();
                }
            },
            handleSearch() {
                this.resetPage();
                this.getList();
            },
            resetSearch() {
                this.search = {
                    keyword: '',
                    level_id: 'all',
                    group_id: 'all'
                };
            },
            resetPage() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.$refs['page']?.reset();
            },
            // 选择、取消选择
            setChecked(index, isChecked) {
                if (this.multiple) {
                    this.$set(this.data[index], 'checked', isChecked);
                    // 多选
                    if (this.selectRows.length === 0) {
                        this.selectRows.push(this.data[index]);
                    } else {
                        if (isChecked) {
                            this.selectRows.push(this.data[index]);
                        } else {
                          this.selectRows =this.selectRows.filter(item=> item.id!==this.data[index].id)
                        }
                    }
                } else {
                    this.data.forEach((item, i) => {
                        this.$set(this.data[i], 'checked', false);
                    });
                    this.$set(this.data[index], 'checked', isChecked);
                    if (isChecked) {
                        this.selectRow = this.data[index];
                    } else {
                        this.selectRow = {};
                    }
                    this.$emit('on-change', this.selectRow);
                }
            },
            // 进行默认选中
            defaultChecked() {
                if (this.multiple) {
                    this.data.forEach((item, index) => {
                        for (let current of this.selectRows) {
                            if (current.id === item.id) {
                                this.$set(this.data[index], 'checked', true);
                                break;
                            }
                        }
                    });
                } else {
                    this.data.forEach((item, index) => {
                        if (this.current && item.id === this.selectRow.id) {
                            this.$set(this.data[index], 'checked', true);
                        } else {
                            this.$set(this.data[index], 'checked', false);
                        }
                    });
                }
            },
            // 页码改变
            handlePageChange(page) {
                this.page = page;
                this.getList();
                try {
                    this.$refs.scrollBox.scrollTop=0
                }catch (e) {
                    console.log(e)
                }
            },
            handleOk() {
                if (this.multiple) {
                    this.$emit('on-change', this.selectRows);
                } else {
                    this.$emit('on-change', this.selectRow);
                }
                this.setValue();
            },
            handleCancel() {
                this.setValue();
            },
            getList() {
                this.loading = true;
                let sourceObj = {};
                if(this.source) {
                    sourceObj.source = this.source
                }
                let searchData = {
                    ...this.search,
                    level_id: this.search.level_id === 'all' ? '' : this.search.level_id,
                    group_id: this.search.group_id === 'all' ? '' : this.search.group_id,
                }
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, searchData, this.restParams, sourceObj);
                this.$api.memberApi[this.type==='vip'?'memberList':'videoMemberList'](params).then(res => {
                // this.$api.memberApi.memberList(params).then(res => {
                    if (res.error === 0) {
                        this.data = res.list;
                        this.total = res.total;
                        res.groups.unshift({
                            id: 'all',
                            group_name: '全部'
                        })
                        res.levels.unshift({
                            id: 'all',
                            level_name: '全部'
                        })
                        this.groups = res.groups;
                        this.levels = res.levels;
                        this.defaultChecked();
                        this.loading = false;
                    }
                });
            },
            disabledBtn(row){
                return row.is_use_verify == 1
            }
        }
    };
</script>

<style scoped lang="scss">
    .vip-selector {
        > .vip-selector-content {
            max-height: calc(100vh - 110px - 160px - 75px);
            padding: 20px;
            overflow-y: auto;
            > .search {
                display: flex;
                padding-bottom: 20px;
                /deep/ .ivu-form {
                    .ivu-form-item {
                        margin-bottom: 0;
                    }
                    .search-content {
                        .ivu-form-item-content {
                            margin-left: 0 !important;
                        }
                    }
                }
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
                    // 会员
                    .vip-info {
                        display: flex;
                        flex-wrap: nowrap;
                        > .user-image {
                            width: 46px;
                            height: 46px;
                            flex-shrink: 0;
                            > img {
                                width: 100%;
                                height: 100%;
                                border-radius: 100%;
                            }
                        }
                        > .vip-content {
                            padding-left: 10px;
                            width: 0;
                            flex: 1;
                            > .vip-name {
                                width: 100%;
                                padding-bottom: 10px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            > .vip-platform {
                                > .platform-icon {
                                    font-size: 16px;
                                    border-radius: 100%;
                                }
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
        .vip-selector {
            > .vip-selector-content {
                max-height: calc(100vh - 110px - 80px - 75px);
            }
        }
    }
</style>
