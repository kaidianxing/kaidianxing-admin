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
    <div class="good-label">
        <kdx-header-bar>
            <template #header>
                <Button type="primary" :disabled='noManagePerm' @click='toAdd'>添加广告图</Button>
            </template>
        </kdx-header-bar>
        <div class="table-list" v-loading="table.loading">
            <table-list ref="table_list" :data="getTableData" :total="table.total" @on-refresh="getList"
                        @on-page-change="changePage" @tableEdit="tableEdit"></table-list>
        </div>
        <kdx-modal-frame :value="modalShow" :title="modalTitle" width="750" ok-text="保存" @on-ok="handleSave"
                         @on-cancel="handleCancel">
            <Form class="content" ref="form" :model="model" :rules="rules" :label-width="140">
                <div class="modal-box">
                    <FormItem label="banner名称：" prop="name">
                        <Input :disabled='noManagePerm' placeholder="请输入" maxlength="10" show-word-limit
                               class="width-300"
                               v-model="model.name"></Input>
                    </FormItem>
                    <FormItem label="广告图片：" prop="img">
                        <kdx-image-video
                            class="bannerImg"
                            type="image"
                            @on-change="changeThumb($event,'img')"
                            :current="model.img"
                        ></kdx-image-video>
                    </FormItem>

                    <FormItem label="图片跳转链接：" prop="url">
                        <Input
                            class="width-300"
                            v-model="model.url"
                            placeholder="请填写跳转pc页面的访问路径"
                        />
<!--                        <span-->
<!--                            :data-val="model.url"-->
<!--                            class="ck"-->
<!--                            @click="showSelect"-->
<!--                        >选择链接</span-->
<!--                        >-->
                    </FormItem>

                    <FormItem label="广告排序：" prop="sort_order">
                        <Input
                            type="number"
                            class="width-300"
                            v-model="model.sort_order"
                            placeholder="请输入"
                        />
                    </FormItem>
                </div>
            </Form>
        </kdx-modal-frame>
        <slot></slot>
    </div>
</template>

<script>
import TableList from "./components/TableList";

export default {
    name: "list",
    inject: ['returnToTop'],
    components: {
        TableList
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('pc.home-ads.manage')
        },
        getTableData() {
            return this.table.data.map(item => {
                item._disabled = this.noManagePerm
                return item
            })
        }
    },
    data() {
        return {
            modalShow: false,
            modalTitle: '添加广告图',
            model: {
                name: '',
                img: '',
                url: '',
                sort_order: ''
            },
            category: [],
            table: {
                data: [],
                loading: false,
                total: 0
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入轮播名称'
                    }
                ],
                img: [
                    {
                        required: true,
                        message: '请输上传图片'
                    }
                ],
                url: [
                    {
                        required: true,
                        message: '请输入跳转链接'
                    }
                ],
                sort_order: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if(value.length > 4){
                                callback(new Error('最多为4位数'));
                            }else if(!value){
                                callback(new Error('请输入商品组排序'));
                            }
                            else{
                                callback();
                            }
                        }
                    }
                ]
            },
            optionData: {
                status: [
                    {
                        value: 'all',
                        name: '全部'
                    },
                    {
                        value: '1',
                        name: '启用'
                    },
                    {
                        value: '0',
                        name: '禁用'
                    }
                ]
            },
            page: {
                pageSize: 20,
                pageNumber: 1
            },
        };
    },
    methods: {
        changeThumb(path, property) {
            this.$set(this.model, property, path);
        },
        validate(fn = () => {
        }) {
            return new Promise(resolve => {
                this.$refs['form'].validate(valid => {
                    resolve(valid);
                    fn(valid);
                    this.$nextTick(() => {
                        if (!valid) {
                            for (let k in this.cacheError) {
                                if (!this.cacheError[k]) {
                                    this.$focusError(k);
                                    break;
                                }
                            }
                        }
                    })
                });
            });
        },
        handleSave() {
            console.log(this.model, 'model')
            this.validate(valid => {
                if (valid) {
                    let apiName = 'advertiseAdd'//增加
                    if (this.modalTitle === '编辑广告图') apiName = 'advertiseEdit'
                    this.$api.homeApi[apiName](this.model)
                        .then(res => {
                            if (res.error === 0) {
                                this.handleCancel();
                                this.$Message.success('操作成功');
                                this.getList();
                            }
                        });
                }
            });
        },
        showSelect() {

        },
        onValidate(prop, status) {
            this.cacheError = {
                ...this.cacheError,
                [prop]: status
            }
        },
        toAdd() {
            this.modalTitle = '添加广告图'
            this.model = {
                name: '',
                img: '',
                url: '',
                sort_order: ''
            }
            this.$refs.form.resetFields()
            this.modalShow = true
        },
        tableEdit(item) {
            this.modalTitle = '编辑广告图'
            this.model = JSON.parse(JSON.stringify(item))
            this.modalShow = true
        },
        handleCancel() {
            this.modalShow = false
        },
        setStatus(val) {
            this.search.status = val;
        },
        handleSearch() {
            this.refreshTable();
        },
        refreshTable(page) {
            if (!page) {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
            }
            this.getList();
        },
        changePage(page) {
            this.page = page;
            this.getList();
        },

        getList() {
            this.returnToTop();
            // 重置表格下方
            this.table.loading = true;
            this.$api.homeApi.advertiseList({})
                .then(res => {
                    this.table.loading = false;
                    if (res.error === 0) {
                        this.table.data = res.list;
                        this.table.total = res.total;
                    }
                }).catch();
        }
    },
    mounted() {
        this.$history.setRoute(this.$route).getData(history => {
            let {search, page} = history
            this.search = this.$utils.deepCopy(search) || this.search
            this.page = page;
            this.$nextTick(() => {
                this.refreshTable(this.page);
            })

        })
    }
};
</script>

<style scoped lang="scss">
.modal-box {
    padding: 20px;

}

.content {
    /deep/ .bannerImg {
        ul {
            margin-bottom: 0px;
            li{
                margin-bottom: 0px;
            }
        }
    }
}

.good-label {
    background-color: $background-color;
    margin: 20px auto;

    /deep/ .search {
        padding-top: 0 !important;
    }


    .add-label {
        padding: 20px 0 20px 40px;
        border-bottom: 1px solid $border-color;
        background-color: #ffffff;
    }

    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
        position: relative;
    }
}

.ck {
    cursor: pointer;
    color: #ffffff;
    margin-left: 0px;
    padding: 8px 10px;
    position: relative;
    top: 1px;
    background-color: var(--theme-navBackground);
}
</style>
