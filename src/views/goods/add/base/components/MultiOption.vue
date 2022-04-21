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
    <div class="multi-option">
        <!--规格-->
        <div class="single">
            <div class="spec" v-for="(item, index) in local_specs" :key="index">
                <!-- 主规格 -->
                <div class="column">
                    <Input
                        :class="{
                            errorInput:
                                cacheSpecsError && cacheSpecsError[item.id],
                        }"
                        v-model="item.title"
                        class="width-160 input"
                        v-error-item='item.id'
                        placeholder="如颜色、尺码、大小"
                        :disabled="is_activity_goods"
                        :maxlength="30"
                        @on-blur="changeSpec(index, $event)"
                    />
                    <Checkbox
                        v-model="item.image_checked"
                        true-value="1"
                        false-value="0"
                        @on-change="fnImageCheckedChange(index, $event)"
                    >
                        添加图片
                    </Checkbox>
                    <span class="error-span" v-if="cacheSpecsError">
                        {{ cacheSpecsError[item.id] }}
                    </span>
                </div>
                <!-- 子规格 -->
                <div class="data">
                    <r-input
                        type="close"
                        v-model="val.title"
                        :closable="item.items.length > 1"
                        class="width-160 input"
                        :class="{errorInput:cacheSpecsError && cacheSpecsError[val.id],}"
                        v-error-item='val.id'
                        :disabled="is_activity_goods"
                        :maxlength="30"
                        v-for="(val, key) in item.items"
                        :key="key"
                        placeholder="请填写子规格，如L、M"
                        @blur="
                            editChildSpec({
                                row: index,
                                col: key,
                                val: { title: $event },
                            })
                        "
                        @close="delChildSpec({ row: index, col: key })"
                    >
                        <span
                            class="error-span"
                            slot="error"
                            v-if="cacheSpecsError"
                        >
                            {{ cacheSpecsError[val.id] }}
                        </span>
                    </r-input>
                    <Button
                        type="text"
                        :disabled="is_activity_goods"
                        @click="addChildSpec(index)"
                        v-if="specs[index].items.length < 50"
                    >
                        +添加规格值
                    </Button>
                </div>
                <div class="box"></div>
                <Icon
                    type="ios-close-circle"
                    class="icon"
                    @click="closeSpec(index)"
                    v-if="specs.length > 1"
                />
            </div>
            <!-- 主规格添加按钮 -->
            <div class="addSpecItemBtn" v-if="specs.length < 3">
                <Button type="text" class="add-item" :disabled="is_activity_goods" @click="addSpec">
                    +添加规格项
                </Button>
            </div>
        </div>
        <!--批量设置-->
        <div class="setting">
            <span>批量设置:</span>
            <div
                class="setting-input"
                v-for="(item, index) in initColumns"
                :key="index"
                v-show="item.key !== 'thumb'"
            >
                <kdx-rr-input
                    v-model="catchBatchData[item.key]"
                    :disabled="is_activity_goods && (item.key == 'price' || item.key == 'stock') || (model_type == '2' && item.title == '库存')"
                    :fixed="getFixed(item)"
                    :maxValue="getMaxValue(item)"
                    :minValue="getMinValue(item)"
                    :number="isNumberType(item)"
                    type="text"
                    class="setting-input-wrapper"
                    @blur="batchData(item.key, $event.target.value)"
                    :style="{background: model_type == '2' && item.title == '库存' ? '#f3f3f3' : 'transparent'}"
                />
                <span
                    :class="{
                        'span-active':
                            catchBatchData[item.key] ||
                            catchBatchData[item.key] == '0',
                    }"
                    >{{ item.title }}</span>
            </div>
            <Button @click="setUsing(catchBatchData)">应用</Button>
        </div>
        <!--table-->
        <div class="table" style="padding:0">
            <Table
                id='childSpec'
                :columns="getColumns"
                :data="tableData"
                :span-method="handleSpan"
            >
                <template slot-scope="{ row, column, index }" slot="thumb">
                    <div
                        class="add-image"
                        @click="clickImgSelector({ row, index })"
                        
                    >
                        <div class="image" v-if="row.thumb">
                            <img
                                :src="$media(row.thumb)"
                                alt=""
                                @error="replaceImage"
                            />
                            <Icon
                                type="ios-close-circle"
                                class="close-icon"
                                @click.stop="
                                    deleteImage({ row, column, index })
                                "
                            />
                            <div class="replace">替换</div>
                        </div>
                        <i class="icon ivu-icon ivu-icon-ios-add" v-else></i>
                    </div>
                </template>
            </Table>
            <div class="footer-page" v-if="total > 10">
                <kdx-page-component
                    ref="page"
                    :total="total"
                    :current="pageNumber"
                    @on-change="changePage"
                    @on-page-size-change="pageSizeChange"
                    :pageSize="pageSize"
                    :pageSizeOption="pageSizeOpts"
                ></kdx-page-component>
            </div>
        </div>
        <image-selector
            ref="image_selector"
            :current="imageSelector.current"
            @on-change="changeImageSelector"
        ></image-selector>
    </div>
