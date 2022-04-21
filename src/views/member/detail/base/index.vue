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
	<div class="vip-detail-base">
		<div class="content">
			<div class="base">
				<kdx-form-title>基本信息</kdx-form-title>
				<Row class="base-information">
					<Col span="6">
						<Form :label-width="120">
							<FormItem label="手机号码：">
								<kdx-svg-icon
									v-show="user.mobile"
									type="icon-dianhua"
									class="telephone-icon"
								></kdx-svg-icon>
								<span class="telephone">{{
									user.mobile || "-"
								}}</span>
							</FormItem>
							<FormItem label="标签组：">
								<div
									class="label-group"
									v-if="user.groups && user.groups.length > 0"
								>
									<kdx-tag-label
										v-for="(item, index) in user.groups"
										:key="index"
										type="info"
										:closable="false"
										border
										style="margin: 0 10px 10px 0;"
										>{{ item.group_name || "" }}</kdx-tag-label>
								</div>
							</FormItem>
							<!--<FormItem label="真实姓名：">
                      {{user?(user.realname || '无'):''}}
                  </FormItem>-->
						</Form>
					</Col>
					<Col span="6">
						<Form :label-width="120">
							<FormItem label="用户密码：">
								<span style="margin-right: 10px ">{{
									user.password_set ? "已设置" : "未设置"
								}}</span>
							</FormItem>

							<FormItem label="会员等级：">
								<span
									v-if="user && user.is_default_level"
									style="margin-right: 5px;"
									>{{ user.level_name || "" }}</span
								>
								<span class="vip-grade" v-else>
									<i
										class="icon-huangguan icon iconfont"
										style="color:#EAD4A9"
									></i>
									{{ user.level_name || "" }}
								</span>
							</FormItem>
						</Form>
					</Col>
					<Col span="6">
						<Form :label-width="120">
							<FormItem label="关注状态：">
								{{ user.is_follow_name }}
							</FormItem>
							<FormItem label="最近浏览时间：">
								{{ user.last_time }}
							</FormItem>
						</Form>
					</Col>
					<Col span="6">
						<Form :label-width="120">
							<FormItem label="出生日期：">
								{{
									`${user.birth_year}-${user.birth_month}-${user.birth_day}`
								}}
							</FormItem>
							<FormItem label="所属城市：">
								{{
									`${user.province || ""}-${user.city || ""}`
								}}
							</FormItem>
						</Form></Col
					>
				</Row>
			</div>
			<!--表单信息-->
			<form-info v-if="form.content" :data="form.content"></form-info>
			<div class="deal">
				<kdx-form-title>交易信息</kdx-form-title>
				<Row class="deal-information">
					<Col :xxl="6" :xl="12" :lg="12" :md="12">
						<div class="deal-information-content">
							<div class="left-icon">
								<i
									class="iconfont icon-dingdan"
									style="color: $brand-color;"
								></i>
							</div>
							<div class="right-content">
								<p class="title">累计成交订单数(笔)</p>
								<div>
									<span class="number">{{
										order_info.success_count
									}}</span>
									<Button
										type="text"
										:disabled="user.is_deleted == 1"
										@click="toOrder"
										>查看</Button
									>
								</div>
							</div>
						</div>
					</Col>
					<Col :xxl="6" :xl="12" :lg="12" :md="12">
						<div class="deal-information-content balance-color">
							<div class="left-icon">
								<i
									class="iconfont icon-jinqian1"
									style="color: #FF9900;"
								></i>
							</div>
							<div class="right-content">
								<p class="title">累计成交金额</p>
								<div>
									<span class="number archive-price"
										>￥{{ order_info.success_price }}</span
									>
								</div>
							</div>
						</div>
					</Col>
					<Col :xxl="6" :xl="12" :lg="12" :md="12">
						<div class="deal-information-content normal-color">
							<div class="left-icon">
								<i
									class="iconfont icon-dingdan"
									style="color: #FF1F2C;"
								></i>
							</div>
							<div class="right-content">
								<p class="title">累计退款订单数(笔)</p>
								<div>
									<span class="number order-number">{{
										order_info.refund_count
									}}</span>
									<Button
										type="text"
										:disabled="user.is_deleted == 1"
										@click="toRefundOrder"
										>查看</Button
									>
								</div>
							</div>
						</div>
					</Col>
					<Col :xxl="6" :xl="12" :lg="12" :md="12">
						<div class="deal-information-content normal-color">
							<div class="left-icon">
								<i
									class="iconfont icon-jinqian1"
									style="color: #FF1F2C;"
								></i>
							</div>
							<div class="right-content">
								<p class="title">累计退款金额</p>
								<div>
									<span class="number order-number"
										>￥{{ order_info.refund_price }}</span
									>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	</div>
