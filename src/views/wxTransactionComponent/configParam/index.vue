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
        <div class="container">
            <Form class="content" ref="form" :model="model" :label-width="140">
                <kdx-form-title>配置参数</kdx-form-title>
                <FormItem class="r-form-item-checkbox" label="URL：">
                    <span class="width-430 marginR-10" style="display: inline-block;">{{model.url}}</span>
                    <kdx-copy-text :text="model.url">
                        <Button type="text" size="small">复制</Button>
                    </kdx-copy-text>
                </FormItem>
                <FormItem class="r-form-item-checkbox" label="Token：">
                    <span class="width-430 marginR-10" style="display: inline-block;">{{model.token}}</span>
                    <kdx-copy-text :text="model.token">
                        <Button type="text" size="small">复制</Button>
                    </kdx-copy-text>
                </FormItem>
                <FormItem class="r-form-item-checkbox" label="EncodingAESKey：">
                    <span class="width-430 marginR-10" style="display: inline-block;">{{model.encoding_aes_key}}</span>
                    <kdx-copy-text :text="model.encoding_aes_key">
                        <Button type="text" size="small">复制</Button>
                    </kdx-copy-text>
                </FormItem>
                <kdx-form-title>定向设置</kdx-form-title>
                <kdx-hint-alert :showIcon="false" class="marginB-10">
                    <p class="danger-color">自定义交易组件的新用户请选择会员并保存，用于调取有关接口开通组件（往期已接入过的无需设置）；</p>
                    此处选择的会员在微信小程序产生的订单均视为视频号订单；成功接入自定义交易组件后可移除此处设置的会员，移除后恢复下单渠道判定
                </kdx-hint-alert>
                <FormItem class="r-form-item-checkbox" label="选择会员：" prop="member_id">
                    <Button class="default-primary" @click="selectVip">选择</Button>
                    <div class="vip-table" v-show="memberList.length > 0">
                        <Table :columns="columns" :data="memberList" size="small">
                            <template slot-scope="{ row }" slot="nickname">
                                <div class="vip-info">
                                    <img :src="row.avatar" alt="" @error="replaceImage($event, 'avatar')"/>
                                    <p class="name">
                                        <span style="margin-bottom:4px;">{{ row.nickname }}</span>
                                        <i class="iconfont" :class="{
                                            'icon-H': row.source === '10',
                                            'icon-weixin': row.source === '20',
                                            'icon-weixinxiaochengxu': row.source === '21'}"
                                           v-if="new Set(['10', '20', '21']).has(row.source)">
                                        </i>
                                        <svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="row.source === '30'"></svg-icon>
                                        <svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="row.source === '32'"></svg-icon>
                                        <svg-icon class="iconfont" type="icon-douyin" v-else-if="row.source === '31'"></svg-icon>
                                        <svg-icon class="iconfont" type="icon-qudao-App" v-else-if="row.source === '40'"></svg-icon>
                                    </p>
                                </div>
                            </template>
                        </Table>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
        </template>
        <!-- 微信渠道会员 -->
        <vip-selector ref="VipSelector" :current="memberList[0]" source="21" @on-change="getmemberList"></vip-selector>
    </kdx-content-bar>
</template>

<script>
import VipSelector from '@/components/selector/VipSelector';

export default {
    name: "index",
    components: { VipSelector},
    props: {},
    data() {
        return {
            loading: false,
            model: {
                url: '',
                token: '',
                encoding_aes_key: '',
                member_id: ''
            },
            memberList: [], // 选中会员列表
            columns: [
                {
                    title: '会员',
                    slot: 'nickname',
                },
                {
                    key: 'option',
                    title: '操作',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return (
                            <p class="option" style="text-align:center;">
                                <span style="color: $brand-color;font-size: 14px;cursor:pointer;" onClick={() => {this.delete(params.index)}}>删除</span>
                            </p>
                        )
                    },
                },
            ],
        }
    },
    computed: {},
    created() {
    },
    mounted() {
        this.getData()
        this.getDevelopment()
    },
    methods: {
        getData() {
            this.$api.wxTransactionComponentApi.getConfigParam().then(res => {
                if(res.error == 0) {
                    this.model = res.data
                }
            })
        },
        // 获取定向设置
        getDevelopment() {
            this.$api.wxTransactionComponentApi.getDevelopment().then(res=> {
                if(res.error === 0) {
                    this.memberList = res.data?.memberList != null ? [res.data?.memberList] : []
                    this.model.member_id = res.data.member_id;
                }
            })
        },
        // 会员选择弹窗选择
        getmemberList(list) {
            this.memberList = [{
                id: list.id,
                source: list.source,
                avatar: list.avatar,
                nickname: list.nickname,
            }];
            this.model.member_id = list.id;
            this.$emit('input', this.model)
        },
        delete(index) {
            this.memberList.splice(index, 1);
            this.model.member_id = '';
            this.$emit('input', this.model)
        },
        selectVip() {
            this.$refs.VipSelector.setValue()
        },
        handleSave() {
            this.$api.wxTransactionComponentApi.saveDevelopment({
                member_id: this.model.member_id,
                memberList: this.memberList
            }).then(res=> {
                if(res.error === 0) {
                    this.$Message.success('保存成功');
                    this.getDevelopment()
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.tip {
    margin-bottom: 10px;
    /deep/ .ivu-alert {
        line-height: 24px;
    }
}
.container {
    background:#ffffff;
    height: 100%;
    padding: 40px;
    /*margin: 20px auto 0;*/
    .block {
        margin: -20px 0 30px 140px;
        padding: 30px 0 10px;
        background-color: $background-color;
    }
}
/* 选中会员列表 */
.vip-table {
    width: 520px;
    margin-top: 10px;
    background-color: #ffffff;
    border: 1px solid $border-color;
    .ivu-table {
        .ivu-table-tip,
        .ivu-table-body {
            table {
                margin-bottom: -2px;
            }
        }
        .ivu-table-header {
            tr th {
                background-color: $background-color;
            }
        }
    }
    .vip-info {
        display: flex;
        flex-wrap: nowrap;
        img {
            width: 46px;
            height: 46px;
            border: 1px solid #e9edef;
            box-sizing: border-box;
            border-radius: 50%;
            margin-right: 10px;
        }
        .name {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .iconfont {
            font-size: 20px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
        }
        .icon-weixin {
            color: $success-color;
        }
        .icon-weixinxiaochengxu {
            color: #677de0;
        }
        .icon-toutiaoxiaochengxu {
            color: #239bff;
        }

        .icon-zhifubaoxiaochengxu {
            color: #2094e7;
        }

        .icon-baiduxiaochengxu {
            color: #306cff;
        }

        .icon-H {
            color: #ff6004;
        }
    }
}
</style>
