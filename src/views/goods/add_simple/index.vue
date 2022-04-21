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
    <kdx-content-bar ref="content_bar" :loading="loading">
        <Tabs
            v-model="value"
            :animated="false"
            name="floor1"
            style="background:#fff;margin-top:20px;min-height: 100%"
            @on-click="tabClick"
        >
            <TabPane :label="tab.base" name="base">
                <keep-alive>
                    <base-add ref="base" :curTab="value"></base-add>
                </keep-alive>
            </TabPane>
            <TabPane :label="tab.detail" name="detail">
                <base-detail></base-detail>
            </TabPane>
            <TabPane :label="tab.param" name="param">
                <keep-alive>
                    <base-param ref="param" v-if="value === 'param'"></base-param>
                </keep-alive>
            </TabPane>
            <TabPane :label="tab.limit" name="limit">
                <keep-alive>
                    <base-limit ref="limit" v-if="value === 'limit'"></base-limit>
                </keep-alive>
            </TabPane>
            <TabPane :label="tab.market" name="market">
                <keep-alive>
                    <base-market ref="market"></base-market>
                </keep-alive>
            </TabPane>
        </Tabs>
        <template #btn>
            <Button
                v-show="value !== 'market'"
                class="primary-long"
                @click="handleNextStep"
            >下一步</Button>
            <Button class="default-long" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import BaseAdd from "./base/index";
import { exchangeArrayToString } from "@/assets/jsTools/objectTools";
import cacheDiscount from "@/store/goodAddEdit/jsTools/vipDiscount";
import { mapActions, mapState } from "vuex";

