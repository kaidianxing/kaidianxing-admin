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
    <div class="main">
        <div class="header">
            <Button type="primary" :disabled="noManagePerm" @click="addKeyword">+创建关键词回复</Button>
        </div>
        <div class="table">
            <Table :columns="columns" :data="data"></Table>
            <div class="footer-page" v-if="total > 10">
                <kdx-page-component
                    ref="page"
                    :total="total"
                    @on-change="handlePageChange"
                ></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            columns: [
                { title: '规则名称', key: 'name' },
                { title: '关键词', key: 'keyword' },
                { title: '回复数量', key: 'count' },
                {
                    title: '操作',
                    width: 100,
                    render: (h, { row }) => {
                        return <div>
                            <Button disabled={this.noManagePerm} type="text" onClick={() => this.handleEdit(row.id)}>编辑</Button>
                            <Button disabled={this.noManagePerm} type="text" class="btn-next" onClick={() => this.handleSure(row.id)}>删除</Button>
                        </div>
                    }
                }
            ],
            data: [],
            total: 0,
            page: {
                pagesize: 10,
                page: 1
            }
        }
    },
    created() {
        this.getList()
    },
    computed: {    
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.wechat.manage");
        },
    },
    methods: {
        getList() {
            this.$api.homeApi.getKeywordList(this.page).then(res => {
                if (res.error === 0) {
                    let { list, total } = res.data
                    this.data = list;
                    this.total = total
                }
            })
        },
        handleEdit(id) {
            this.$router.push({ path: '/home/wechat/reply/keyword/set', query: { id } })
        },
        handleSure(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除该关键词吗?',
                onOk: () => {
                    this.handleDelete(id)
                }
            });
        },
        handleDelete(id) {
            this.$api.homeApi.deleteKeyWord({ id }).then(res => {
                if (res.error === 0) {
                    this.$Message.success('操作成功')
                    this.getList()
                }
            })
        },
        addKeyword() {
            this.$router.push({ path: '/home/wechat/reply/keyword/set' })
        },
        handlePageChange({ pageNumber, pageSize }) {
            this.page = {
                page: pageNumber,
                pagesize: pageSize
            }
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    margin-top: 20px;
    .header {
        padding: 20px 30px;
        background: #fff;
        border-radius: 2px;
    }

    .table {
        margin-top: 20px;
        padding: 0 20px 20px;
        border-radius: 2px;
        background: #fff;

        /deep/ .btn-next {
            margin-left: 10px;
        }

        .footer-page {
            padding-top: 20px;
            display: flex;
            justify-content: center;
        }
    }
}
</style>