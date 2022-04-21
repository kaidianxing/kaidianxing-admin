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
    <div :class="[`page-component-size-${size}`]">
        <Page :total="total" :page-size="page.pageSize" :show-total="showTotal" :show-elevator="showElevator"
              :current.sync="page.pageNumber" :page-size-opts="pageSizeOption" :show-sizer="showSizer"
              transfer @on-change="pageNumberChange" @on-page-size-change="pageSizeChange" />
    </div>
</template>

<script>
    export default {
        name: "kdxPageComponent",
        props: {
            total: {
                type: Number,
                default: 0
            },
            // 每页多少条
            pageSize: {
                type: Number,
                default: 10
            },
            // 当前页码
            current:{
                type: Number,
                default: 1
            },
            pageSizeOption: {
                type: Array,
                default: () => [10, 20, 100]
            },
            showTotal: {
                type: Boolean,
                default: true
            },
            // 显示快速切换页面
            showElevator: {
                type: Boolean,
                default: true
            },
            // 显示分页
            showSizer: {
                type: Boolean,
                default: true
            },
            limitDefault: {
                type: Boolean,
                default: false
            },
            size: { // 页码small模式
                type: String,
                default: ''
            }
        },
        watch:{
            current:{
                immediate:true,
                handler(){ 
                    this.page={
                        ...this.page, 
                        pageNumber:this.current
                    }
                }
            },
            pageSize:{
                immediate:true,
                handler(){
                    this.page={
                        ...this.page, 
                        pageSize:this.pageSize
                    }
                }
            },
        },
        data() {
            return {
                page: {
                    pageSize: this.pageSize,
                    pageNumber: this.current
                }
            };
        },
        methods: {
            pageNumberChange(pageNumber) { 
                this.page.pageNumber = pageNumber;
                this.$emit('on-change', this.page);
            },
            pageSizeChange(pageSize) {
                this.page.pageSize = pageSize;
                this.$emit('on-change', this.page);
                this.$emit('on-page-size-change', this.page);
            },
            reset(page = {pageSize: 10, pageNumber: 1}) {
               Object.assign(this.page, page);
                // this.$emit('on-change', this.page);
            }
        }
    };
</script>

<style scoped>

</style>
