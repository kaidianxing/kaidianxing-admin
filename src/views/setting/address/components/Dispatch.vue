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
    <div class="dispatch-address">
        <kdx-form-title>商城不配送区域设置</kdx-form-title>
        <Form ref="form" :label-width="120">
            <FormItem label="区域类型：">
                <RadioGroup :value="value" @on-change="changeType">
                    <Radio :disabled="noManagePerm" label="1">
                        <span>只配送区域</span>
                    </Radio>
                    <Radio :disabled="noManagePerm" label="0">
                        <span>不配送区域</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="不配送区域：" v-if="value == '0'">
                <div class="un-express">
                    <p
                        v-if="!not_dispatch_areas.text"
                        class="pointer"
                        @click="showRegionSelect(not_dispatch_areas)"
                    >
                        +添加不配送区域
                    </p>
                    <table v-if="not_dispatch_areas.text">
                        <tr>
                            <td>
                                <div>{{ not_dispatch_areas.text }}</div>
                                <span
                                    class="rr-brand-color pointer"
                                    @click="
                                        showRegionSelect(not_dispatch_areas)
                                    "
                                    >编辑</span
                                >
                                <span
                                    class="rr-brand-color pointer marginL-10"
                                    @click="handleDelNotDispatchAreas"
                                    >清空</span
                                >
                            </td>
                        </tr>
                    </table>
                </div>
            </FormItem>
            <FormItem label="只配送区域：" v-if="value == '1'">
                <div class="un-express">
                    <p
                        v-if="!delivery_areas.text"
                        class="pointer"
                        @click="showRegionSelect(delivery_areas)"
                    >
                        +添加配送区域
                    </p>
                    <table v-if="delivery_areas.text">
                        <tr>
                            <td>
                                <div>{{ delivery_areas.text }}</div>
                                <span
                                    class="rr-brand-color pointer"
                                    @click="showRegionSelect(delivery_areas)"
                                    >编辑</span
                                >
                                <span
                                    class="rr-brand-color pointer marginL-10"
                                    @click="handleDelNotDispatchAreas"
                                    >清空</span
                                >
                            </td>
                        </tr>
                    </table>
                </div>
            </FormItem>
        </Form>
        <!--地址选择器-->
        <selector-region
            :visible="regionModal"
            :list="regionData"
            @on-ok="regionSelectOk"
            @on-cancel="regionSelectCancel"
        ></selector-region>
    </div>
</template>

<script>
import SelectorRegion from "@/components/selector/Region";

export default {
    components: {
        SelectorRegion,
    },
    props: {
        deny_area: {
            type: [Object, String],
        },
        delivery_area: {
            type: [Object, String],
        },
        value: {
            type: [String, Number],
            default: "0",
        },
    },
    data() {
        return {
            regionModal: false,
            regionData: {},
            dispath_type: "0",
            not_dispatch_areas: {},
            delivery_areas: {},
        };
    },
    watch: {
        deny_area(newValue) {
            if (newValue) {
                this.not_dispatch_areas = { ...newValue };
            }
        },
        delivery_area(newValue) {
            if (newValue) {
                this.delivery_areas = { ...newValue };
            }
        },
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("sysset.address_set.manage");
        },
    },
    created() {},
    mounted() {},
    methods: {
        changeType(e) {
            this.$emit("input", e);
        },
        // 弹出区域选择器
        showRegionSelect(data) {
            this.regionModal = true;
            let obj = {
                provinces: data.provinces,
                citys: data.citys,
                areas: data.areas,
                text: data.text,
            };
            this.regionData = { ...obj };
        },
        //删除一条不配送区域
        handleDelNotDispatchAreas() {
            if (this.delivery_area == "0") {
                this.not_dispatch_areas = {};
            } else {
                this.delivery_areas = {};
            }
            this.$emit("regionSelectOk");
        },
        // 区域选择完成
        regionSelectOk(data) {
            if (this.delivery_area == "0") {
                this.not_dispatch_areas = data;
            } else {
                this.delivery_areas = data;
            }
            this.regionData = data;
            this.regionSelectCancel();
            this.$emit("regionSelectOk", this.regionData);
        },
        regionSelectCancel() {
            this.regionModal = false;
        },
    },
};
</script>

<style lang="scss">
.dispatch-address {
    .un-express {
        min-height: 65px;
        border: 1px solid #f2f2f2;
        & > p {
            text-align: center;
            font-size: 12px;
            line-height: 65px;
            color: $brand-color;
        }
        > table {
            width: 100%;
            > tr {
                > td {
                    height: 65px;
                    padding-left: 20px;
                }
            }
        }
    }
}
</style>
