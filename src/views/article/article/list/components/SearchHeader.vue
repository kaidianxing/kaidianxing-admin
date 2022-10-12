/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <kdx-header-bar>
        <template #header>
            <Button class="weixin-article" :disabled="noManagePerm" type="primary" @click="importArticle">导入微信文章</Button>
            <Button type="primary" :disabled="noManagePerm" @click="addArticle">+新增文章</Button>
        </template>
        <Form
            ref="form"
            :model="model"
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <FormItem label="文章标题：">
                <i-input
                    type="text"
                    v-model="model.title"
                    placeholder="请输入文章标题"
                    @on-enter="handleSearch"
                    class="width-340"
                />
            </FormItem>
            <FormItem label="发布时间：">
                <DatePicker
                    v-model="date"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择"
                    @on-change="changeDate"
                    class="width-340"
                ></DatePicker>
            </FormItem>
            <FormItem label="文章状态：">
                <Select v-model="model.status" class="width-160">
                    <Option
                        v-for="item in statusList"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="选择分组：">
                <Select v-model="model.group_id" class="width-160">
                    <Option value="0" >全部</Option>
                    <Option
                        v-for="item in groupList"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <div class="ivu-form-item-btn">
                <Button type="primary" @click="handleSearch">搜索</Button>
                <Button type="text" @click="handleReset">重置</Button>
            </div>
        </Form>
        <import-article-modal ref="modal"></import-article-modal>
    </kdx-header-bar>
</template>

<script>
import ImportArticleModal from './ImportArticleModal.vue'
export default {
    components: {
        ImportArticleModal
    },
    props: {
        isPermPlugins: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.getGroup()
    },
    data() {
        return {
            show: false,
            model: {
                title: "",
                start_time: "",
                end_time: "",
                status: "all",
                group_id: []
            },
            date: [],
            statusList: [
                {
                    value: "all",
                    label: "全部",
                },
                {
                    value: "1",
                    label: "显示",
                },
                {
                    value: "0",
                    label: "隐藏",
                }
            ],
            groupList: []
        };
    },
    computed: {
        noManagePerm() {
            return !this.$getPermMap('article.article.manage');
        }
    },
    methods: {
        // 获取分组
        getGroup() {
            this.$api.articleApi.getGroupList().then((res) => {
                if(res.error === 0) {
                    this.groupList = res.list
                }
            })
        },
        // 导入微信文章
        importArticle() {
            this.$refs.modal.setValue();
        },
        // 添加文章
        addArticle() {
            this.$router.push({
                path: '/article/article/add',
                query: {},
            })
        },
        changeDate(date) {
            this.model.start_time = date[0];
            this.model.end_time = date[1];
        },
        // 搜索
        handleSearch() {
            let params = {
                ...this.model,
            };
            if (this.model.status === "all") {
                params = {
                    ...params,
                    status: "",
                };
            }
            if (!this.model.group_id.length) {
                delete params.group_id
            }
            this.$emit("on-search", params);
        },
        // 重置
        handleReset() {
            this.reset();
            this.handleSearch();
        },
        reset() {
            this.model = {
                title: "",
                status: "all",
                start_time: "",
                end_time: "",
                group_id: []
            };
            this.date = [];
        },
    },
};
</script>
<style lang="scss" scoped>
.weixin-article {
    margin-right: 20px;
}
</style>
