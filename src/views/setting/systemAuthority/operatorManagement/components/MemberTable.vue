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
    <Table
        :columns="columns"
        :data="list"
    ></Table>
</template>

<script>

export default {
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '会员',
                    key: 'shop',
                    minWidth: 200,
                    render: (h, params) => {
                        const sourceTmp = {
                            '10': <kdx-svg-icon type="icon-H" class="platform-icon"></kdx-svg-icon>, // h5
                            '20': <kdx-svg-icon type="icon-weixin" class="platform-icon"></kdx-svg-icon>, // 公众号
                            '21': <kdx-svg-icon type="icon-weixinxiaochengxu" class="platform-icon"></kdx-svg-icon>, // 微信小程序
                            '30': <kdx-svg-icon type="icon-qudao-toutiao2" class="platform-icon"></kdx-svg-icon>, // 头条小程序
                            '31': <kdx-svg-icon type="icon-douyin" class="platform-icon"></kdx-svg-icon>, // 头条小程序
                            '32': <kdx-svg-icon type="icon-qudao-toutiaojisuban" class="platform-icon"></kdx-svg-icon>, // 抖音小程序
                            '70': <span style="color:#12aa9c;font-size:16px" class="iconfont icon-PCduan"></span>
                        }
                        let svgComponent = sourceTmp[params.row.source];
                        return (
                            <div class="vip-info">
                                <div class="user-image">
                                    <img src={this.$media(params.row.avatar)} alt="" onError={e => {
                                        this.replaceImage(e, 'avatar');
                                    }} />
                                </div>
                                <div class="vip-content">
                                    <p class="vip-name">
                                        {params.row.nickname}
                                    </p>
                                    <div class="vip-platform">
                                        {svgComponent}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                },
                {
                    title: '会员等级',
                    key: 'level_name',
                    minWidth: 100,
                    render: (h, params) => {
                        return (
                            <div>{params.row.level_name ? params.row.level_name : '普通会员'}</div>
                        );
                    }
                },
                {
                    title: '标签组',
                    key: 'group_name',
                    minWidth: 100,
                    render: (h, params) => {
                        return (
                            <div>{params.row.group_name ? params.row.group_name : '-'}</div>
                        );
                    }
                },
                {
                    title: '注册时间',
                    key: 'created_at',
                    width: 180
                }
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
/deep/ .ivu-table {
    td {
        // 会员
        .vip-info {
            display: flex;
            flex-wrap: nowrap;
            > .user-image {
                width: 46px;
                height: 46px;
                > img {
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;
                }
            }
            > .vip-content {
                padding-left: 10px;
                > .vip-name {
                    width: 100%;
                    padding-bottom: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                > .vip-platform {
                    > .platform-icon {
                        font-size: 16px;
                        border-radius: 100%;
                    }
                }
            }
        }
    }
}
</style>