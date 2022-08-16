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
	<div class="topInfoWrap">
		<Row class="base-information">
			<Col span="10">
				<div class="user">
					<div class="user-image">
						<img
							:src="$media(user ? user.avatar : '')"
							alt=""
							@error="replaceImage($event, 'avatar')"
						/>
					</div>
					<div class="user-information">
						<p class="name">
							{{ user ? user.nickname : "" }}
						</p>
						<Form :label-width="70">
							<FormItem label="会员ID：">
								{{ user ? user.id || "无" : "" }}
							</FormItem>
							<FormItem label="会员来源：">
								<div
									class="source"
									v-if="
										user.all_source &&
											user.all_source.length > 0
									"
								>
									<div
										v-for="(item, index) in allSource"
										:key="index"
									>
										<template
											v-if="
												[30, 32, 31].includes(
													item.source
												)
											"
										>
											<Tooltip
												:content="item.name"
												placement="top"
											>
												<kdx-svg-icon
													class="platform-icon iconfont"
													:type="item.class"
													v-if="item.is_register"
												></kdx-svg-icon>
												<kdx-svg-icon
													class="platform-icon iconfont"
													:type="item.type"
													v-else
												></kdx-svg-icon>
											</Tooltip>
										</template>
										<template v-else>
											<Tooltip
												:content="item.name"
												placement="top"
											>
												<i
													class="platform-icon iconfont"
													:class="item.class"
													v-if="item.is_register"
												></i>
												<kdx-svg-icon
													class="platform-icon iconfont"
													:type="item.type"
													v-else
												></kdx-svg-icon>
											</Tooltip>
										</template>
									</div>
								</div>
							</FormItem>
						</Form>
					</div>
				</div>
			</Col>
			<Col span="7">
				<Form :label-width="120">
					<p style="padding-top: 40px;"></p>
					<FormItem label="注册时间：">
						{{ user.created_at }}
					</FormItem>
					<FormItem label="Open Id：">
						<span>{{ user.open_id }}</span>
					</FormItem>
				</Form>
			</Col>
			<Col span="7">
				<Form :label-width="100">
					<p style="padding-top: 40px;"></p>
					<FormItem label="会员备注：">
						{{ user.remark || "-" }}
					</FormItem>
				</Form>
			</Col>
		</Row>
		<div class="handleBtns">
			<div v-for="(item, index) in handleBtns" :key="index">
				<Button
					class="btnStyle"
					:type="item.type"
					:disabled="item.disabled"
					@click="item.handler"
					v-if="(index !== 7 || user.password_set) && item.isShow"
				>
					{{ item.name }}</Button
				>
			</div>
		</div>
		<Row class="asset-information">
			<Col span="8">
				<div class="asset-information-content">
					<p class="title">积分</p>
					<p class="data">{{ user.credit }}</p>
					<div>
						<Button
							type="text"
							:disabled="user.is_deleted == 1 || noManagePerm"
							@click="checkIntegral"
							>积分记录</Button
						>
					</div>
				</div>
			</Col>
			<Col span="8">
				<div class="asset-information-content">
					<p class="title">余额</p>
					<p class="data">￥{{ user.balance }}</p>
					<div>
						<Button
							type="text"
							:disabled="user.is_deleted == 1 || noManagePerm"
							@click="checkBalance"
							>余额记录</Button
						>
					</div>
				</div>
			</Col>
			<Col span="8">
				<div class="asset-information-content">
					<p class="title">优惠券(张)</p>
					<p class="data">{{ user.coupon_count }}</p>
					<div>
						<Button
							type="text"
							:disabled="user.is_deleted == 1"
							@click="lookCoupons"
							>查看</Button
						>
					</div>
				</div>
			</Col>

		</Row>
		<!-- 充值积分 -->
		<recharge-integral
			ref="recharge_integral"
			:id="user.id"
			:data="user.credit"
			@on-refresh="handleRefresh"
		></recharge-integral>
		<!-- 充值余额 -->
		<recharge-balance
			ref="recharge_balance"
			:id="user.id"
			:data="user.balance"
			@on-refresh="handleRefresh"
		></recharge-balance>
		<!-- 会员等级选择器 -->
		<vip-grade-selector
			ref="vip_grade_selector"
			:current="grade.current"
			@on-change="changeGrade"
		></vip-grade-selector>
		<!-- 会员标签组选择器 -->
		<vip-label-selector
			ref="vip_label_selector"
			multiple
			:current-list="user.groups"
			@on-change="changeLevel"
		></vip-label-selector>
		<!--优惠券查看-->
		<kdx-modal-frame
			v-model="coupons.modal"
			title="优惠券查看"
			width="750"
			footerHide
			@on-cancel="cancelCoupons"
			@on-ok="cancelCoupons"
		>
			<Table ref="table" :columns="columns" :data="couponList"></Table>
			<div class="footer-page">
				<kdx-page-component
					ref="page"
					:total="page.total"
					@on-change="changeCouponPage"
				></kdx-page-component>
			</div>
		</kdx-modal-frame>
		<!-- 修改密码 -->
		<kdx-modal-frame
			v-model="changePassword.modal"
			title="修改密码"
			width="500"
			@on-cancel="cancelPassword"
			@on-ok="passwordOk"
		>
			<div class="change-password">
				<Form :label-width="100" @submit.native.prevent>
					<FormItem label="新密码：">
						<Input
							v-model="changePassword.password"
							class="width-330"
							placeholder="请输入新密码"
							@on-enter="passwordOk"
						/>
					</FormItem>
				</Form>
			</div>
		</kdx-modal-frame>
		<!-- 确认密码弹窗 -->
		<kdx-modal-frame
			v-model="passwordModal"
			title="确认密码"
			width="500"
			@on-cancel="handlePasswordCancel"
			@on-ok="handlePasswordOk"
		>
			<Form
				:label-width="120"
				style="margin-top: 20px;"
				@submit.native.prevent
			>
				<FormItem label="系统登录密码：">
					<Input
						v-model="password"
						class="width-330"
						type="password"
						placeholder="请输入系统登录密码"
						@on-enter="handlePasswordOk"
					/>
				</FormItem>
			</Form>
		</kdx-modal-frame>
		<!-- 修改会员备注 -->
		<kdx-modal-frame
			v-model="addRemark.modal"
			:title="!user.remark ? '添加备注' : '修改备注'"
			width="500"
			@on-cancel="handleRemarkCancel"
			@on-ok="handleRemarkOk"
		>
			<div class="change-password">
				<Form :label-width="100" @submit.native.prevent>
					<FormItem label="备注内容：">
						<Input
							type="textarea"
							v-model="addRemark.remark"
							placeholder="备注内容"
							show-word-limit
							:maxlength="50"
							class="width-340"
							:autosize="{ minRows: 3 }"
						/>
					</FormItem>
				</Form>
			</div>
		</kdx-modal-frame>

		<!-- 修改手机号-->
		<kdx-modal-frame
			v-model="mobileModel"
			:title="!user.mobile ? '添加手机号' : '修改手机号'"
			width="500"
			@on-cancel="cancelMemberMobile"
			@on-ok="changeMemberMobile"
		>
			<div class="change-password">
				<Form :label-width="100" @submit.native.prevent>
					<FormItem label="手机号：">
						<Input
							class="width-340"
							v-model="changeMobile"
							placeholder="手机号"
						/>
					</FormItem>
				</Form>
			</div>
		</kdx-modal-frame>
		<!-- 选择规格-->
		<kdx-modal-frame
			v-model="showSelectChild"
			title="选择规格"
			width="220"
			@on-cancel="selectChildCancel"
			@on-ok="selectChildOK"
		>
			<div class="childrenWrap">
				<div
					class="childItem"
					:class="{
						active: selectedChildIndex === index,
						disabled: item.stock == 0,
					}"
					v-for="(item, index) in selectChildren"
					:key="index"
					@click="selectChild(item, index)"
				>
					<p class="price">￥{{ item.denomination }}</p>
					<p class="stock">库存：{{ item.stock }}</p>
          <img v-if="selectedChildIndex === index" src="@/assets/image/selectedIcon.svg"/>
				</div>
			</div>
		</kdx-modal-frame>

	</div>
