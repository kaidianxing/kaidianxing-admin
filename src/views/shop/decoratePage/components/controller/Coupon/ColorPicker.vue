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
    <ul class='coupon-color-picker'>
        <li class='color-box' :class='{active:getActiveValue==index}' v-for="(item,index) in items" :key='index' @click="pick(item)">
            <div class="color" :style="{background:item.color}">
                <i class="iconfont-m- icon-m-yiwancheng" :style="{color:item.activeArrowColor}" v-if='getActiveValue==index'></i>
            </div>
            <div class="name">
                {{item.name}}
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            items:{
                type:Array,
                default:()=>[]
            },
            value:{
                type:String,
                default:''
            }
        },
        watch:{
            items:{
                immediate: true,
                handler() {
                    this.cache={}
                    this.items.forEach((item,idx)=>{
                        this.cache[item.id]=idx
                    })
                }
            }
        },
        computed: {
            getActiveValue(){
                let index=-1
                if(this.cache[this.value]!==undefined){
                    index=this.cache[this.value]
                }
                return index
            }
        },
        methods:{
            pick(item){
                this.$emit('input',item.id)
            }
        }

    }
</script>

<style lang="scss" scoped>
.coupon-color-picker{
    display:flex;
    flex-wrap: wrap;
    width: 100%;
    padding-top:8px;
    .color-box{
        width: 50px;
        flex-shrink: 0;
        margin-right:10px;
        cursor: pointer;
        .color{
            width: 100%;
            height: 30px;
            border-radius: 2px;
            display:flex;
            justify-content: center;
        }
        .icon-m-yiwancheng{
            font-size:20px;
            margin:auto;
        }
        .name{
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 16px;
            color: #262B30;
            text-align: center;
            margin-top: 4px;
        }
        &.active{
            .name{
                color:$brand-color!important;
            }
        }
    }
}
</style>