</template>

<script>
// 多规格
import { mapState, mapMutations, mapActions } from 'vuex'
import RInput from '@/components/little/RInput'
import ImageSelector from '@/components/selector/ImageSelector'
import { trackError } from '@/store/goodAddEdit/jsTools/formDataChecker.js'
export default {
    name: 'MultiOption',
    props: {
        // 商品类型
        model_type: {
            type: [String,Number]
        },
        // 商品添加还是编辑
        actionType: {
            type: String
        },
    },
    components: {
        RInput,
        ImageSelector,
    },
    data() {
        return {
            pageSizeOpts: [10, 20, 50],
            pageSize: 10,
            pageNumber: 1,
            cacheError: {},
            catchBatchData: Object.assign({}, catchBatchData),
            imageSelector: {
                index: -1,
                current: '',
            },
            imgSelectCache: {
                index: -1,
                row: {
                    optionImage: [],
                },
            }, //用来缓存图片选择器选则的行数，值等信息
            initColumns: [],//初始化多规格
            initCustom: [
                {
                    title: '售卖价(元)',
                    key: 'price',
                    renderHeader: () => {
                        return(
                            <div class="required-content">
                                售卖价(元)
                            </div>
                        )
                    }
                },
                {
                    title: '划线价(元)',
                    key: 'original_price',
                },
                {
                    title: '成本价',
                    key: 'cost_price',
                },
                {
                    title: '库存',
                    key: 'stock',
                    renderHeader: () => {
                        return(
                            <div class="required-content">
                                库存
                            </div>
                        )
                    }
                },
                {
                    title: '商品编码',
                    key: 'goods_sku',
                },
                {
                    title: '商品条码',
                    key: 'bar_code',
                },
                {
                    title: '重量(g)',
                    key: 'weight',
                },
            ],
            local_columns: [],
            local_specs: [],
            secretColumn: [
                {
                    title: '库存',
                    key: 'virtual_account_id',
                    width: 550,
                    renderHeader: () => {
                        return(
                            <div class="required-content">
                            卡密库
                            </div>
                    )
                    }
                },
                {
                    title: '售卖价(元)',
                    key: 'price',
                    renderHeader: () => {
                        return(
                            <div class="required-content">
                            售卖价(元)
                            </div>
                    )
                    }
                },
                {
                    title: '划线价(元)',
                    key: 'original_price',
                },
                {
                    title: '成本价',
                    key: 'cost_price',
                },
            ]
        }
    },
    computed: {
        ...mapState('goodAddEdit/multiOptions', {
            columns: (state) => state.columns,
            specs: (state) => {
                return state.specs
            },
            cacheRowSpan: (state) => state.cacheRowSpan,
            cacheFormError: (state) => state.cacheFormError,
            cacheSpecsError: (state) => state.cacheSpecsError,
        }),
        ...mapState("goodAddEdit", {
            is_activity_goods: state => state?.model?.is_activity_goods == 1?true:false,
            virtualList: state => state?.virtualData || [],
        }),
        getColumns() {
            return [
                ...this.local_columns,
                ...this.initColumns.map((item) => {
                    item.render = (h, params) => {
                        let start = this.pageSize * (this.pageNumber - 1)
                        let key = `${params.index + start}_${params.column.key}`
                        let attr = {}
                        let diasble = this.is_activity_goods && (item.key == 'price' || item.key == 'stock');
                        switch (params.column.key && this.model_type != '2') {
                            case 'price':
                            case 'original_price':
                            case 'cost_price':
                            case 'weight':
                                attr = {
                                    maxValue: 9999999.99,
                                    minValue: 0,
                                    fixed: 2,
                                    number: true
                                }
                                break;
                            case 'stock':
                                attr = {
                                    fixed: 0,
                                    maxValue:999999999,
                                    number: true
                                }
                                break;
                            case 'goods_sku':
                            case 'bar_code':
                                attr = {
                                    fixed: 0,
                                    number: false
                                }
                                break
                        }
                        // 当为编码、条码时可以不是纯数字的
                       
                        if(this.model_type == '2' && params.column.key == 'virtual_account_id') {
                            const handleChange = e => {
                                params.row[item.key] = e
                                this.trackError(
                                    params.index + start,
                                    item.key,
                                    e
                                )
                                this.inputOptionVal(
                                    e,
                                    params,
                                    item.key
                                )

                            }
                            const temp =  this.virtualList.length>0 ? this.virtualList.map((val)=> {
                                            return <Option value = {val.id} label = {val.name} >
                                                <span> {val.name} </span>
                                                <span style = "float:right;color: #ccc" >库存：{val.total_count} </span>
                                                </Option>
                                        }) : ''
                            return  (<div>
                                        <Select
                                            value={params.row[item.key]}
                                            disabled={diasble}
                                            fixed={attr.fixed}
                                            key ={key}
                                            filterable
                                            clearable
                                            onOn-change={handleChange}
                                            not-found-text='暂无卡密库数据'
                                            >
                                        {temp}
                                        </Select>
                                        <p style="color:red;font-size:12px;">
                                        {this.cacheError[params.index + start]?.[
                                                item.key
                                                ] || ''}
                                        </p>
                                    </div>)

                        }
                        else {
                            return (
                                <div>
                                    <kdx-rr-input
                                        className={
                                            'table-input ' +
                                            (this.cacheError[
                                            params.index + start
                                                ]?.[item.key] !== undefined
                                                ? 'error-input'
                                                : '')
                                        }
                                        disabled={diasble}
                                        value={params.row[item.key]}
                                        key={key}
                                        number={attr.number}
                                        maxValue={attr.maxValue}
                                        minValue={attr.minValue}
                                        fixed={attr.fixed}
                                        maxlength={attr.maxlength}
                                        onOn-blur={(e) => {
                                            params.row[item.key] = e.target.value
                                            this.trackError(
                                                params.index + start,
                                                item.key,
                                                e.target.value
                                            )
                                            this.inputOptionVal(
                                                e.target.value,
                                                params,
                                                item.key
                                            )
                                        }}
                                    ></kdx-rr-input>
                                    <p style="color:red;font-size:12px;">
                                        {this.cacheError[params.index + start]?.[
                                            item.key
                                            ] || ''}
                                    </p>
                                </div>
                            )
                        }
                    }
                    return item
                }),
            ]
        },
        total() {
            return this.$store.state.goodAddEdit.multiOptions.options.length
        },
        totalOptions() {
            return this.$store.state.goodAddEdit.multiOptions.options
        },
        tableData: {
            get() {
                let start = this.pageSize * (this.pageNumber - 1)
                let end = this.pageSize * this.pageNumber
                return this.$store.state.goodAddEdit.multiOptions.options.slice(
                    start,
                    end
                )
            },
        },
    },
    methods: {
        ...mapMutations('goodAddEdit/multiOptions', [
            'addSpec',
            'setBatch',
            'delSpecs',
            'addChildSpec',
            'delChildSpec',
            'editChildSpec',
            'editSpec',
            'cacheInput',
        ]),
        ...mapActions('goodAddEdit/multiOptions', {
            checkSpecSettings: 'checkSpecSettings',
            checkSpecs: 'checkSpecs',
        }),
        pageSizeChange(pager) {
            this.pageNumber = pager.pageNumber
            this.pageSize = pager.pageSize
        },
        trackError(row, key, val) {
            if (this.cacheError[row]) {
                this.cacheError[row][key] =  trackError(key, val);
            } else {
                this.cacheError[row] = {
                    [key]: trackError(key, val),
                }
            }
        },
        changePage(pager) {
            this.pageNumber = pager.pageNumber
            this.pageSize = pager.pageSize
        },
        changeSpec(row, e) {
            if (this.cacheSpecsError) {
                this.checkSpecs()
            }
            this.editSpec({
                row,
                val: {
                    title: e.target.value,
                },
            })
            if (this.cacheSpecsError) {
                this.checkSpecs()
            }
        },
        closeSpec(index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定删除该规格值？',
                onOk: () => {
                    this.delSpecs(index)
                },
            })
        },
        batchData(key, value) {
            this.catchBatchData[key] = formatValue(value, key)
        },
        // 点击图片选择器
        clickImgSelector(params) {
            // if (params.index !== this.imageSelector.index) {
            //     this.imageSelector = params
            // }
            this.imageSelector = params
            this.imageSelector.current = params.row.thumb
            this.$refs['image_selector'].setValue(true, this.imageSelector.current)
            // 打开图片选择器弹窗
            // this.$nextTick(() => {
            //     this.$refs['image_selector'].setValue()
            // })
        },
        deleteImage(params) {
            // this.tableData[params.index][params.column.key] = ''
            let image_checked_specindex = this.local_specs.findIndex((item) => {
                return item.image_checked === '1'
            })
            // 删除对应组 thumb
            // 判断 添加图勾选的不是最后一个规格
            if (image_checked_specindex + 1 !== this.local_specs.length) {
                console.log(image_checked_specindex)
                let _spec_item_id_arr = Object.values(params.row._pos).slice(
                    0,
                    image_checked_specindex + 1
                )
                console.log(_spec_item_id_arr)
                this.totalOptions.forEach((item) => {
                    item._posArr = Object.values(item._pos)
                    if (
                        item._posArr
                            .join('')
                            .includes(_spec_item_id_arr.join(''))
                    ) {
                        item.thumb = ''
                        // 清空缓存
                        this.cacheInput({
                            _pos: item._pos,
                            key: 'thumb',
                            value: '',
                        })
                    }
                })
            } else {
                this.totalOptions[params.index+((this.pageNumber-1)*this.pageSize)][params.column.key] = ''
            }
        },
        // 轮播图
        thumbAllChange(pathList) {
            this.inputOptionVal(pathList, this.imgSelectCache, 'thumb')
        },
        // 点击添加图片
        fnImageCheckedChange(index, checked) {
            // 重置cacheColumnIndex
            cacheColumnIndex = 0
            // 清空规格图片
            this.resetOptionsThumb()
            // 删除规格图片
            this.local_columns.forEach((item, index) => {
                if (item.key === 'thumb') {
                    this.local_columns.splice(index, 1)
                }
            })
            if (checked === '1') {
                this.local_specs.forEach((item) => {
                    item.image_checked = '0'
                })
                this.local_specs[index].image_checked = '1'
                // 添加规格图片
                this.local_columns.splice(index + 1, 0, {
                    title: '规格图片',
                    key: 'thumb',
                    slot: 'thumb',
                })
            }
        },
        // 应用
        setUsing(data) {
            this.setBatch(data)
            this.catchBatchData = Object.assign({}, catchBatchData)
            // if (this.cacheFormError) {
                this.checkSpecSettings()
                this.cacheError = this.cacheFormError || {}
            // }
        },
        // 图片选择器 点击确定
        changeImageSelector(path) {
            this.inputOptionVal(path, this.imageSelector, 'thumb')
        },
        inputOptionVal(value, params, key) {
            let data = formatValue(value, key)
            if (key !== 'thumb') {
                this.tableData[params.index][key] = data //通过引用赋值，避免更新操作
                this.cacheInput({
                    _pos: params.row._pos,
                    key,
                    value: data,
                })
            } else {
                this.formatOptionsThumb(params, data)
            }
        },
        // 处理多规格图片赋值
        formatOptionsThumb(params, value) {
            this.imageSelector.current = value
            let { row, index } = params
            this.totalOptions[index+((this.pageNumber-1)*this.pageSize)]['thumb'] = value // 通过引用赋值，避免更新操作
            this.cacheInput({
                _pos: row._pos,
                key: 'thumb',
                value,
            })
            let cacheSpecIndex = 0
            let cacheSpecIndexArr = []
            this.local_columns.forEach((_item, _index) => {
                if (_item.key === 'thumb') {
                    cacheSpecIndex = _index
                }
                if (cacheSpecIndex !== 0 && _index > cacheSpecIndex) {
                    cacheSpecIndexArr.push(_index - 1)
                }
            })
            let _total = 0
            if (cacheSpecIndexArr.length) {
                _total = 1
            }
            cacheSpecIndexArr.forEach((item) => {
                _total *= this.local_specs[item].items.length
            })
            for (let i = 1; i < _total; i++) {
                this.totalOptions[(index+((this.pageNumber-1)*this.pageSize)) + i]['thumb'] = value
                // 缓存
                this.cacheInput({
                    _pos: this.totalOptions[(index+((this.pageNumber-1)*this.pageSize)) + i]._pos,
                    key: 'thumb',
                    value,
                })
            }
        },
        // 清空规格图片
        resetOptionsThumb() {
            this.totalOptions.forEach((item) => {
                item['thumb'] = ''
                // 清空缓存
                this.cacheInput({
                    _pos: item._pos,
                    key: 'thumb',
                    value: '',
                })
            })
            // 重置图片选择器 current
            this.imgSelectCache = {
                index: -1,
                current: '',
                row: {},
            }
        },
        // 单元格合并
        handleSpan({ column, rowIndex, columnIndex }) {
            let start = this.pageSize * (this.pageNumber - 1) //本页的第一条是总数组的第几条
            let end = start + this.pageSize
            let realRowIndex = start + rowIndex //当前行的真实行数
            if (columnIndex < this.local_columns.length) {
                if (column.key === 'thumb') {
                    cacheColumnIndex = columnIndex
                    columnIndex = columnIndex - 1
                }
                if (cacheColumnIndex && columnIndex > cacheColumnIndex) {
                    columnIndex = columnIndex - 1
                }
                //前1-4列规格列
                let spanStart = 0
                let spanEnd = 0
                for (let tmp = 0; ; tmp += this.cacheRowSpan[columnIndex]) {
                    if (tmp <= realRowIndex) {
                        spanStart = tmp
                    } else {
                        spanEnd = tmp
                        break
                    }
                }
                spanEnd = Math.min(spanEnd, end)
                spanStart = Math.max(spanStart, start)
                let arr = {
                    rowspan: 0,
                    colspan: 1,
                }
                if (realRowIndex == spanStart) {
                    arr = {
                        rowspan: spanEnd - realRowIndex,
                        colspan: 1,
                    }
                }
                return arr
            } else {
                return {
                    rowspan: 1,
                    colspan: 1,
                }
            }
        },
        getFixed(item) {
            switch (item.key) {
                case 'price':
                case 'original_price':
                case 'cost_price':
                case 'weight':
                    return 2
                case 'stock':
                    return 0
                default:
                    return
            }
        },
        getMaxValue(item){
             switch (item.key) {
                case 'price':
                case 'original_price':
                case 'cost_price':
                case 'weight':
                    return 9999999.99
                case 'stock':
                    return 999999999
                default:
                    return
            }
        },
        getMinValue(item){
            switch (item.key) {
                case 'price':
                case 'original_price':
                case 'cost_price':
                case 'weight':
                    return 0.00
                case 'stock':
                    return 0
                default:
                    return
            }
        },
        isNumberType(item) {
            return ['price','original_price','cost_price','stock','weight'].indexOf(item.key) >-1
        }
    },
    watch: {
        cacheSpecsError(){
            for(let k in this.cacheSpecsError){
                this.$focusError(k)
                break;
            }
        },
        cacheFormError() { 
            this.cacheError = this.cacheFormError || {}
            if (this.cacheFormError) {
                this.$nextTick(() =>{
                    this.$focusError(document.querySelectorAll('#childSpec .error-input')[0]) ;
                })
                this.$Message.error('请完善规格设置')
                this.$emit('form-error',this.cacheFormError)
                let index = Object.keys(this.cacheFormError)[0]
                this.pageNumber = Math.floor(index / this.pageSize) + 1 //检查规格设置的第几页有报错
            }
        },
        columns: {
            handler(value) {
                this.local_columns = [...value]
            },
            immediate: true,
            deep: true,
        },
        specs: {
            handler(value) {
                this.local_specs = [...value]
            },
            immediate: true,
            deep: true,
        },
        model_type: {
            handler(val) {
                if(val == '2') {
                    this.initColumns = this.secretColumn
                }else {
                    this.initColumns = this.initCustom
                }
            },
            immediate: true,
            deep: true
        }
    },
}
let cacheColumnIndex // 缓存index，合并单元格用
const catchBatchData = {
    price: '',
    original_price: '',
    cost_price: '',
    stock: '',
    goods_sku: '',
    bar_code: '',
    weight: '',
    virtual_account_id: '', //虚拟卡密-卡密库ID
}
// 格式化数据
function formatValue(value, key) {
    let priceKey = ['price', 'original_price', 'cost_price', 'weight'],
        data
    if (priceKey.indexOf(key) > -1) {
        data = parseFloat(value) ? parseFloat(value).toFixed(2) : 0.00
    } else if (key === 'stock') {
        data = parseInt(value) ? parseInt(value) : 0
    } else {
        data = value
    }
    return data
}
</script>