</template>

<script>
import FormInfo from "./components/FormInfo";

export default {
	components: { FormInfo },
	props: {
		memberData: {
			type: Object,
		},
		levels: {
			type: Array,
		},
		groups: {
			type: Array,
		},
		form: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		// 获取渠道信息
		allSource() {
			const allSourceOption = {
				10: {
					class: "icon-H color-icon-H",
					type: "icon-qudao-H5-gray",
					name: "手机浏览器H5",
				},
				20: {
					class: "icon-weixin color-weixin",
					type: "icon-qudao-weixin-gray",
					name: "公众号",
				},
				21: {
					class: "icon-weixinxiaochengxu color-weixinxiaochengxu",
					type: "icon-qudao-weixinxiaochengxu-gray",
					name: "微信小程序",
				},
				30: {
					class: "icon-qudao-toutiao2",
					type: "icon-qudao-toutiao2-gray",
					name: "头条小程序",
				},
				32: {
					class: "icon-qudao-toutiaojisuban",
					type: "icon-qudao-toutiaojisuban-gray",
					name: "头条小程序",
				},
				31: {
					class: "icon-douyin",
					type: "icon-qudao-douyin-gary",
					name: "抖音小程序",
				},
			};
			// eslint
			let sources = this?.user?.all_source || [];
			let allSource = sources.sort(
				(a, b) => b.is_register - a.is_register
			);
			return allSource.map(item => {
				let source = {};
				source.is_register = item.is_register;
				source.source = item.source;
				Object.assign(source, allSourceOption[item.source]);
				return source;
			});
		},
	},
	data() {
		return {
			user: {
				avatar: "",
				groups: [],
			},
			order_info: {},
		};
	},
	watch: {
		memberData: {
			handler(newValue) {
				this.user = newValue.member || {};
				this.order_info = newValue.order_info || {};
				// this.getAllSource();
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		toOrder() {
			let search = {
				keywords: this.user.id,
				search_field: "member_id",
			};
			this.$utils.openNewWindowPage("/order/list/all", search);
		},
		toRefundOrder() {
			let search = {
				keywords: this.user.id,
				search_field: "member_id",
				refund_type: "4",
			};
			this.$utils.openNewWindowPage("/order/list/refund", search);
		},
	},
};
</script>

<style scoped lang="scss">
.vip-detail-base {
	> .content {
		padding: 0 40px 50px 40px;
		.deal,
		.asset,
		.base {
			padding-bottom: 40px;
		}
		.base-information {
			/deep/ .ivu-form-item {
				margin-bottom: 20px;
				.ivu-form-item-label {
					padding: 0;
				}
				.ivu-form-item-content {
					display: flex;
					align-items: center;
					line-height: 20px;
					padding-left: 6px;
				}
			}
			.user {
				display: flex;
				flex-wrap: nowrap;
				> .user-image {
					margin-left: 40px;
					margin-right: 20px;
					width: 90px;
					height: 90px;
					border: 4px solid #ffffff;
					border-radius: 100%;
					box-shadow: 0 4px 10px rgba(0, 82, 169, 0.2);
					display: inherit;
					box-sizing: border-box;
					flex-shrink: 0;
					overflow: hidden;
					> img {
						width: 84px;
						height: 84px;
						border-radius: 100%;
					}
				}
				> .user-information {
					width: 100%;
					.ivu-btn {
						vertical-align: inherit;
					}
					.name {
						@include font-14-20-bold;
						color: $text-first;
						padding-bottom: 20px;
						padding-left: 0;
					}
					.telephone-icon {
						color: #19be6b;
						font-size: 20px;
						> /deep/ svg {
							vertical-align: middle;
						}
					}
					.telephone {
						padding-right: 10px;
					}
					.vip-grade {
						background: linear-gradient(
								90deg,
								#4a505c 0%,
								#45525f 100%
							),
							#ff9900;
						border-radius: 2px;
						padding: 2px 3px;
						color: #ffffff;
						@include font-12-16-bold;
						margin: 10px 10px 10px 0;
						> .icon {
							color: linear-gradient(
									180deg,
									#f6f2e8 0%,
									#ebd9c1 100%
								),
								#e6dab1;
							padding-right: 2px;
						}
						.icon-huangguan {
							width: 14px;
							height: 14px;
							text-align: center;
							line-height: 14px;
							font-size: 12px;
							margin-right: 1px;
						}
					}
					.label-group {
						display: inline-block;
						padding-right: 6px;
						.tag-label {
							margin-right: 4px;
							margin-bottom: 4px;
						}
					}
				}
			}
			.source {
				display: flex;
				.platform-icon {
					font-size: 20px;
				}
				.icon {
					margin-right: 5px;
				}
				.color-icon-H {
					color: #ff6004;
				}
				.color-weixin {
					color: #1bb723;
				}
				.color-weixinxiaochengxu {
					color: #677de0;
				}
				.color-toutiaoxiaochengxu {
					color: #239bff;
				}
			}
		}
		.deal-information {
			margin-right: -20px;
			margin-bottom: -20px;
			> .ivu-col {
				padding-right: 20px;
				padding-bottom: 20px;
				> .deal-information-content {
					border: 1px solid $border-color;
					display: flex;
					flex-wrap: nowrap;
					align-items: center;
					width: 100%;
					padding: 30px 0 30px 30px;
					> .left-icon {
						width: 74px;
						height: 74px;
						background-color: #f0faff;
						color: #f0faff;
						margin-right: 20px;
						border-radius: 100%;
						text-align: center;
						line-height: 74px;
						flex-shrink: 0;
						> .iconfont {
							font-size: 50px;
							line-height: 74px;
							color: $brand-color;
						}
					}
					> .right-content {
						> .title {
							@include font-14-20;
							padding-bottom: 10px;
						}
						.number {
							color: $brand-color;
							font-size: 24px;
							line-height: 34px;
							font-weight: bold;
							padding-right: 10px;
						}
						.archive-price {
							color: $warning-color;
						}
						refund-price,
						.order-number {
							color: $text-second;
						}
					}
				}
				> .balance-color {
					> .left-icon {
						background-color: #fff9e6;
						> .icon {
							color: $warning-color;
						}
					}
					.number {
						color: $warning-color;
					}
				}
				> .normal-color {
					> .left-icon {
						background-color: #fff1f2;
						> .icon {
							color: $danger-color;
						}
					}
					.number {
						color: $text-second;
					}
				}
			}
		}
	}

	.ivu-form .ivu-form-item {
		margin-bottom: 20px;
	}
}

.recharge-modal {
	padding: 0 30px;
}

.edit-input {
	align-items: center;
}

.edit {
	font-size: 12px;
	color: #ccc;
}
</style>

<style lang="scss">
// poptip
.ivu-poptip-body-content {
	/deep/ .vip-info-poptip-content {
		.operation-group {
			text-align: right;
			padding-left: 10px;
			.ivu-btn {
				margin-left: 10px;
			}
		}
	}
}
</style>
