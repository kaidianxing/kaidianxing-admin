<template>
    <kdx-modal-frame v-model="value" title="七牛云图片压缩使用说明" :width="520" :isOk="false" cancelText="关闭"
                 @on-cancel="handleCancel">
        <div class="use-direction-box">
            <p>① 到www.qiniu.com登录您的七牛云存储账号</p>
            <p>② 进入【管理控制台】</p>
            <p>③ 点击左侧导航中【对象存储】</p>
            <p>④ 选择【图片样式】选项卡</p>
            <p>⑤ 点击【新建图片样式】</p>
            <p>⑥ 按照您的要求，创建您的图片压缩规则</p>
            <p>⑦ 保存完成后，到【图片样式】选项卡中，复制该样式的“处理接口”代码，在ES管理端的操作弹窗中粘贴保存即可。</p>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: 'UseDirection',
        data() {
            return {
                value: false
            }
        },
        methods: {
            setValue() {
                this.value = !this.value;
            },
            handleCancel() {
                this.setValue();
            }
        }
    };
</script>

<style scoped lang="scss">
    .use-direction-box {
        padding: 20px 40px;
        > p {
            @include font-12-24;
        }
    }
</style>
