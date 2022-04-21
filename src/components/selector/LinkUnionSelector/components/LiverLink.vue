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
    <div class="select-page-type">
        <div class="type-content">
            <div class="search">
                <Input
                    v-model="search.keywords"
                    search
                    enter-button="搜索"
                    placeholder="请输入"
                    @on-search="handleSearch"
                    @on-enter="handleSearch"
                    class="width-250"
                />
            </div>
            <Table
                ref="table"
                :columns="columns"
                :data="table.data"
                v-loading="table.loading"
            ></Table>
            <kdx-page-component
                class="pagation"
                ref="page"
                :total="table.total"
                @on-change="handlePageChange"
            ></kdx-page-component>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        current: {
            type: [String, Object],
            default: () => { }
        },
    },
    data() {
        return {
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            search: {
                keywords: ''
            },
            table: {
                total: 30,
                data: [],
                loading: false
            },
            columns: [{
                title: '直播间ID',
                key: 'id',
                width: 100,
            }, {
                title: '直播间信息',
                width: 400,
                render: (h, params) => {
                    return (
                        <div class="liver-info">
                            <img src={this.$utils.getWechatImg(params.row.share_img)|| this.$utils.staticImg('decorate/goods_col2.png')} class="liver-thumb" />
                            <div class="two-line-hide liver-title">{params.row.title}</div>
                        </div>
                    )
                },

            }, {
                title: '直播状态',
                render: (h, params) => {
                    let statusInfo = {
                        '101': { text: '直播中', status: 'pending' },
                        '102': { text: '未开始', status: 'wait' },
                        '103': { text: '已结束', status: 'finished' },
                        '104': { text: '禁播', status: 'finished' },
                        '105': { text: '暂停', status: 'finished' },
                        '106': { text: '异常', status: 'finished' },
                        '107': { text: '已过期', status: 'finished' },
                    }

                    return (
                        <div class={'liver-status ' + statusInfo[params.row.status]?.status || 'wait'}>{statusInfo[params.row.status]?.text}</div>
                    )
                },
            }, {
                title: '操作',
                width: 100,
                render: (h, params) => {
                    let temp;
                    if (params.row.checked) {
                        temp = <Button type="primary" onClick={() => this.setChecked(params.index, false)}>已选</Button>
                    } else {
                        temp = <Button type="default" onClick={() => this.setChecked(params.index, true)}>选择</Button>
                    }
                    return (
                        temp
                    )
                }
            }],
            selectRow: {}
        }
    },
    created() {
        this.getLivers()
    },
    methods: {
        handleSearch() {
            this.resetPage()
            this.getLivers()
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            }
            this.$refs['page']?.reset()
        },
        getLivers() {
            this.table.loading = true
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                ...this.search,
            }
            this.$api.liverApi
                .decorateLiver(params)
                .then((res) => {
                    if (res.error === 0) {
                        this.table.data = res.list
                        this.table.total = res.total
                        this.table.loading = false
                        this.defaultChecked()
                    }
                })
                .catch()
        },
        handlePageChange(page) {
            this.page = page;
            this.getLivers()
            try{
                document.querySelectorAll('.noAnimate .ivu-tabs-content')[0].scrollTop =0
            }catch(err){
                console.log(err)
            }
        },
        setChecked(index, isChecked) {
            // 单选
            if (isChecked) {
                this.table.data.forEach((item, i) => {
                    this.$set(this.table.data[i], 'checked', false)
                })
                this.$set(this.table.data[index], 'checked', true)
                this.$emit('on-change', { url: `/pages/liver/liver?liverId=${this.table.data[index].id}&broadId=${this.table.data[index].broadcast_room_id}`, name: '小程序直播' });
                this.selectRow = this.table.data[index]
            } else {
                this.$set(this.table.data[index], 'checked', false)
                this.selectRow = {}
            }
        },
        // 进行默认选中
        defaultChecked() {
            this.table.data?.forEach((item, index) => {
                let linkurl = `/pages/liver/liver?liverId=${item.id}&broadId=${item.broadcast_room_id}`
                if (this.current && linkurl === this.current.url) {
                    this.$set(this.table.data[index], 'checked', true)
                } else {
                    this.$set(this.table.data[index], 'checked', false)
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.select-page-type {
    padding: 20px;
    background-color: #fff;
    .type-content {
    }
    /deep/ .ivu-table-cell {
        padding: 10px 15px;
    }
}

/deep/ .liver-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .liver-thumb {
        margin-right: 10px;
        width: 100px;
        height: 80px;
    }

    .liver-title {
        font-size: 14px;
        line-height: 20px;
        color: #262b30;
    }
}

/deep/ .liver-status {
    display: inline-block;
    border-radius: 2px;
    padding: 0 8px;
    height: 24px;
    font-size: 14px;
    text-align: center;
    line-height: 24px;

    &.pending {
        background: #edfff3;
        color: #19be6b;
    }

    &.wait {
        background: #f4f6f8;
        color: #939799;
    }

    &.complete {
        background: #fff9e6;
        color: #ff9900;
    }
}

.pagation {
    margin-top: 20px;
    text-align: center;
}
</style>
