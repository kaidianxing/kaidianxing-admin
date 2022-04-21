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
/* eslint-disable */
import {
    mapState,
    mapGetters,
    mapMutations
} from 'vuex'
import allComponents from '@/components/decorate/allComponents'

export default {
    components: {
        ...allComponents
    },
    props: {
        visibleArea: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            lazyLoad: false
        }
    },
    activated() {
        setTimeout(() => {
            this.$nextTick(() => {
                this.lazyLoad = true
                this.tipError()
            })
        }, 60)
    },
    deactivated() {
        this.lazyLoad = false
    },
    computed: {
        ...mapState('decorate', {
            currentModal: state => state.currentModal,
            pageInfo: state => state.pageInfo,
            validator: state => state.validator,
            errorInfo: state => state.errorInfo,
        }),
    },
    methods: {
        ...mapMutations('decorate', ['refreshCurrentModal', 'refreshPageInfo','checkError']),
        tipError(){
            if (this.errorInfo) {
                this.$nextTick(() => {
                    if (this.$refs[this.errorInfo.id]) {
                        this.$refs[this.errorInfo.id].validate()
                    }
                })
            }
        },

    },
    watch: {
        errorInfo: {
            immediate: true,
            handler() {
                this.tipError()
            }
        }
    }
}