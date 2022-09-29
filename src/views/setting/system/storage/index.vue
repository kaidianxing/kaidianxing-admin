/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <kdx-content-bar :loading="loading">
        <div class="remote-storage">
            <div class="header">
                <kdx-form-title :has-margin="false">
                    全局配置
                    <template #text>默认所有店铺使用此远程存储</template>
                </kdx-form-title>
                <kdx-hint-alert :show-icon="false">
                    <div class="alert-box">
                        <div class="left title">
                            温馨提示：
                        </div>
                        <div class="right">
                            <p class="title success-title">推荐使用远程存储</p>
                            <p>
                                对接FTP和七牛存等任意远程存储器，将降低对服务器加载图片的压力，提升商城的运行加载速度
                            </p>
                        </div>
                    </div>
                </kdx-hint-alert>
            </div>
                        <storage-info ref="storage_info" :type.sync="type"></storage-info>
        </div>
        <template #btn>
            <Button class="primary-long" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import StorageInfo from "./storageInfo/index";
export default {
    name: 'index',
    components: {
        StorageInfo,
    },
    data() {
        return {
            type: 'local',
            loading: false,
        }
    },
    created() {
        this.getData()
    },
    methods: {
        setLabelStatus(type) {
            this.type = type
        },
        getData() {
            this.loading = true
            this.$api.systemApi.getStorage().then((res) => {
                this.loading = false
                if (res.error === 0) {
                    let {type, ...other} = res.settings
                    this.type = type
                    this.$refs['storage_info'].resetData(other);
                }
            })
        },
        handleSave() {
            if (this.type === 'local') {
                this.$api.systemApi.setStorage({type: this.type}).then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('本地存储保存成功')
                        this.getData()
                    }
                })
            } else {
                this.$refs['storage_info'].validate().then((valid) => {
                    if (valid) {
                        let model = {
                            [this.type]: this.$refs['storage_info'].getModel(),
                            type: this.type,
                        }
                        this.$api.systemApi.setStorage(model).then((res) => {
                            if (res.error === 0) {
                                this.$Message.success('本地存储保存成功')
                                this.getData()
                            }
                        })
                    }
                })
            }
        },
    },
}
</script>

<style scoped lang="scss">
.remote-storage {
    padding: 40px;
    min-height: 100%;
    margin-top: 20px;
    background: #FFFFFF;
    .header {
        margin-bottom: 30px;

        .hint-alert-component {
            margin-top: 10px;

            .alert-box {
                display: flex;
                flex-wrap: nowrap;

                .title {
                    @include font-12-24;
                }

                .success-title {
                    color: $success-color;
                }
            }
        }
    }

    .check-label {
        /deep/ .label-item {
            width: 100px;
        }
    }

    .label-box {
        padding: 0 20px;
    }
}
</style>
