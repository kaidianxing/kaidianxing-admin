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
    <div>
        <FormItem
            :label="label"
            :label-width="labelWidth"
            style="margin-bottom:0"
        >
            <Button @click="selectVip" style="color: $brand-color;">+添加</Button>
            <p class="tip" style="margin-left:130px;margin-bottom:10px;">
                订单生成后以模板消息的方式商家通知，可以指定多个人，如果不填写则不通知
            </p>
            <div class="vip-table" v-show="vipList.length > 0">
                <Table :columns="columns" :data="vipList" size="small">
                    <template slot-scope="{ row }" slot="nickname">
                        <div class="vip-info">
                            <img
                                :src="row.avatar"
                                alt=""
                                @error="replaceImage($event, 'avatar')"
                            />
                            <p class="name">
                                <span style="margin-bottom:4px;">
                                    {{ row.nickname }}
                                </span>
                                <i
                                    class="iconfont"
                                    :class="{
                                        'icon-H': row.source === '10',
                                        'icon-weixin': row.source === '20',
                                        'icon-weixinxiaochengxu':
                                            row.source === '21',
                                    }"
                                    v-if="new Set(['10', '20', '21']).has(row.source)"
                                ></i>
                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="row.source === '30'"></kdx-svg-icon>
                                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="row.source === '32'"></kdx-svg-icon>
                                <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="row.source === '31'"></kdx-svg-icon>
                                <span style="color:#12aa9c;font-size:16px" class="iconfont icon-PCduan" v-else-if="row.source === '70'"></span>
                            </p>
                        </div>
                    </template>
                </Table>
            </div>
        </FormItem>
        <vip-selector
            ref="VipSelector"
            :currentList="vipList"
            multiple
            @on-change="getList"
        ></vip-selector>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import VipSelector from '@/components/selector/VipSelector'
export default {
    components: {
        VipSelector,
    },
    props: {
        type: {
            type: String,
            default: 'apply',
        },
        labelWidth: {
            type: [String, Number],
            default: 130,
        },
        label: {
            type: [String, Number],
            default: '选择通知人：',
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            ids: [],
            show: false,
            vipList: [], // 选中会员列表
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
                                <span
                                    style="color: $brand-color;font-size: 14px;cursor:pointer;"
                                    onClick={() => {
                                        this.delete(params)
                                    }}
                                >
                                    删除
                                </span>
                            </p>
                        )
                    },
                },
            ],
        }
    },
    watch: {
        value: {
            handler() {
                this.ids = this.value || []
            },
            immediate: true,
        },
        type: {
            handler(value) {
                if (value === 'apply') {
                    this.vipList = [...this.applyMemberInfo]
                } else if (value === 'withdraw') {
                    this.vipList = [...this.withdrawMemberInfo]
                }
            },
            immediate: true,
        },
        applyMemberInfo: {
            handler(value) {
                if (this.type === 'apply') {
                    this.vipList = [...value]
                }
            },
            immediate: true,
            deep: true,
        },
        withdrawMemberInfo: {
            handler(value) {
                if (this.type === 'withdraw') {
                    this.vipList = [...value]
                }
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        ...mapGetters('commission/noticeSettings', [
            'applyMemberInfo',
            'withdrawMemberInfo',
        ]),
    },
    methods: {
        ...mapMutations('commission/noticeSettings', [
            'changeMemberInfo',
        ]),
        delete(params) {
            this.vipList.splice(params.index, 1)
            this.ids.splice(params.index, 1)
            this.changeMemberInfo({
                type: this.type,
                data: this.vipList,
            })
            this.$emit('change', this.ids)
            this.$emit('input', this.ids)
        },
        getList(list) {
            this.vipList = list.map((item) => {
                return {
                    id: item.id,
                    source: item.source,
                    avatar: item.avatar,
                    nickname: item.nickname,
                }
            })
            this.changeMemberInfo({
                type: this.type,
                data: this.vipList,
            })
            this.ids = [...list.map((item) => item.id)]
            this.$emit('change', this.ids)
            this.$emit('input', this.ids)
        },
        selectVip() {
            this.$refs.VipSelector.setValue()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/components/common.scss';
.vip-table {
    padding: 0 20px;
    background-color: #ffffff;
    margin-left: 130px;
    width: 610px;
    /deep/ .ivu-table {
        .ivu-table-tip,
        .ivu-table-body {
            table {
                margin-bottom: -2px;
            }
        }
    }
    /deep/ .vip-info {
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
