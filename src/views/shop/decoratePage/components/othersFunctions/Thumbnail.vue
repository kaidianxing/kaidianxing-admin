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
    <div class='thumbnail'>
        <ul v-if='sortAbleList.length' class='list'>
            <li v-for='(item,index) in sortAbleList' class='item' :class='{active:currentModal === item}' :key='index' @click='focus(item)'>{{item.name}}</li>
        </ul>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default { 
        computed: {
            ...mapState('decorate', {
                sortAbleList: state => state.sortAbleList,
                currentModal: state => state.currentModal,
            }),
        },
        methods: {
            ...mapMutations('decorate', ['changeFocus']),
            focus(item) {
                 if (item !== this.currentModal) {
                    if (item.id == "diymenu") return
                    this.$nextTick(() => {
                        this.changeFocus({
                            item,
                            pageId: this.$route.params.page
                        });
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .thumbnail {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(55px,0);
        max-height: 100vh;
        width: 100px;
        background: #fff;
        border: 1px solid #ccc;
        z-index: 10000;
        overflow: hidden;
        .list {
            width: 100%;
            height: 100%;
            overflow: auto;
            .item{
                border-top:1px solid #ccc;
                height: 30px;
                cursor: pointer;
                text-align: center;
                line-height: 30px;
                &.active{
                    border: 1px solid red;
                }
            }
        }
    }
</style>