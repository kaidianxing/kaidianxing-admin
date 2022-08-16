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
    <kdx-modal-frame v-model="value" title="粉丝标签" :width="500" :loading="loading"
                 @on-cancel="setValue" @on-ok="handleOk">
        <div class="fans-label">
            <div class="label-content">
                <div v-for="(item, index) in list" :key="index" class="label-item"
                     :class="{checked: selectObj[item.wechat_tag_id]}" @click="selectLabel(item)">
                    <span> {{item.tag_name}}</span>
                    <kdx-svg-icon type="icon-chenggong-shixin" class="icon"></kdx-svg-icon>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: "LabelModal",
    props: {
        id: {
            type: Array,
            default: () => []
        },
        currentList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            value: false,
            loading: false,
            list: [],
            selectRows: [],
            selectObj: {}
        };
    },
    methods: {
        setValue() {
            this.value = !this.value;
            if (this.value) {
                console.log('current-list', this.currentList)
                this.selectObj = {};
                this.selectRows = this.currentList.map(item => {
                    this.$set(this.selectObj, item.wechat_tag_id, true)
                    return item;
                });
                this.list.length === 0 && this.getList();
            }
        },
        // 获取标签列表
        getList() {
            this.loading = true;
            this.$api.homeApi.getWechatFansLabelList({pager: 0}).then(res => {
                if (res.error === 0) {
                    this.list = res.list || [];
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        handleOk() {
            let params = {
                fans_id: this.id,
                wechat_tag_id: this.selectRows.map(item => item.wechat_tag_id)
            }
            this.loading = true;
            this.$api.homeApi.setWechatFansLabel(params).then(res => {
                if (res.error === 0) {
                    this.$Message.success('粉丝标签操作成功');
                    this.setValue();
                    this.$emit('on-refresh')
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        selectLabel(row) {
            // 已选中
            if (this.selectObj[row.wechat_tag_id]) {
                this.$set(this.selectObj, row.wechat_tag_id, false);
                this.selectRows = this.selectRows.filter(item => item.wechat_tag_id !== row.wechat_tag_id);
            } else {
                this.$set(this.selectObj, row.wechat_tag_id, true);
                this.selectRows.push(row);
            }
        }
    }
};
</script>

<style scoped lang="scss">
.fans-label {
    padding: 30px 20px;
}
.label-content {
    display: flex;
    flex-wrap: wrap;
}
.label-item {
    position: relative;
    color: $text-first;
    @include font-14-20;
    padding: 2px 8px;
    border: 1px solid $border-color;
    margin: 0 10px 10px 0;
    border-radius: 2px;
    cursor: pointer;
    .icon {
        position: absolute;
        font-size: 14px;
        color: $brand-color;
        right: -7px;
        bottom: -7px;
        display: none;
    }
}

.checked {
    background-color: $brand-light;
    border-color: $brand-color;
    color: $brand-color;
    .icon {
        display: inline-block;
    }
}
</style>
