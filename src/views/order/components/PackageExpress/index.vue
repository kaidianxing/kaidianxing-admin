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
    <kdx-modal-frame v-model="value" title="查看物流" :width="700" :loading="loading" cancel-text="关闭" :is-ok="false" @on-cancel="handleCancel">
        <div class="order-list-package-express">
            <div class="logistics">
                <div class="name">{{ express_com }}</div>
                <div class="number">{{ express_sn }}</div>
                <kdx-copy-text :text="express_sn">
                    <Button type="text" size="small">复制</Button>
                </kdx-copy-text>
            </div>
            <ul v-if="data && data.length > 0">
                <!--头部-->
                <li class="header">
                    <div class="time">
                        时间
                    </div>
                    <div class="schedule">
                        地址和跟踪进度
                    </div>
                </li>
                <!--快递信息-->
                <template>
                    <li v-for="(item, index) in data" :key="index" :class="index === 0 ? 'active' : 'disabled'">
                        <div class="time" v-html="getTime(item.date_time)">
                        </div>
                        <div class="schedule">
                            {{item.step}}
                        </div>
                        <div class="line" v-if="index !== data.length-1"></div>
                        <!--图标-->
                        <!--完成图标 状态标识码 0 => '在途',1 => '揽件', 2 => '疑难', 3 => '签收', 4 => '退签', 5 => '派件', 6 => '退回',	-->
                        <Icon v-if="status==3 && index === 0" type="ios-checkmark-circle" class="icon"/>
                        <!--开始图标-->
                        <Icon v-else-if="(status !==3&&index===0)||index===data.length-1" type="md-radio-button-on"
                              class="icon"></Icon>
                        <!--中间图标-->
                        <Icon v-else type="ios-arrow-dropup-circle" class="icon"/>
                    </li>
                </template>
            </ul>
            <div v-else style="text-align: center;padding-top: 20px;">
                暂无物流信息
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "index",
        props: {
            id: {
                type: [String, Number],
                required: true
            },
            packageId: {
                type: [String, Number]
            }
        },
        data() {
            return {
                value: false,
                data: [],
                status: '',
                loading: false,
                express_com: '',
                express_sn: '',
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.getData();
                }
            },
            getData() {
                this.loading = true;
                this.$api.orderApi.getExpress({order_id: this.id, package_id: this.packageId})
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.data = res.data?.data || [];
                            this.status = res.data?.state;
                            // 快递公司
                            this.express_com = res.data?.express_com
                            // 快递单号
                            this.express_sn = res.data?.express_sn
                        }
                    });
            },
            handleCancel() {
                this.setValue();
            },
            getTime(date) {
                let weekDay = ['星期日','星期一', '星期二','星期三','星期四','星期五','星期六'];
                return `${date}<br/>${weekDay[new Date(date).getDay()]}`
            }
        }
    };
</script>

<style scoped lang="scss">
    .order-list-package-express {
        padding: 20px;
        .logistics {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #E9EDEF;
            font-size: 14px;
            line-height: 20px;
            color: #262B30;
            .name {
                font-weight: 600;
                padding-left: 6px;
                padding-right: 10px;
            }
            .number {
                padding-right: 10px;
            }
        }
        > ul {
            > li {
                display: flex;
                flex-wrap: nowrap;
                position: relative;
                padding-bottom: 20px;

                > .time {
                    width: 100px;
                    box-sizing: border-box;
                    padding-right: 30px;
                    flex-shrink: 0;
                    @include font-12-16;
                }

                > .schedule {
                    width: 100%;
                    padding-left: 30px;
                    box-sizing: border-box;
                    @include font-14-20;
                    word-break: break-all;
                }

                > .line {
                    position: absolute;
                    left: 100px;
                    top: 0;
                    height: 100%;
                    width: 1px;
                    background-color: $border-color;
                }

                // 图标
                .icon {
                    position: absolute;
                    left: 100px;
                    top: 0;
                    transform: translateX(-50%);
                    font-size: 20px;
                    background-color: #FFFFFF;
                }
            }

            > .header {
                padding-bottom: 10px;

                >.time,
                >.schedule {
                    @include font-14-20-bold;
                }
            }

            // 选中
            > .active {
                color: $brand-color;
            }

            > .disabled {
                color: $text-third;
            }
        }
    }
</style>
