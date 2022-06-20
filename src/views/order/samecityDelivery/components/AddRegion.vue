<template>
    <div class="comp-add-region">
        <div class="region-wrap">
            <ul>
                <li
                    :ref="`regionItem${index}`"
                    v-for="(item, index) in regionList"
                    :key="index"
                    :class="{ active: item.active }"
                >
                    <div
                        class="region-wrap-title"
                        @click.stop="fnSelect(index)"
                    >
                        <div class="left">
                            <div
                                class="radio"
                                :style="{
                                    backgroundColor: item.color.backgroundColor,
                                    borderColor: item.color.borderColor,
                                }"
                            >
                                <i
                                    :style="{
                                        backgroundColor: item.color.borderColor,
                                    }"
                                ></i>
                            </div>
                            <div class="text">区域{{ index + 1 }}</div>
                        </div>
                        <div class="right" @click.stop="fnDelete(index)">
                            删除
                        </div>
                    </div>
                    <div class="region-wrap-content">
                        <Form
                            :ref="`regionForm${index}`"
                            :model="item.model"
                            :rules="item.rules"
                            :label-width="100"
                            @on-validate='onValidate'
                        >
                            <FormItem
                                label="起送金额："
                                prop="initial_price"
                                v-error-item.initial_price
                                :show-message="false"
                            >
                                <kdx-rr-input
                                    class="input-width"
                                    placeholder="请输入"
                                    number
                                    :fixed="2"
                                    :min-value="0"
                                    :max-value="9999999.99"
                                    v-model="item.model.initial_price"
                                    @on-input-change="fnDataChange"
                                >
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                            <FormItem
                                label="配送费："
                                prop="dispatch_price"
                                v-error-item.dispatch_price
                                :show-message="false"
                                v-if="delivery_area === 0"
                            >
                                <kdx-rr-input
                                    class="input-width"
                                    placeholder="请输入"
                                    number
                                    :fixed="2"
                                    :min-value="0"
                                    :max-value="9999999.99"
                                    v-model="item.model.dispatch_price"
                                    @on-input-change="fnDataChange"
                                >
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                            <FormItem
                                label="半径："
                                prop="radius"
                                v-error-item.radius
                                :show-message="false"
                                v-if="division_way === 0"
                            >
                                <kdx-rr-input
                                    class="input-width"
                                    placeholder="请输入"
                                    number
                                    :fixed="3"
                                    :min-value="0"
                                    :max-value="9999999999.99"
                                    v-model="item.model.radius"
                                    @on-input-change="
                                        fnDataChange('radius', item, index)
                                    "
                                >
                                    <span slot="append">公里</span>
                                </kdx-rr-input>
                            </FormItem>
                            <FormItem label="免配送费：" prop="is_free">
                                <RadioGroup
                                    v-model="item.model.is_free"
                                    @on-change="fnDataChange"
                                >
                                    <Radio label="1">是</Radio>
                                    <Radio label="0">否</Radio>
                                </RadioGroup>
                            </FormItem>
                            <div
                                class="next-box"
                                v-if="item.model.is_free === '1'"
                            >
                                商品售价
                                <FormItem
                                    label=""
                                    prop="free_price"
                                    v-error-item.free_price
                                    :show-message="false"
                                >
                                    <kdx-rr-input
                                        class="input-width"
                                        placeholder="请输入"
                                        number
                                        :fixed="2"
                                        :min-value="0"
                                        :max-value="9999999.99"
                                        v-model="item.model.free_price"
                                        @on-input-change="fnDataChange"
                                    >
                                        <span slot="prepend">满</span>
                                        <span slot="append">元</span>
                                    </kdx-rr-input>
                                </FormItem>
                                免配送费
                            </div>
                        </Form>
                    </div>
                </li>
            </ul>
        </div>
        <div
            class="add-wrap"
            v-show="regionList.length < 10"
            @click="fnAddRegion"
        >
            +添加配送区域（{{ regionList.length }}/10）
        </div>
    </div>
</template>

