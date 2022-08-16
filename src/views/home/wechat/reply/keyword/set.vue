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
        <div class="content">
            <Form ref="form" :model="model" :rules="rules" :label-width="150">
                <kdx-form-title>基本信息</kdx-form-title>
                <FormItem label="规则名称：" prop="name">
                    <Input
                        class="width-340"
                        v-model="model.name"
                        placeholder="请输入规则名称"
                    ></Input>
                </FormItem>
                <FormItem label="关键词设置：" prop="rule_keyword_data">
                    <Button type="primary" @click="addKeyword"
                        >+添加关键词</Button
                    >
                    <div class="table">
                        <Table
                            draggable
                            border
                            :columns="keyColumns"
                            :data="model.rule_keyword_data"
                            size="small"
                            @on-drag-drop="draggeTable"
                        ></Table>
                    </div>
                </FormItem>
                <kdx-form-title>回复内容</kdx-form-title>
                <FormItem label="规则名称：">
                    <RadioGroup v-model="model.reply_setting">
                        <Radio label="1">回复首条</Radio>
                        <Radio label="2">随机回复一条</Radio>
                        <Radio label="3">回复全部</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="添加回复内容：" prop="rule_content">
                    <Button type="primary" @click="addText">+添加文字</Button>
                    <Button type="primary" class="btn-next" @click="addImage"
                        >+添加图片</Button
                    >
                    <div class="table">
                        <Table
                            draggable
                            border
                            :columns="columns"
                            :data="model.rule_content"
                            size="small"
                            @on-drag-drop="draggeTable"
                        ></Table>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled="noManagePerm" :loading="loading" type="primary" @click="validate"
                >保存</Button
            >
        </template>
        <key-word-modal
            ref="keyModal"
            :current="currentKey"
            @on-change="keywordChange"
        ></key-word-modal>
        <text-modal
            ref="textModal"
            :current="currentContent"
            @on-change="textChange"
        ></text-modal>
        <image-selector
            :current="currentContent"
            ref="imgModal"
            return-type="object"
            @on-change="imgChange"
        ></image-selector>
    </kdx-content-bar>
</template>
<script>
import ImageSelector from '@/components/selector/ImageSelector.vue';
import KeyWordModal from './components/KeyWordModal.vue';
import TextModal from './components/TextModal.vue';