<style scoped lang="scss">
.multi-option {
    background-color: $background-color;
    padding: 0 20px 20px 20px;
    .addSpecItemBtn {
        padding: 21px 0;
        border-bottom: 1px solid #e9edef;
        margin-bottom: 20px;
    }
    > .single {
        position: relative;
        .spec {
            position: relative;
            padding: 30px 0 10px 0;
            border-bottom: 1px solid $border-color;
            &:hover {
                .icon {
                    display: block;
                }
            }
        }
        .column {
            margin-bottom: 20px;
            position: relative;
            > .input {
                margin-right: 10px;
            }
        }
        .data {
            padding-left: 40px;
            > .input {
                margin: 0 20px 20px 0;
            }
        }
        .box {
            position: absolute;
            top: 80px;
            left: 10px;
            width: 20px;
            height: 20px;
            border: 1px solid $text-zhushi;
            border-top: none;
            border-right: none;
        }
        .icon {
            position: absolute;
            top: 20px;
            right: 0;
            font-size: 20px;
            color: $text-zhushi;
            display: none;
            cursor: pointer;
            &:hover {
                color: $text-third;
            }
        }
    }
    /*批量设置*/
    > .setting {
        padding: 20px;
        margin-bottom: 16px;
        background-color: #ffffff;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        > span {
            padding-right: 20px;
            display: inline-block;
            word-break: keep-all;
        }
        > .setting-input {
            position: relative;
            .setting-input-wrapper {
                padding: 0;
                margin-right: 10px;
                border: 0;
                /*margin-bottom: 10px;*/
                max-width: 110px;
                min-width: 60px;
                display: inline-block;
                background-color: transparent;
            }
           /deep/ .ivu-input-foucs + span ,
           /deep/ .ivu-input-foucs + span {
                    transform: translateY(-16px);
                    color: $text-first;
                    @include font-12-16;
                    background-color: #ffffff;
            }
            > span {
                position: absolute;
                top: 6px;
                left: 10px;
                color: $text-zhushi;
                @include font-14-20;
                transition: all 0.3s ease-in-out;
                background-color: transparent;
                pointer-events: none;
            }
            > .span-active {
                transform: translateY(-16px);
                color: $text-first;
                @include font-12-16;
                background-color: #ffffff;
            }
        }
    }
    /*表格*/
    .table {
        padding: 0 20px;
    }
    /deep/ .table-input {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        font-size: 14px;
        border: 1px solid #dcdee2;
        height: 32px;
        box-sizing: border-box;
        color: #515a6e;
        position: relative;
        cursor: text;
        background-color: #fff;
        background-image: none;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
            box-shadow 0.2s ease-in-out;
        input {
            border: none;
            height: 30px;
        }
    }
    /deep/ .add-image {
        width: 40px;
        height: 40px;
        border: 1px solid #e9edef;
        box-sizing: border-box;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .icon {
            color: #b8b9bd;
            font-size: 30px;
            display: block;
        }
        .image {
            position: relative;
            &:hover {
                > .close-icon {
                    display: block;
                }
                > .replace {
                    display: block;
                }
            }
            img {
                width: 100%;
                height: 100%;
            }
            > .close-icon {
                font-size: 20px;
                position: absolute;
                top: -10px;
                right: -10px;
                color: $text-zhushi;
                cursor: pointer;
                display: none;
                &:hover {
                    color: $text-second;
                }
            }
            > .replace {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 20px;
                background-color: $shade-color;
                color: #fff;
                font-size: 12px;
                line-height: 20px;
                cursor: pointer;
                text-align: center;
                display: none;
            }
        }
    }
    /deep/ .show-img {
        .image {
            display: none;
        }
    }
    /deep/ .error-input {
        border: 1px solid red;
    }
    /deep/ .errorInput {
        input {
            border: 1px solid red;
        }
    }
    /deep/ .required-content {
        &:before {
            content: '*';
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 14px;
            color: #ed4014;
            font-weight: normal;
        }
    }
    .error-span {
        font-size: 12px;
        color: #ed4014;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        transform: translate(0, 100%);
    }
}
</style>