<script>
export default {
    props: ['value', 'delivery_area', 'division_way'],
    data() {
        return {
            regionList: [],
            rules: {
                initial_price: [{ required: true, message: '起送金额必填' }],
                dispatch_price: [{ required: true, message: '配送费必填' }],
                radius: [{ required: true, message: '半径必填' }],
                free_price: [{ required: true, message: '商品售价必填' }],
            },
        }
    },
    watch: {
        value: {
            handler(value) {
                this.regionList = value.map((item) => {
                    return {
                        rules: this.rules,
                        ...item,
                    }
                })
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        // 选中区域
        fnSelect(index) {
            if (this.regionList[index].active === true) {
                return
            }
            this.regionList.forEach((item) => {
                item.active = false
            })
            this.regionList[index].active = true
            // 选中的滚动到可视区域
            this.$refs[`regionItem${index}`][0].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
            // 选中的显示编辑器
            if (this.division_way === 0) {
                this.$emit('showCircleEditor', index)
            } else if (this.division_way === 1) {
                this.$emit('showPolyEditor', index)
            }
            this.fnDataChange()
        },
        // 删除区域
        fnDelete(index) {
            this.regionList.splice(index, 1)
            this.$emit('deleteRegion', index)
            this.fnDataChange()
        },
        // 添加区域
        fnAddRegion() {
            // 判断是否超过10个
            if (this.regionList.length > 9) {
                return
            }
            this.$emit('addRegion')
        },
        fnDataChange(type, data, index) {
            if (type === 'radius') {
                // 改变半径
                this.$emit('changeCircleRadius', data, index)
            }
            let regionList = this.regionList.map((item) => {
                return {
                    color: item.color,
                    active: item.active,
                    model: item.model,
                }
            })
            this.$emit('input', regionList)
        },
        onValidate(prop, status){
            this.cacheError={
                ...this.cacheError,
                [prop]: status
            }
        },
        validate() {
            let list = this.regionList.map((item, index) => {
                return this.asyncWorker(index)
            })
            return Promise.all(list)
                .then((result) => {
                    return result
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        // 处理数据
        asyncWorker(index) {
            return new Promise((resolve) => {
                this.$refs[`regionForm${index}`][0].validate((valid) => {
                    resolve(valid)
                    this.$nextTick(() => {
                        if(!valid){
                            for(let k in this.cacheError){
                                if(!this.cacheError[k]){
                                    this.$focusError(k);
                                    break;
                                }
                            }
                        }
                    })
                })
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.comp-add-region {
    border: 1px solid #e9edef;
    border-radius: 2px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .region-wrap {
        flex: 1;
        overflow-y: auto;
        ul {
            li {
                &.active {
                    background-color: $brand-hover;
                    border: 1px solid $brand-color;
                    .region-wrap-title {
                        .left {
                            .radio {
                                i {
                                    display: block;
                                }
                            }
                            .text {
                                color: $brand-color;
                            }
                        }
                    }
                }
                &:hover {
                    .region-wrap-title {
                        .right {
                            display: block;
                        }
                    }
                }
                .region-wrap-title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-left: 10px;
                    padding-right: 10px;
                    height: 40px;
                    background-color: #f4f6f8;
                    cursor: pointer;
                    .left {
                        display: flex;
                        align-items: center;
                        .radio {
                            border: 2px solid transparent;
                            position: relative;
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            box-sizing: border-box;
                            i {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 6px;
                                height: 6px;
                                border-radius: 50%;
                                display: none;
                            }
                        }
                        .text {
                            padding-left: 10px;
                            font-weight: bold;
                            font-size: 14px;
                            line-height: 20px;
                            color: #262b30;
                        }
                    }
                    .right {
                        font-size: 12px;
                        line-height: 16px;
                        color: $brand-color;
                        cursor: pointer;
                        display: none;
                    }
                }
                .region-wrap-content {
                    padding-top: 20px;
                    padding-bottom: 20px;
                    /deep/ .ivu-form .ivu-form-item {
                        margin-bottom: 10px;
                    }
                    /deep/ .ivu-form-item .ivu-form-item-label {
                        padding-right: 0;
                    }
                    /deep/
                        .ivu-form
                        .ivu-form-item
                        .ivu-form-item-content
                        .ivu-form-item-error-tip {
                        padding-left: 100px;
                    }
                    .input-width {
                        width: 198px;
                    }
                    .next-box {
                        margin-left: 20px;
                        margin-right: 30px;
                        background-color: #f4f6f8;
                        padding: 10px 0 10px 10px;
                        border-radius: 2px;
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        line-height: 20px;
                        color: #262b30;
                        .input-width {
                            width: 120px;
                        }
                        /deep/ .ivu-form-item {
                            margin-bottom: 0;
                            margin-left: 10px;
                            margin-right: 10px;
                        }
                        /deep/ .ivu-form-item-error-tip {
                            padding-left: 32px !important;
                        }
                    }
                }
            }
        }
    }
    .add-wrap {
        width: 100%;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 20px;
        color: $brand-color;
        border-top: 1px solid #e9edef;
        cursor: pointer;
    }
}
</style>
