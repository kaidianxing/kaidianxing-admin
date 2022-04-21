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
    <div class="shopping-mall-link" v-loading="loading">

        <div class="content" v-if="list && list.length > 0">
            <div v-for="(item,index) in list" :key="index" class="content-item">
                <p class="title">
                    {{ item.name }}
                </p>
                <ul v-if="item.links && item.links.length > 0">
                    <li v-for="(child, childIndex) in item.links" :key="childIndex"
                        @click="setChecked(index, childIndex)"
                        :class="{checked: child.checked}">
                        <Icon :type="child.icon"/>
                        <span class="name">{{ child.name }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else style="text-align: center">暂无数据</div>
    </div>
</template>

<script>
export default {
    name: "MarketingPage",
    props: {
        current: {
            type: [Object, String],
            required: true
        },
        value: {
            type: Boolean,
            default: false
        },
        hasService: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: {
                content: ''
            },
            data: [],
            list: [],
            loading: false,
            link: ''
        };
    },
    methods: {

        // 默认选中
        defaultChecked() {
            this.list.forEach((item, index) => {
                if (item.links && item.links.length > 0) {
                    item.links.forEach((child, childIndex) => {
                        if (child.url === this.current?.url) {
                            this.$set(this.list[index].links[childIndex], 'checked', true);
                        } else {
                            this.$set(this.list[index].links[childIndex], 'checked', false);
                        }
                    });
                }
            });
        },
        setChecked(index, childIndex) {
            let row = this.list[index].links[childIndex];
            // 选中状态
            if (row.checked) {
                this.$set(this.list[index].links[childIndex], 'checked', false);
                this.$emit('on-change', {});
            } else {
                // 未选中，进行选中清除其他选中项
                this.list.forEach((item, itemIndex) => {
                    item.links.forEach((child, itemChildIndex) => {
                        this.$set(this.list[itemIndex].links[itemChildIndex], 'checked', false);
                    });
                });
                this.$set(this.list[index].links[childIndex], 'checked', true);
                this.$emit('on-change', {url: row.url, name: row.name});
            }
        },
        getData() {
            this.loading = true;
            this.$api.shopApi.getLinkList().then(res => {
                this.loading = false;
                if (res.error === 0) {
                    if (this.hasService) {
                        this.data = res.sale
                    } else {
                        this.data = res.sale.map(v => {
                            v.links = v.links.filter(item => item.url != 'wx_service')
                            return v
                        });
                    }

                    this.list = this.data;
                    this.defaultChecked();
                }
            });
        },
    },
    created() {
        this.search.content = '';
        this.getData();
    }
};
</script>

<style scoped lang="scss">
.shopping-mall-link {
    position: relative;
    padding: 20px;
    height: 100%;

    .search {
        margin-bottom: 40px;

        > input {
            margin-right: -1px;
        }
    }

    .content {
        .content-item {
            padding-bottom: 20px;

            > .title {
                @include font-14-20-bold;
                color: $text-first;
                padding-bottom: 20px;
            }

            > ul {
                display: flex;
                flex-wrap: wrap;

                > li {
                    border: 1px solid $border-color;
                    border-radius: 2px;
                    padding: 10px 0px;
                    margin: 0 16px 16px 0;
                    color: $text-first;
                    @include font-14-20;
                    cursor: pointer;
                    width: 120px;
                    text-align: center;

                    &:hover {
                        color: $brand-color;
                    }

                    /*i {*/
                    /*    padding-right: 5px;*/
                    /*}*/
                }

                > .checked {
                    background-color: $brand-color;
                    color: #ffffff;
                    border-color: $brand-color;

                    &:hover {
                        color: #FFFFFF;
                    }
                }
            }
        }
    }
}
</style>
