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
    <div class="quick-actions-box">
        <div class="quick-actions">
            <div class="quick-actions-content">
                <Tooltip content="组件上移" placement="left">
                    <Button :disabled="!isPrev" @click="handlePrev">
                        <i class="iconfont icon-shangyi"></i>
                    </Button>
                </Tooltip>
                <Tooltip content="组件下移" placement="left">
                    <Button :disabled="!isNext" @click="handleNext">
                        <i class="iconfont icon-xiayi"></i>
                    </Button>
                </Tooltip>
                <Tooltip content="复制组件" placement="left">
                    <Button :disabled="!isCopy" @click="handleCopy">
                        <i class="iconfont icon-fuzhi"></i>
                    </Button>
                </Tooltip>
                <Tooltip content="页面设置" placement="left">
                    <Button @click="handleSetting">
                        <i class="iconfont icon-shezhi"></i>
                    </Button>
                </Tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import {deepCopy} from "@/assets/jsTools/objectTools";
import {scrollTo} from '@/store/decorate/utils.js'

export default {
    name: "QuickActions",
    data() {
        return {
            newIndex: 0,
            currentIndex: 0,
        };
    },
    computed: {
        ...mapState('decorate', {
            currentModal: state => state.currentModal,
            sortAbleList: state => state.sortAbleList,
            pageList: state => state.pageList,
            pageInfo: state => state.pageInfo,
            currentSortableModalIndex: state => state.currentSortableModalIndex,
        }),
        isPrev() {
            if (!this.sortAbleList?.length || this.currentSortableModalIndex === -1) {
                return false;
            }
            return this.currentSortableModalIndex > 0;
        },
        isNext() {
            if (!this.sortAbleList?.length || this.currentSortableModalIndex === -1) {
                return false;
            }
            return this.currentSortableModalIndex < this.sortAbleList.length - 1;
        },
        isCopy() {
            return !this.currentModal?.max && this.currentModal?.id !== 'pageInfo';
        }
    },
    methods: {
        // 获取新的排序完成的sortableList
        getNewSortableList() {
            let list = [...this.sortAbleList];
            list.splice(this.currentSortableModalIndex, 1);
            list.splice(this.newIndex, 0, this.currentModal);
            this.$store.commit('decorate/setSortAbleList', list);
            this.$store.commit('decorate/setSortableIndex');
            this.$store.commit('decorate/changeFocus', {item: this.currentModal, pageId: this.$route.params.page})
            scrollTo(this.currentModal, true)
        },
        handlePrev() {
            this.newIndex = this.currentSortableModalIndex - 1;
            this.getNewSortableList();
        },
        handleNext() {
            this.newIndex = this.currentSortableModalIndex + 1;
            this.getNewSortableList();
        },
        handleCopy() {
            let currentModal = deepCopy(this.currentModal);
            currentModal._comIndex_ = `${currentModal.type}_${this.pageList.length}_${new Date().getTime()}`
            this.addModal({
                list: currentModal,
                pageId: this.$route.params.page
            }).then(items => {
                let res = items[0];
                if (res) {
                    scrollTo(res, true);
                }
            })
        },
        handleSetting() {
            if (this.currentModal?.id !== 'pageInfo') {
                this.$store.commit('decorate/changeFocus', {item: this.pageInfo, pageId: this.$route.params.page})
            }
        },
        ...mapActions('decorate', ['addModal']),
    }
};
</script>

<style lang="scss" scoped>
.quick-actions {
    position: absolute;
    top: 370px;
    left: -70px;

    .quick-actions-content {
        background-color: #ffffff;
        border: 1px solid $border-color;
        border-radius: 36px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 6px;

        /deep/ .ivu-btn {
            border: 0;
            border-radius: 100%;
            padding: 8px;
            height: 40px;
            >span {
                line-height: 16px;
                height: 24px;
                .iconfont {
                    line-height: initial;
                }
            }

            &:hover {
                background-color: $background-color;
            }
            &:disabled {
                background-color: #ffffff;
                .iconfont {
                    color: #E0E0E0;
                }
                &:hover {
                    color: $background-color;
                }
            }

            .iconfont {
                font-size: 24px;
            }
        }

        /deep/ .ivu-tooltip {
            margin-bottom: 10px;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}

.quick-actions-box {
    width: 375px;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 306px;
    right: 540px;
    margin: auto;
    z-index: 0;
}

@media screen and (max-width: 1300px) {
    .quick-actions-box {
        left: 350px;
    }
}
</style>