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
    <div class="center-comp">
        <ul>
            <li @click="jumpCommission('0',noPerm.commissionAgent)">
                <div class="box">
                    <div class="tit">
                        <div class="text">分销商总数(人)</div>
                        <div class="line"></div>
                    </div>
                    <div class="num">
                        {{ commission.agent_count }}
                    </div>
                </div>
            </li>

            <li @click="jumpCommission('2',noPerm.commissionApply)">
                <div class="box">
                    <div class="tit">
                        <div class="text">待审核佣金(元)</div>
                        <div class="line"></div>
                    </div>
                    <div class="num">
                        {{ commission.pre_check }}
                    </div>
                </div>
            </li>
            <li @click="jumpCommission('3',noPerm.commissionApply)">
                <div class="box">
                    <div class="tit">
                        <div class="text">待打款佣金(元)</div>
                        <div class="line"></div>
                    </div>
                    <div class="num">
                        {{ commission.check_agree }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: [],
    data() {
        return {
            commission: {},
        }
    },
    computed: {
        noPerm() { //管理权限
            return {
                commissionAgent:!this.$getPermMap('commission.agent.view'),
                commissionWaitAgent:!this.$getPermMap('commission.wait_agent.view'),
                commissionApply:!this.$getPermMap('commission.apply.view'),
            }
        },
    },
    created() {
        this.getCommission()
    },
    methods: {
        // 首页分销数据
        getCommission() {
            this.$api.homeApi.getCommission({}).then((res) => {
                if (res.error === 0) {
                    this.commission = {
                        ...res.data,
                    }
                }
            })
        },
        // 跳转分销相关页面
        jumpCommission(type,noperm) {
            if(noperm){
                this.$Message.info('暂无查看权限')
                return
            }
            const url = [
                '/commission/distributor',
                '/commission/to-audit',
                '/commission/withdraw/list/waiting',
                '/commission/withdraw/list/paying',
            ]
            this.$utils.openNewWindowPage(url[type])
        },
    },
}
</script>

<style scoped lang="scss">
.center-comp {
    background-color: #fff;
    border-radius: 2px;
    padding-top: 20px;
    padding-bottom: 20px;
    ul {
        display: flex;
        li {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .box {
                text-align: center;
                .tit {
                    position: relative;
                    font-size: 14px;
                    line-height: 20px;
                    color: #262b30;
                    padding-bottom: 12px;
                    .line {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 16px;
                        height: 2px;
                        background: #f66000;
                    }
                }
                .num {
                    margin-top: 10px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    font-size: 24px;
                    line-height: 29px;
                    color: #262b30;
                    &:hover {
                        color: $data-blue;
                    }
                }
            }
        }
    }
}
</style>
