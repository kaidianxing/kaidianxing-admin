<template>
    <div class="app-content">
        <Form ref="form" :label-width="120" :rules="rules" :model="model" class="app-form">
            <form-item label="视频号 ID：" prop="video_number_id">
                <Input
                    type="text"
                    class="width-430"
                    v-model="model.video_number_id"
                    @on-blur="blurHandler"
                />
            </form-item>
            <form-item label="视频ID：" prop="video_id">
                <Input
                    type="text"
                    class="width-430"
                    v-model="model.video_id"
                    @on-blur="blurHandler"
                />
            </form-item>
            <kdx-hint-text style="margin-top: -20px;" class="marginL-120">
                <span>请登录</span><Button type="text" to="https://channels.weixin.qq.com/platform/login" target="_blank">视频号助手</Button><span>获取视频号ID、视频动态ID</span>
                <kdx-hint-tooltip type="image" placement="bottom"
                              :image="require('@/assets/image/example/video_example.png')"></kdx-hint-tooltip>
            </kdx-hint-text>
        </Form>
    </div>
</template>
<script>
export default {
    props: {
        current: {
            type: Object,
            default: () => {},
        },
    },
    mounted() {

    },
    data() {
        return {
            rules: {
                video_number_id: [{ required: true, message: "视频号 ID必填" }],
                video_id: [{ required: true, message: "视频ID必填" }],
            },
            model: {
                video_number_id: "",
                video_id: ''
            },
        };
    },
    methods: {
        blurHandler() {
            let { video_number_id, video_id } = this.model;
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.$emit("on-change", {
                        keyLink: 'videoRam',
                        video_id,
                        name: video_number_id,
                        url:""
                    });
                }
            })

        },
    },
};
</script>
<style lang="scss" scoped>
.app-content {
    padding: 10px 20px 0;
    /deep/.ivu-input-wrapper:hover{
        .ivu-input{
            border-color:$brand-color ;
        }
    }
    /deep/.ivu-input:hover{
        border-color:$brand-color ;
    }
    /deep/.ivu-input-search{
        color:#262b30 !important;
        &:hover{
            color: #FFFFFF !important;
            border-color:$brand-color !important;
        }
    }
    .app-form {
        margin-top: 40px;

        .input-box {
            position: relative;

            .ivu-select-dropdown {
                z-index: 1265;
                min-width: 430px;
                position: absolute;
                will-change: top, left;
                transform-origin: center top;
                top: 38px;
                left: 0;
            }
        }
        .customInput{
            width: 430px;
            &:hover{
                /deep/.ivu-input{
                    border-color:$brand-color ;
                }
            }
        }
        .choose-btn {
            user-select: none;
            border: 1px solid #e9edef;
            border-left: 0;
            box-sizing: border-box;
            border-radius: 0px 2px 2px 0px;
            width: 58px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color:#262b30 ;
            cursor: pointer;
            &:hover{
                border-color:$brand-color ;
                background: $brand-color ;
                color: #FFFFFF ;
            }

        }
    }
    /deep/.hint-text a{
        color: $brand-color;
    }
}
</style>