export default {
    components: { KeyWordModal, TextModal, ImageSelector },
    data() {
        return {
            model: {
                name: '',
                containtype: [],
                rule_keyword_data: [],
                reply_setting: '1',
                rule_content: [],
                module: 'wechat'
            },
            rules: {
                name: [{ required: true, message: '请输入规则名称' }],
                rule_content: [{ required: true, message: '请设置回复内容', type: 'array' }],
                rule_keyword_data: [{ required: true, message: '请设置关键字', type: 'array' }],
            },
            columns: [
                {
                    width: 60,
                    title: ' ',
                    render: () => {
                        return <i class="iconfont icon-move move-icon" />
                    }
                }, {
                    title: '回复内容',
                    key: 'content',
                    render: (h, { row }) => {
                        if (row.containtype == 'images') {
                            return <img class="reply-img" src={this.$media(row.content.path)} onError={e => {
                                this.replaceImage(e);
                            }} />
                        } else {
                            return <div>{row.content}</div>
                        }
                    }
                }, {
                    title: '操作',
                    width: 100,
                    render: (h, { index }) => {
                        return <div>
                            <Button type="text" onClick={() => this.handleContentEdit(index)}>编辑</Button>
                            <Button type="text" class="btn-next" onClick={() => this.handleRemoveContent(index)}>删除</Button>
                        </div>
                    }
                }],
            loading: false,
            keyColumns: [
                { title: '关键词', key: 'keyword' },
                {
                    title: '匹配', key: 'type', render: (h, { row }) => {
                        if (row.type == '1') {
                            return <div class="match_tag strict">精准匹配</div>
                        } else {
                            return <div class="match_tag vague">模糊匹配</div>
                        }
                    }
                },
                {
                    title: '操作',
                    width: 100,
                    render: (h, { index }) => {
                        return <div>
                            <Button type="text" onClick={() => this.handleEdit(index)}>编辑</Button>
                            <Button type="text" class="btn-next" onClick={() => this.handleRemove(index)}>删除</Button>
                        </div>
                    }
                }
            ],
            keyIndex: -1,
            contentIndex: -1,
        };
    },
    computed: {
        currentKey() {
            if (this.keyIndex > -1) {
                return this.model.rule_keyword_data[this.keyIndex]
            } else {
                return {}
            }
        },
        currentContent() {
            if (this.contentIndex > -1) {
                return this.model.rule_content[this.contentIndex].content
            } else {
                return ''
            }
        },
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.wechat.manage");
        },
    },
    created() {
        let id = this.$route.query.id
        if (id) {
            this.model.id = id
            this.getKeyInfo(id);
        }
    },
    methods: {
        getKeyInfo(id) {
            this.$api.homeApi.getKeyWord({ id }).then(res => {
                if (res.error === 0) {
                    let {rule_content, ...data} = res.data;
                    rule_content.forEach(item => {
                        // 只有图片类型的需要解析数据，转换格式
                        if (item.containtype === 'images') {
                            let content = item.content?.split('_id=') || [];
                            item.content = {
                                id: content?.[1] || '',
                                path: content?.[0] || ''
                            }
                        }
                    })
                    this.model = {
                        ...this.model,
                        ...data,
                        rule_content,
                    }
                }
            })
        },
        validate() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitSave()
                }
            })
        },
        submitSave() {
            // 获取设置包含的回复内容类型
            this.model.containtype = [...new Set(this.model.rule_content.map(item => item.containtype))]
            let apiName = this.model.id ? 'updateKeyWord' : 'addKeyWord'
            let containtype = new Set(), rule_content = [];
            this.model.rule_content.forEach(item => {
                let ruleContent = {};
                if (item.containtype === 'images') {
                    ruleContent = {
                        containtype: item.containtype,
                        // 将图片的id暂时放在路径后面，编辑时会返回content字段，不会返回attachment_id字段
                        content: item.content.path + '_id=' + item.content.id,
                        attachment_id: item.content.id
                    }
                } else {
                    ruleContent = {
                        containtype: item.containtype,
                        content: item.content
                    }
                }
                item.id && (ruleContent.id = item.id);
                containtype.add(item.containtype);
                rule_content.push(ruleContent)
            })
            let params = {
                ...this.model, // 编辑时的id在model.id上
                containtype: [...containtype], // 需要进行去重处理
                rule_content
            }
            this.loading = true
            this.$api.homeApi[apiName](params).then(res => {
                if (res.error == 0) {
                    this.$Message.success('保存成功')
                    this.$router.back()
                }
            }).finally(()=> {
                this.loading = false
            })
        },
        addKeyword() {
            this.keyIndex = -1
            this.$refs.keyModal.setValue()
        },
        keywordChange(e) {
            // 需要检测是否重复
            // 已存在的关键字不需要检测
            if(this.keyIndex!=-1 && e.keyword== this.model.rule_keyword_data[this.keyIndex].keyword) {
                this.$set(this.model.rule_keyword_data, this.keyIndex, e)
                return
            }

            this.$api.homeApi.checkKeyWord({ keyword: e.keyword }).then(res => {
                if (res.error === 0) {
                    if (this.keyIndex == -1) {
                        this.model.rule_keyword_data.push(e)
                    } else {
                        this.$set(this.model.rule_keyword_data, this.keyIndex, e)
                    }
                }
            })
        },
        handleEdit(index) {
            this.keyIndex = index
            this.$refs.keyModal.setValue()
        },
        handleRemove(index) {
            this.model.rule_keyword_data.splice(index, 1)
        },
        addText() {
            this.contentIndex = -1
            this.$refs.textModal.setValue()
        },
        addImage() {
            this.contentIndex = -1
            this.$refs.imgModal.setValue()
        },
        handleContentEdit(index) {
            this.contentIndex = index
            if (this.model.rule_content[index].containtype == 'images') {
                this.$refs.imgModal.setValue()
            } else {
                this.$refs.textModal.setValue()
            }
        },
        handleRemoveContent(index) {
            this.model.rule_content.splice(index, 1)
        },
        textChange(content) {
            if (this.contentIndex == -1) {
                this.model.rule_content.push({
                    containtype: 'text',
                    content
                })
            } else {
                this.$set(this.model.rule_content[this.contentIndex], 'content', content)
            }
        },
        imgChange(e) {
            if (this.contentIndex == -1) {
                this.model.rule_content.push({
                    containtype: 'images',
                    content: e
                })
            } else {
                e && this.$set(this.model.rule_content[this.contentIndex], 'content', e)
            }
        },
        draggeTable(nIndex, oIndex) {
            let rule_content = this.model.rule_content
            let item = { ...rule_content[nIndex] };
            Object.assign(rule_content[nIndex], rule_content[oIndex]);
            Object.assign(rule_content[oIndex], item)
        }
    }
};
</script>
<style scoped lang="scss">
.content {
    padding: 40px;
    background: #fff;
    margin: 20px auto 0;
    min-height: calc(100% - 108px);
    box-sizing: border-box;

    .main {
        padding: 30px 30px 30px 20px;
        background-color: #f4f6f8;
        border-radius: 2px;

        .ivu-form-item {
            margin-bottom: 0;
        }
    }

    .item-append {
        display: inline-block;
        padding: 0 7px;
        width: auto;
        height: 32px;
        line-height: 32px;
    }

    .paddingL {
        padding-left: 10px;
        white-space: nowrap;
    }

    .table {
        margin-top: 10px;
        width: 790px;
    }

    /deep/ .btn-next {
        margin-left: 10px;
    }
    /deep/ .ivu-table {
        .ivu-table-row {
            td {
                border-right: none;
            }
        }

        thead {
            th {
                background: #f4f6f8 !important;
                border-right: none;

                &:first-child {
                    .ivu-table-cell {
                        padding-left: 10px !important;
                    }
                }
            }
        }

        .ivu-table-cell {
            padding: 10px 10px !important;
        }
        .icon-move {
            color: #b8b9bd;
            font-size: 24px;
        }

        .reply-img {
            display: block;
            border: 1px solid #e9edef;
            border-radius: 2px;
            height: 40px;
            width: 40px;
        }
    }

    /deep/ .match_tag {
        border-radius: 2px;
        width: 66px;
        height: 24px;
        font-size: 14px;
        text-align: center;
        line-height: 24px;

        &.vague {
            background: #fff9e6;
            color: #ff9900;
        }

        &.strict {
            background: #edfff3;
            color: #19be6b;
        }
    }
}
</style>
