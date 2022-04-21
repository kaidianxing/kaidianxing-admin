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
    <i-select
        v-bind="$attrs"
        :placeholder="placeholder"
        :multiple="multiple"
        class="ivu-tree-select"
        :class="classes"
        :transfer-class-name="transferClassName"
        ref="select"
        @on-change="handleChange"
        @on-open-change="handleOpenChange"
        :transfer="transfer"
    >

        <Tree
            ref="tree"
            :data="tmpData"
            :multiple="multiple"
            @on-select-change="handleSelectNode"
            @on-check-change="handleSelectNode"
            :check-strictly="checkStrictly"
            :show-checkbox="multiple && showCheckbox"
            :check-directly="checkDirectly"
            :load-data="loadData"
        ></Tree>
    </i-select>
</template>
<script>
import Emitter from './mixins/emitter.js'
import treePath from './treePath'
import { formatData } from './format'
let paths = []
export default {
    name: 'TreeSelect',
    mixins: [Emitter],
    props: {
        value: {
            type: [String, Number, Array],
        },
        // Tree 的数据
        data: {
            type: Array,
            default: () => [],
        },
        // multiple 模式下，value 为 Array
        multiple: {
            type: Boolean,
            default: false,
        },
        showCheckbox: {
            type: Boolean,
            default: false,
        },
        loadData: {
            type: Function,
        },
        transfer: {
            type: Boolean,
            default() {
                return !this.$IVIEWPRO || this.$IVIEWPRO.transfer === ''
                    ? false
                    : this.$IVIEWPRO.transfer
            },
        },
        // 是否遵循父子选中逻辑
        checkStrictly: {
            type: Boolean,
            default: false,
        },
        checkDirectly: {
            type: Boolean,
            default: true,
        },
        placeholder: {
            type: String,
            default: '请选择',
        },
        isHandlePath: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            currentValue: this.value,
            isChangeValueInTree: false, // 如果是点击 Tree 里改变的数据，临时置为 true，避免在 watch 的 value 中重复修改 Select 数据
            isValueChangeByTree: false, // 多选时，用于判定是否是从 Select 的 Tag 关闭的标签
            tmpData: [],
        }
    },
    watch: {
        value: {
            handler(val) {
                if (this.isChangeValueInTree) {
                    this.isChangeValueInTree = false
                } else {
                    this.currentValue = val
                    this.$refs.select?.reset()
                    paths = treePath(this.data, this.isHandlePath)
                    this.handleUpdateTreeNodes(this.tmpData, true)
                    // 强制刷新视图
                    this.tmpData = JSON.parse(JSON.stringify(this.tmpData))
                }
            },
            deep: true,
        },
        data: {
            handler() {
                this.tmpData = JSON.parse(JSON.stringify(this.data))
                paths = treePath(this.data, this.isHandlePath)
                if (this.isChangeValueInTree) {
                    this.isChangeValueInTree = false
                } else {
                    this.$refs.select?.reset()
                    this.handleUpdateTreeNodes(this.tmpData, true)
                }
            },
            deep: true,
        },
    },
    computed: {
        valueToArray() {
            return typeof this.currentValue === 'object'
                ? this.isHandlePath ? formatData(this.currentValue, this.tmpData) : this.currentValue
                : [this.currentValue]
        },
        isCheckboxUsable() {
            return this.multiple && this.showCheckbox
        },
        transferClassName() {
            return this.transfer ? 'ivu-tree-select-transfer' : ''
        },
        classes() {
            return {
                'ivu-tree-select-with-checkbox': this.showCheckbox,
            }
        },
    },
    methods: {
        handleSelectNode(selectedNodes, currentNode) {
            this.$emit('change-data', this.tmpData)
            if (this.multiple) {
                if (selectedNodes.length) {
                    this.currentValue = selectedNodes.map((item) => item.value)
                    this.handleUpdateSelectValue(
                        currentNode.value,
                        currentNode.title
                    )
                } else {
                    this.currentValue = []
                    this.handleUpdateSelectValue('', '')
                }
                this.traverseData(this.tmpData, this.currentValue)
            } else {
                if (selectedNodes.length) {
                    const node = selectedNodes[0]
                    this.currentValue = node.value
                    this.handleUpdateSelectValue(node.value, node.title)
                } else {
                    this.currentValue = ''
                    this.handleUpdateSelectValue('', '')
                }
            }
            this.isChangeValueInTree = true
            this.$emit('input', this.currentValue)
            this.$emit('on-change', this.currentValue)
            this.dispatch('FormItem', 'on-form-change', this.currentValue)
        },
        handleUpdateTreeNodes(data, isInit = false) {
            /**
             * 当开启 showCheckbox 时，不能选择，只能勾选，且只有在多选时支持 showCheckbox 属性
             * */
            data.forEach((item) => {
                if (this.valueToArray.indexOf(item.value) >= 0) {
                    if (this.isCheckboxUsable) {
                        item.checked = true
                    } else {
                        item.selected = true
                    }
                    this.handleUpdateSelectValue(item.value, item.title)
                } else {
                    if (this.isCheckboxUsable) {
                        item.checked = false
                    } else {
                        item.selected = false
                    }
                }
                if (item.children && item.children.length) {
                    this.handleUpdateTreeNodes(item.children)
                }
            })
            // Select 在 onOptionClick 方法中，如果是多选，会强制将 isFocused 设置为 true，初始时会有一个蓝框
            if (isInit && this.$refs.select) this.$refs.select.isFocused = false
        },
        handleUpdateSelectValue(value) {
            // 遍历出当前选中元素的上下层及
            if (value === '') {
                this.$refs.select?.reset()
            } else {
                this.isValueChangeByTree = true
                let path = paths.filter((val) => {
                    return val[val.length - 1].value == value
                })[0]
                if (path && path.length > 0 && this.$refs.select) {
                    this.$refs.select.onOptionClick({
                        value,
                        label: path.map((item) => item.title).join('->') || '',
                    })
                }
                if (!this.multiple) {
                    this.isValueChangeByTree = false
                }
            }
        },
        handleChange(value) {
            if (this.isValueChangeByTree) {
                this.isValueChangeByTree = false
            } else {
                this.currentValue = value
                this.$emit('input', value)
                this.$emit('on-change', value)
                this.dispatch('FormItem', 'on-form-change', value)
                this.$refs.select?.reset()
                this.handleUpdateTreeNodes(this.tmpData, true)
                this.$emit('change-data', this.tmpData)
                this.$nextTick(() => {
                    this.isValueChangeByTree = false
                })
            }
        },
        handleOpenChange(status) {
            this.$emit('on-open-change', status)
        },
        traverseData(data, currentList) {
            data.forEach((item) => {
                if (currentList.indexOf(item.value) > -1) {
                    item.checked = true
                } else {
                    item.checked = false
                }
                if (item.children && item.children.length > 0) {
                    this.traverseData(item.children, currentList)
                }
            })
        },
    },
    mounted() {
        if (this.data?.length) {
            this.tmpData = JSON.parse(JSON.stringify(this.data))
        }
        paths = treePath(this.data, this.isHandlePath)
        this.handleUpdateTreeNodes(this.data, true)
    },
}
</script>
