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
    <kdx-header-bar>
        <div class="btn-group">
            <Button
                type="primary"
                @click="createLiver"
            >创建直播间</Button><Button
                type="primary"
                ghost
                @click="syncLiver"
            >同步直播间</Button></div>
        <Form
            ref="form"
            :label-width="100"
            inline
            style="overflow:auto;"
            @submit.native.prevent
        >
            <FormItem label="直播信息：">
                <Input
                    type="text"
                    v-model="model.keywords"
                    placeholder="直播标题/主播昵称"
                    class="width-340"
                    @on-enter="handleSearch"
                />
            </FormItem>
            <FormItem label="直播状态：">
                <Select
                    v-model="model.status"
                    class="width-160"
                >
                    <Option
                        v-for="(item,index) in liverStatus"
                        :key="index"
                        :value="item.id"
                    >{{ item.text }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="开播时间：">
                <DatePicker
                    v-model="startTime"
                    type="datetimerange"
                    placeholder="开播时间"
                    @on-change="changeTime($event,'start_time')"
                    class="width-340"
                ></DatePicker>
            </FormItem>
            <FormItem label="结束时间：">
                <DatePicker
                    v-model="endTime"
                    type="datetimerange"
                    placeholder="结束时间"
                    @on-change="changeTime($event,'end_time')"
                    class="width-340"
                ></DatePicker>
            </FormItem>
            <div class="ivu-form-item-btn">
                <Button
                    type="primary"
                    @click="handleSearch"
                >搜索</Button>
                <Button
                    type="text"
                    @click="handleReset"
                >重置</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>

<script>
export default {
    name: 'SearchHeader',

    data() {
        return {
            model: {
                keywords: '',
                status: 'all',
                start_time: [],
                end_time: [],
            },
            startTime: [],
            endTime: [],
            statusList: [
                {
                    text: '全部',
                    type: 'all',
                },
                {
                    text: '上架',
                    type: '1',
                },
                {
                    text: '售磬',
                    type: '2',
                },
                {
                    text: '下架',
                    type: '3',
                },
                {
                    text: '回收站',
                    type: '4',
                },
            ],
            liverStatus: [
                { id: 'all', text: '全部' },
                { id: '101', text: '直播中' },
                { id: '102', text: '未开始' },
                { id: '103', text: '已结束' },
                // { id: '104', text: '禁播  ' },
                // { id: '105', text: '暂停  ' },
                // { id: '106', text: '异常  ' },
                // { id: '107', text: '已过期' },
            ]
        }
    },
    methods: {
        // 搜索
        handleSearch() {
            this.$emit('on-search', this.model)
        },
        reset() {
            this.startTime = []
            this.endTime = []
            this.model = {
                keywords: '',
                status: 'all',
                start_time: [],
                end_time: [],
            }
        },
        changeTime(date, key) {
            if (!date[0]) {
                this.model[key] = '';
            } else {
                this.model[key] = date;
            }
        },
        handleReset() {
            this.reset()
            this.$emit('on-search', this.model)
        },
        syncLiver() {
            this.$emit('on-sync')
        },
        createLiver() {
            this.$router.push('/liver/manage/list/create')
        }
    },
}
</script>
<style lang="scss" scoped>
.btn-group {
    margin: 0 0 20px 30px;
}
/deep/ .ivu-btn-primary.ivu-btn-ghost {
    margin-left: 20px;
    color: #57a3f3;
    background: rgba(245, 249, 254, 0.5);
}
</style>