</template>

<script>
import RechargeIntegral from "./components/RechargeIntegral";
import RechargeBalance from "./components/RechargeBalance";
import VipGradeSelector from "@/components/selector/VipGradeSelector";
import VipLabelSelector from "@/components/selector/VipLabelSelector";

export default {
	props: {
		memberData: {
			type: Object,
		},
	},
	components: {
		RechargeIntegral,
		RechargeBalance,
		VipGradeSelector,
		VipLabelSelector,
	},
	created() {
		this.bus.$on("passwordModal", val => {
			this.passwordModal = val;
		});
	},
	beforeDestroy() {
		this.bus.$off("passwordModal");
	},
	mounted() {},
	data() {
		return {
			user: {
				avatar: "",
				groups: [],
			},
			grade: {
				current: {},
			},
			coupons: {
				modal: false,
				id: "",
			},
			levelsModel: false, // 修改等级
			mobileModel: false,
			changeMobile: "",
			changePassword: {
				modal: false,
				password: "",
			},
			addRemark: {
				modal: false,
				remark: "",
			},
			passwordModal: false,
			password: "",
			columns: [
				{
					title: "ID",
					key: "id",
					width: 80,
				},
				{
					title: "优惠券名称",
					key: "title",
					minWidth: 120,
				},
				{
					title: "优惠内容",
					key: "content",
					minWidth: 150,
					render: (h, params) => {
						return (
							<div>
								<span>满</span>
								<span>{params.row.enough}</span>
								<span>
									{params.row.coupon_sale_type == 1
										? "减"
										: "享"}
								</span>
								<span>{params.row.discount_price}</span>
								<span>
									{params.row.coupon_sale_type == 1
										? ""
										: "折"}
								</span>
							</div>
						);
					},
				},
				{
					title: "到期时间",
					key: "end_time",
					width: 200,
				},
			],
			rules: {
				group_name: [
					{
						required: true,
						message: "请填写标签名称",
					},
				],
			},
			selectId: [],
			couponList: [],
			page: {
				pageSize: 10,
				pageNumber: 1,
			},
			showSelectChild: false,
			selectChildren: [],
			selectedChildIndex: null,
			selectHasChildGift: {},
			selectedIndex: null,
		};
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
                70: {
                    class: "icon-PCduan icon-pc",
                    type: "icon-zujian-shangpinzu-danlieshangpin",
                    name: "PC商城",
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
		noManagePerm() {
			//管理权限
			return !this.$getPermMap("member.list.manage");
		},
		handleBtns() {
			let _this = this;
			return [
				{
					name: "充值积分",
					type: "warning",
					disabled: this.user.is_deleted == 1 || this.noManagePerm,
					handler: this.rechargeIntegral,
					isShow: true,
				},
				{
					name: "修改余额",
					type: "warning",
					disabled: this.user.is_deleted == 1 || this.noManagePerm,
					handler: this.rechargeBalance,
					isShow: true,
				},
				{
					name: "修改会员等级",
					type: "success",
					disabled: this.user.is_deleted == 1 || this.noManagePerm,
					handler: this.editGrade,
					isShow: true,
				},
				{
					name: "添加标签组",
					type: "success",
					disabled: this.user.is_deleted == 1 || this.noManagePerm,
					handler: this.editLevel,
					isShow: true,
				},
				{
					name: !this.user.mobile ? "添加手机号" : "修改手机号",
					type: "success",
					disabled: this.user.is_deleted == 1 || this.noManagePerm,
					handler: () => {
						_this.mobileModel = true;
					},
					isShow: true,
				},
				{
					name: "修改密码",
					type: "success",
					disabled: this.user.is_deleted == 1 || this.noManagePerm,
					handler: this.handleChangePassword,
					isShow: true,
				},
				{
					name: "会员备注",
					type: "success",
					disabled: this.user.is_deleted == 1 || this.noManagePerm,
					handler: this.editRemark,
					isShow: true,
				},
			];
		},
	},
	methods: {
		// 积分记录
		checkIntegral() {
			this.$utils.openNewWindowPage("/finance/pointsDetails/index", {
				member_id: this.user.id,
			});
		},
		// 余额记录
		checkBalance() {
			this.$utils.openNewWindowPage("/finance/balanceDetails/index", {
				member_id: this.user.id,
			});
		},
		// 积分充值
		rechargeIntegral() {
			this.$refs["recharge_integral"].setValue();
		},
		// 余额充值
		rechargeBalance() {
			this.$refs["recharge_balance"].setValue();
		},

		// 优惠券查看
		lookCoupons() {
			this.coupons.modal = true;
			this.page.pageNumber = 1;
			this.getCouponList();
		},
		getCouponList() {
			this.$api.memberApi
				.getMemberCoupon({
					member_id: this.user.id,
					pagesize: this.page.pageSize,
					page: this.page.pageNumber,
				})
				.then(res => {
					this.couponList = res.list;
					this.page.total = res.total;
				});
		},
		changeCouponPage(page) {
			this.page = page;
			this.getCouponList();
		},
		cancelCoupons() {
			this.coupons.modal = false;
		},
		editMemberMobile() {
			this.editMemberMobileModal = true;
		},
		changeMemberMobile() {
			this.$api.memberApi
				.changeMemberMobile({
					id: this.user.id,
					mobile: this.changeMobile,
				})
				.then(res => {
					if (res.error == 0) {
						this.$emit("getDetail");
						this.$Message.success("手机号修改成功");
					}
					this.mobileModel = false;
				});
		},
		cancelMemberMobile() {
			this.mobileModel = false;
			this.changeMobile = "";
		},
		handleChangePassword() {
			this.changePassword.modal = true;
		},
		cancelPassword() {
			this.changePassword.modal = false;
		},
		passwordOk() {
			this.$api.memberApi
				.changePassword({
					id: this.user.id,
					password: this.changePassword.password,
				})
				.then(res => {
					if (res.error == 0) {
						this.$emit("getDetail");
						this.$Message.success("修改成功");
					}
					this.changePassword.modal = false;
				});
		},
		// 修改等级
		editGrade() {
			this.grade.current = { id: this.user.level_id };
			this.$nextTick(() => {
				this.$refs["vip_grade_selector"].setValue();
			});
		},
		// 修改等级
		changeGrade(data) {
			this.$api.memberApi
				.changeMemberLevel({
					id: this.user.id,
					level_id: data.id,
				})
				.then(res => {
					if (res.error == 0) {
						this.$emit("getDetail");
						this.$Message.success("修改成功");
					}
				});
		},
		// 修改标签组
		editLevel() {
			this.grade.current = { id: this.user.level_id };
			this.$nextTick(() => {
				this.$refs["vip_label_selector"].setValue();
			});
		},
		// 修改标签组
		changeLevel(data) {
			// console.log('change', data);
			this.$api.memberApi
				.changeMemberGroup({
					id: this.user.id,
					group_ids: data.map(item => item.id),
				})
				.then(res => {
					if (res.error == 0) {
						this.$emit("getDetail");
						this.$Message.success("修改成功");
					}
				});
		},
		// 重新加载数据
		handleRefresh() {
			this.$emit("getDetail");
		},
		handlePasswordCancel() {
			this.passwordModal = false;
		},
		handlePasswordOk() {
			let obj = {
				id: this.user.id,
				manage_password: this.password,
			};
			if (!obj.manage_password) {
				this.$Message.error("填写密码");
				return;
			}
			this.$api.memberApi.deleteMember(obj).then(res => {
				if (res.error == 0) {
					this.$Message.success("删除成功");
					this.$router.push({
						path: "/member/list",
					});
				}
			});
			this.passwordModal = false;
		},
		handleRemarkCancel() {
			this.addRemark.modal = false;
		},
		handleRemarkOk() {
			this.$api.memberApi
				.changeRemark({
					remark: this.addRemark.remark,
					id: this.user.id,
				})
				.then(res => {
					if (res.error == 0) {
						this.$emit("getDetail");
						this.$Message.success("保存成功");
					}
					this.addRemark.modal = false;
				});
		},
		editRemark() {
			this.addRemark.modal = true;
			this.addRemark.remark = this.user.remark;
		},
		selectChild(item, index) {
			if (item.stock == 0) {
				return;
			}
			this.selectedChildIndex = index;
		},
		selectChildCancel() {
			this.selectedChildIndex = null;
			this.showSelectChild = false;
		},
		selectChildOK() {
			if (this.selectedChildIndex === "") {
				this.$Message.warning("请选择规格");
				return;
			}
			let selectGift = this.giftData[this.selectedIndex];
			selectGift.selectChild = this.selectChildren[
				this.selectedChildIndex
			];
			this.$set(selectGift, "checked", true);
			this.giftData[
				this.selectedIndex
			].selectChildIndex = this.selectedChildIndex;
			let hadItem = this.$refs.recharge_gift.selectRows
				.map(item => item.id)
				.includes(selectGift.id);
			!hadItem && this.$refs.recharge_gift.selectRows.push(selectGift);
			// debugger
			this.showSelectChild = false;
			this.selectedChildIndex = null;
		},
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
};
</script>
<style lang="scss">
.itemActive {
	color: #239bff;
	text-decoration: underline;
	cursor: pointer;
}
.coupons-type {
	position: relative;
	display: inline-block;
	font-size: 14px;
	font-weight: normal;
	line-height: 20px;
	padding: 5px 12px 5px 14px;
	border-radius: 2px;
	color: #ffffff;
	img {
		position: absolute;
		top: 0;
		right: -2px;
		bottom: 0;
	}
}
.coupons-type-yellow {
	background-color: var(--warning-color);
}
.coupons-type-blue {
	background-color: var(--theme-color);
}
</style>
<style scoped lang="scss">
.topInfoWrap {
	padding-bottom: 40px;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	.handleBtns {
		display: flex;
		padding-left: 39px;
		.btnStyle {
			margin-right: 10px;
			min-width: 88px;
			height: 40px;
      font-weight: bold;
		}
	}
}
.base-information {
	padding-top: 42px;
  padding-bottom:20px;
	/deep/ .ivu-form-item {
		margin-bottom: 20px;
		.ivu-form-item-label {
			padding: 0;
		}
		.ivu-form-item-content {
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
				background: linear-gradient(90deg, #4a505c 0%, #45525f 100%),
					#ff9900;
				border-radius: 2px;
				padding: 2px 3px;
				color: #ffffff;
				@include font-12-16-bold;
				margin: 10px 10px 10px 0;
				> .icon {
					color: linear-gradient(180deg, #f6f2e8 0%, #ebd9c1 100%),
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
        .icon-PCduan{
            font-size: 16px;
            color:#11aa9c ;
        }
	}
}
.asset-information {
	margin-top: 40px;
	margin-left: 40px;
	margin-right: 40px;
	> .ivu-col {
		padding-right: 30px;
		&:nth-last-of-type(1) {
			padding-right: 0;
		}
		.asset-information-content {
			background: linear-gradient(180deg, #f7faff 0%, #ffffff 100%);
			height: 134px;
			border: 1px solid #e9edef;
			box-sizing: border-box;
			border-radius: 2px;
			text-align: center;
			padding: 20px 0;
			border-radius: 2px;
			> .title {
				@include font-14-20;
			}
			> .data {
				font-weight: bold;
				font-size: 24px;
				line-height: 34px;
				padding: 10px 0;
			}
		}
	}
}
// 修改密码
.change-password {
	padding-top: 30px;
}
.childrenWrap {
	padding: 20px;
  min-height:180px;
	display: flex;
	flex-wrap: wrap;
	.childItem {
    position: relative;
		margin-bottom: 10px;
		margin-right: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 1px solid #e9edef;
		box-sizing: border-box;
		border-radius: 2px;
		width: 120px;
		height: 60px;
		cursor: pointer;
    img{
      position: absolute;
      bottom:0;
      right:0;
    }
		&.active {
			border: 1px solid #2d8cf0;

			.stock {
				color: #636669;
			}
			.price {
				color: #2d8cf0;
			}
		}
		&.disabled {
			cursor: not-allowed;
			border: 1px solid #e9edef;
			.price,
			.stock {
				color: #939799;
			}
		}
		&:nth-of-type(3n) {
			margin-right: 0px;
		}
		.stock {
			font-size: 12px;
			line-height: 16px;
			color: #939799;
		}
		.price {
      font-weight:bold;
			font-size: 14px;
			line-height: 20px;
			color: #262b30;
		}
	}
}
</style>
