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
    <div class='bindmobile' v-if='currentModal.id=="bindmobile"&&lazyLoad'>
        <i-form :label-width="120" ref='bindmobile' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <div>
                    <form-item label="标题：">
                        <div class="style-container">
                            <form-item label="标题文字：" :label-width="110" class="form-input-item mb-20">
                                <Input v-model="currentModal.params.title" :maxlength="15" show-word-limit></Input>
                            </form-item>
                            <form-item label="文字颜色：" :label-width="110"  class="form-input-item">
                                <MyColorPicker v-model='currentModal.style.titlecolor' default='#212121'></MyColorPicker>
                            </form-item>
                        </div>
                    </form-item>
                    <form-item label="图标：">
                        <div class="style-container">
                            <form-item label="选择图标：" :label-width="110"  class="form-input-item">
                                <MyAddImgImg v-model='currentModal.params.iconclass' type='icon'></MyAddImgImg>
                            </form-item>
                            <form-item label="图标颜色：" :label-width="110"  class="form-input-item">
                                <MyColorPicker v-model='currentModal.style.iconcolor' default='#ff3c29'></MyColorPicker>
                            </form-item>
                        </div>
                    </form-item>
                    <form-item label="按钮：">
                        <div class="style-container">
                            <form-item label="按钮文字："  :label-width="110" class="form-input-item mb-20">
                                <Input v-model="currentModal.params.btntext" :maxlength="10" show-word-limit></Input>
                            </form-item>
                            <form-item label="文字颜色：" :label-width="110"  class="form-input-item">
                                <MyColorPicker v-model='currentModal.style.btntextcolor' default='#ffffff'></MyColorPicker>
                            </form-item>
                            <form-item label="按钮颜色：" :label-width="110"  class="form-input-item">
                                <MyColorPicker v-model='currentModal.style.btnbackground' default='#ff5555'></MyColorPicker>
                            </form-item>
                        </div>
                    </form-item>
                    <form-item label="背景颜色：" :label-width="110"  class="form-input-item">
                        <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                    </form-item>
                </div>
                <Alert style="margin-left:40px;">提示：此元素仅在开启wap功能并且用户未绑定手机时显示。</Alert>
            </MyCollapse>
             <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <div>
                    <form-item label="上间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                    </form-item>
                    <form-item label="下间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                    </form-item>
                    <form-item label="左右间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginleft'></MyDraggableProgress>
                    </form-item>
                    <form-item label="上边角：">
                        <MyDraggableProgress
                            :min='0'
                            :max='50'
                            unit='px'
                            v-model='currentModal.style.topradius'
                        ></MyDraggableProgress>
                    </form-item>
                    <form-item label="下边角：">
                        <MyDraggableProgress
                            :min='0'
                            :max='50'
                            unit='px'
                            v-model='currentModal.style.bottomradius'
                        ></MyDraggableProgress>
                    </form-item>
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'bindmobile',
        data() {
            return {
                id: 'bindmobile'
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .style-container {
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        padding: 20px 20px 0 0;
        border-radius: 2px;
        background: #F4F6F8;

        /deep/ .ivu-form-item {
            margin-bottom: 20px;
        }

        .form-input-item {
            /deep/ .ivu-form-item-content {
                margin-left: 110px!important;
            }
        }
    }
</style>