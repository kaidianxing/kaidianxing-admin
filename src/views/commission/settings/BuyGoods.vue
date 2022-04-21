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
    <div>
        <FormItem label="购买指定商品：" :label-width="120" prop="commission_level">
            <Button class='simple-btn' :style="{color:noManagePerm?'':$css['--theme-color']}" :disabled="noManagePerm" style=';margin-bottom:10px;' @click='addGood'>+添加指定商品</Button>
            <div class="goods-list" v-show="goodsList.length > 0">
                <shop-name-page-list ref="shop_name_list" :list="goodsList" @on-delete="deleteGoods"></shop-name-page-list>
            </div>
            <!--商品选择器-->
            <goods-selector multiple v-model='show' :limit="5" :currentList='goodsList' @on-cancel="handleCancel" @on-change="handleChange"></goods-selector>
        </FormItem>
        <FormItem label="统计方式：" :label-width='120' prop="commission_level" style='margin-bottom:0;'>
            <MyRadioGroup :items='type' v-model='settings.become_order_status'></MyRadioGroup>
        </FormItem>
    </div>
</template>

<script>
    import MyRadioGroup from '@/components/decorate/RadioGroup'
    import ShopNamePageList from "@/components/ShopNamePageList";
    import GoodsSelector from "@/components/selector/GoodsSelector";
    import {
        mapState,
        mapMutations,
        mapActions
    } from 'vuex'
    export default {
        components:{
            GoodsSelector,
            MyRadioGroup,
            ShopNamePageList
        },
        computed:{
            ...mapState('commission/settings', {
                goodsList:state=>state.goodsList,
                settings:state=>state.settings
            }),
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.settings.commission.manage')
            },
            type(){
                return  [{
                    label: '订单付款后',
                    id: '1'
                }, {
                    label: '订单完成后',
                    id: '2'
                }].map(item => {
                    item.disabled=this.noManagePerm
                    return item
                })
            },
        },
        data() {
            return {
                show: false,
            }
        },
        methods:{
            ...mapMutations('commission/settings',['setGoodsList']),
            ...mapActions('commission/settings',['getGoodsList']),
            addGood() {
                this.show = true;
            },
            handleCancel(){
                this.show = false;
            },
            handleChange(list){
                let ids=list.map(item=>item.id);
                this.settings.become_goods_ids=ids.join(',');
                this.setGoodsList(list)
                this.show = false;
            },
            deleteGoods(index){
                let _list = [...this.goodsList]
                _list.splice(index, 1);
                this.setGoodsList(_list)
            }
        }
    }
</script>

<style lang="scss" scoped>
 .goods-list {
     width: 600px;
     margin-left: 120px;
 }
</style>