export default {
    name: "add",
    components: {
        BaseAdd,
        BaseDetail: () => import("./detail/index"),
        BaseLimit: () => import("./limit/index"),
        BaseMarket: () => import("./market/index"),
        BaseParam: () => import("./param/index"),
    },
    data() {
        return {
            value: "base",
            id: 0,
            operate: "", // 区分编辑还是复制
            type: "update",
            loading: false,
            lastValue: 'base'
        };
    },
    watch: {
        "$route.path": {
            handler() {
                this.id = this.$route.query.id;
                this.operate = this.$route.query.operate;
                this.$store.state.goodAddEdit.actionType = this.id
                    ? "update"
                    : "create";
            },
            immediate: true
        }
    },
    computed: {
        ...mapState("goodAddEdit", {
            validateType: state => state.validateType
        }),
        ...mapState("goodAddEdit/multiOptions", {
            cacheSpecsError: state => state.cacheSpecsError,
            cacheFormError: state => state.cacheFormError
        }),
        tab() {
            return {
                base: () => {
                    let icon;
                    if (this.validateType.indexOf("base") > -1) {
                        icon = <span class="iconfont icon-tishi-prompt"></span>;
                    }
                    return (
                        <div>
                            <span>基本</span>
                            {icon}
                        </div>
                    );
                },
                detail: () => {
                    let icon;
                    if (this.validateType.indexOf("detail") > -1) {
                        icon = <span class="iconfont icon-tishi-prompt"></span>;
                    }
                    return (
                        <div>
                            <span>详情</span>
                            {icon}
                        </div>
                    );
                },
                param: () => {
                    let icon;
                    if (this.validateType.indexOf("param") > -1) {
                        icon = <span class="iconfont icon-tishi-prompt"></span>;
                    }
                    return (
                        <div>
                            <span>参数</span>
                            {icon}
                        </div>
                    );
                },
                limit: () => {
                    let icon;
                    if (this.validateType.indexOf("limit") > -1) {
                        icon = <span class="iconfont icon-tishi-prompt"></span>;
                    }
                    return (
                        <div>
                            <span>权限</span>
                            {icon}
                        </div>
                    );
                },
                market: () => {
                    let icon;
                    if (this.validateType.indexOf("market") > -1) {
                        icon = <span class="iconfont icon-tishi-prompt"></span>;
                    }
                    return (
                        <div>
                            <span>营销</span>
                            {icon}
                        </div>
                    );
                }
            };
        },
        dispatchEnable() {
            return this.$store.getters['goodAddEdit/dispatchEnable']
        },
    },
    methods: {
        ...mapActions("goodAddEdit/vipDiscount", [
            "getVipGroup",
            "getVipLevelList",
            "getVipLevels"
        ]),
        ...mapActions("goodAddEdit", [
            "getShopClassify",
            "getGoodData",
            "getDispatchTemplateList",
            "getDispatchEnable",
        ]),
        ...mapActions("goodAddEdit/multiOptions", {
            checkSpecSettings: "checkSpecSettings",
            checkSpecs: "checkSpecs"
        }),
        tabClick(name) {
            this.validate();
            this.lastValue = name;
        },
        // 保存
        handleSave() {
            this.validate(true).then(valid => {
                // 校验通过
                if (valid) {
                    let _params = this.formatParams()
                    if (this.id && this.operate === 'edit') {
                        this.editGood(_params);
                    } else {
                        this.addGood(_params);
                    }
                }
            })
        },
        // 下一步
        handleNextStep() {
            this.$refs['content_bar']?.returnToTop();
            // 添加必填提醒
            this.validate();
            switch (this.value) {
                case "base":
                    this.value = "detail";
                    break;
                case "detail":
                    this.value = "param";
                    break;
                case "param":
                    this.value = "limit";
                    break;
                case "limit":
                    this.value = "market";
                    break;
            }
        },
        // 处理新增、编辑商品请求参数
        formatParams() {
            let goods = this.getGoods();
            if (this.operate === 'copy') {
                delete goods.id
            }
            let specs = this.$store.state.goodAddEdit.multiOptions.specs,
                params = {};
            // 处理商品详情
            if (goods.content) {
                goods.content = this.$utils.delmedia(goods.content)
            }
            // 多规格
            if (goods.has_option === "1") {
                params = Object.assign({
                    goods,
                    spec: specs,
                    options: this.getMultiOption(),
                });
            } else {
                params = {
                    goods,
                };
            }
            // 实体商品、虚拟商品字段处理
            if (params.goods.type === '0') {
                // 实体商品
                params.goods.auto_deliver = '0'
                params.goods.auto_deliver_content = ''
                // 普通快递
                if (new Set(params.goods.logistics_support).has('1')) {
                    params.goods.dispatch_express = '1'
                } else {
                    params.goods.dispatch_express = '0'
                    // 重置运费设置
                    params.goods.dispatch_type = '0' // 运费设置
                    params.goods.dispatch_id = '0' // 运费模板
                    params.goods.dispatch_price = '0' // 统一运费
                }
                if (this.dispatchEnable.express === 0) {
                    this.$Message.error('请选择配送方式')
                    return false
                }
            } else if (params.goods.type === '1') {
                // 虚拟商品
                params.goods.weight = '0'
                params.goods.dispatch_type = '2' // 运费设置
                params.goods.dispatch_id = '0' // 运费模板
                params.goods.dispatch_price = '0' // 统一运费
                params.goods.ext_field.return = '0'
                params.goods.ext_field.exchange = '0'
                params.goods.ext_field.is_delivery_pay = '0'
                params.goods.dispatch_express = '0' // 普通快递
            }
            delete params.goods.logistics_support
            let data = {};
            for (let k in params) {
                data[k] = JSON.stringify(params[k]);
            }
            return data
        },
        // 新增商品
        addGood(data) {
            this.loading = true;
            this.$api.goodsApi.addGood(data).then(res => {
                this.loading = false;
                if (res.error === 0) {
                    this.$Message.success("商品添加成功");
                    this.$router.push({
                        path: "/goods/list/inSale"
                    });
                }
            });
        },
        // 修改商品信息
        editGood(data) {
            this.loading = true;
            this.$api.goodsApi.editGood(data).then(res => {
                this.loading = false;
                if (res.error === 0) {
                    this.$Message.success("商品修改成功");
                    this.$router.push({
                        path: "/goods/list/inSale"
                    });
                }
            });
        },
        // 获取商品的model
        getGoods() {
            return exchangeArrayToString(this.$store.state.goodAddEdit.model);
        },
        // 获取多规格的options
        getMultiOption() {
            let options = this.$store.state.goodAddEdit.multiOptions.options.map(
                item => {
                    let newItem = Object.assign({}, item);
                    for (let k in newItem) {
                        if (
                            k !== "goods_sku" &&
                            k != "thumb" &&
                            !("" + newItem[k]).trim()
                        ) {
                            newItem[k] = "0";
                        }
                    }
                    return newItem;
                }
            );
            options.forEach(option => {
                let specs = [];
                // 获取specs
                Object.keys(option._pos).forEach(item => {
                    specs.push(option._pos[item]);
                });
                option.title = option.childSpecVal.join("+");
                option.specs = specs;
                delete option._pos;
                delete option.childSpecVal;
                delete option.discount;
            });
            return options;
        },
        // 数据校验tab为要切换的tab的name isJump是否要跳转校验未通过页面
        validate(isJump) {
            return new Promise((resolve) => {
                let goods = this.getGoods(),
                    validateType = [],
                    validFun = [],
                    tabName = ['base', 'detail', 'param', 'limit', 'market'],
                    tabName1 = ['base', 'base', 'detail', 'param', 'limit', 'market'] ;
                this.$nextTick(() => {
                    // 多规格
                    if (goods.has_option == 1) {
                        this.checkSpecs();
                        validFun.push(this.checkSpecSettings());
                    }
                    // 基本信息
                    validFun.push(this.$refs['base'].validate());
                    // 详情
                    validFun.push(this.validateDetail(goods));
                    // 参数
                    validFun.push(this.validateParams(goods));
                    // 权限
                    if (this.$refs['limit']) {
                        validFun.push(this.$refs['limit'].validate());
                    } else {
                        validFun.push(this.validateLimit(goods));
                    }
                    // 营销
                    validFun.push(this.$refs["market"].validate());
                    Promise.all(validFun).then(resArr => {
                        resArr.forEach((res, index) => {
                            if (!res) {
                                if (goods.has_option == 1) {
                                    validateType.push(tabName1[index]);
                                } else {
                                    validateType.push(tabName[index]);
                                }
                            }
                            // tab && (this.value = tab);
                        })
                        this.$store.commit(
                            "goodAddEdit/setValidateType",
                            validateType
                        );
                        if (validateType?.length) {
                            isJump && (this.value = validateType[0])
                            if (isJump) {
                                this.value = validateType[0];
                                if (this.value === 'detail') {
                                    this.$Message.error('商品详情超过最大限制')
                                }
                            }
                            resolve(false)
                        } else {
                            resolve(true);
                        }
                    }).catch(err => {
                        console.log('err', err);
                    })
                })
            });
        },
        // 详情模块校验
        validateDetail(data) {
            function mbStringLength(s) {
                let totalLength = 0;
                let i;
                let charCode;
                for (i = 0; i < s.length; i++) {
                    charCode = s.charCodeAt(i);
                    if (charCode < 0x007f) {
                        totalLength = totalLength + 1;
                    } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                        totalLength += 2;
                    } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                        totalLength += 3;
                    }
                }
                return totalLength;
            }
            let strTotal = mbStringLength(data.content)

            if (strTotal > 10000000) {
                this.value === 'detail' && this.$Message.error('商品详情超过最大限制');
                return false
            } else {
                return true;
            }
        },
        // 参数模块校验
        validateParams(data) {
            if (data.params_switch == 0) {
                return true;
            } else {
                return !!(data.params && data.params.length > 0);
            }
        },
        // 权限模块校验
        validateLimit(data) {
            let keyArr = ['browse_level_perm', 'browse_tag_perm', 'buy_level_perm', 'buy_tag_perm'];
            let flag = true;
            for (let key of keyArr) {
                if (data[key] == '1' && (!data[`${key}_ids`] || !data[`${key}_ids`]?.length)) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
    },
    beforeDestroy() {
        cacheDiscount.clear();
        this.$store.commit('goodAddEdit/resetModel')
    },
    async created() {
        this.loading = true
        if (this.$route.query.type) {
            // 设置商品类型
            this.$nextTick(() => {
                this.$store.commit('goodAddEdit/setModelProps', {
                    type: this.$route.query.type
                });
            })
        }
        this.getDispatchEnable() // 获取物流是否开启
        this.getDispatchTemplateList(); // 获取运费模板
        this.getVipLevels(); //获取会员等级列表
        await this.getShopClassify(); // 获取商品分类
        cacheDiscount.setStore(this.$store); //初始化會員折扣類
        this.$store.commit("goodAddEdit/setValidateType", []);
        this.$store.dispatch('config/getDeduction'); // 积分、余额抵扣设置状态
        this.$store.dispatch('config/getBusiness'); // 获取发票信息
        // 获得商品信息
        await this.getGoodData({
            id: this.$route.query.id,
            operate: this.$route.query.operate,
        });
        this.loading = false
    },
};
</script>

<style lang="scss" scoped>
/deep/ .ivu-tabs-bar {
    margin-bottom: 40px;
    padding: 0 30px;
    .ivu-tabs-tab {
        padding: 12px 30px;
        @include font-18-25-bold;
        .icon-tishi-prompt {
            position: absolute;
            right: 10px;
            color: $danger-color;
            font-size: 18px;
        }
    }
}

/deep/ .ivu-form-item-label {
    padding-right: 10px !important;
}
</style>
