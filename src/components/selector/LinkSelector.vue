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
    <kdx-modal-frame :value="value" title="链接选择器" width="1000" :loading="loading" ok-text="保存" @on-ok="handleSave" @on-cancel="handleCancel">
        <div class="selector-shopping-mall">
            <Tabs v-model="name">
                <TabPane label="商城链接" name="shop">
                    <div class="shopping-mall-link">
                        <div class="search">
                            <Input v-model="search.content" search enter-button="搜索" placeholder="请输入" @on-search="handleSearch"
                                   class="width-300"/>
                        </div>
                        <div class="content" v-if="list && list.length > 0">
                            <div v-for="(item,index) in list" :key="index" class="content-item">
                                <p class="title">
                                    {{item.name}}
                                </p>
                                <ul v-if="item.links && item.links.length > 0">
                                    <li v-for="(child, childIndex) in item.links" :key="childIndex"
                                        @click="setChecked(index, childIndex)"
                                        :class="{checked: child.checked}">
                                        <Icon :type="child.icon"/>
                                        <span class="name">{{child.name}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-else style="text-align: center">暂无数据</div>
                    </div>
                </TabPane>
                <TabPane label="自定义链接" name="custom">
                    <div class="image-selector-network">
                        <Form :label-width="120" class="custom-link" @submit.native.prevent>
                            <FormItem label="链接地址：">
                                <Input v-model="link" enter-button="提取链接" search
                                       @on-search="handleSave" placeholder="请输入"/>
                            </FormItem>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "LinkSelector",
        props: {
            current: {
                type: [Object, String],
                required: true
            },
            value: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                name: 'shop',
                search: {
                    content: ''
                },
                data: [],
                list: [],
                // 选中项
                selectRow: null,
                loading: false,
                link: '',
                keyword: ['shop', 'goods', 'member']
            };
        },
        methods: {
            handleSearch() {
              let data = [];
              this.data.forEach(item => {
                if (item.name.indexOf(this.search.content) > -1) {
                  data.push(item);
                } else if (item.links?.length) {
                  let childData = [];
                  item.links.forEach(child => {
                    if (child.name.indexOf(this.search.content) > -1) {
                      childData.push(child);
                    }
                  })
                  if (childData.length > 0) {
                    data.push({
                      item,
                        links: childData
                    })
                  }
                }
              })
              this.list = data;
            },
            // 默认选中
            defaultChecked() {
                this.list.forEach((item, index) => {
                    if (item.links && item.links.length > 0) {
                        item.links.forEach((child, childIndex) => {
                            if (child.url === this.selectRow?.url) {
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
                    this.selectRow = {};
                    this.$set(this.list[index].links[childIndex], 'checked', false);
                } else {
                    // 未选中，进行选中清除其他选中项
                    this.list.forEach((item, itemIndex) => {
                        item.links.forEach((child, itemChildIndex) => {
                            this.$set(this.list[itemIndex].links[itemChildIndex], 'checked', false);
                        });
                    });
                    this.$set(this.list[index].links[childIndex], 'checked', true);
                    this.selectRow = this.list[index].links[childIndex];
                }
            },
            getData() {
                this.loading = true;
                this.$api.shopApi.getLinkList().then(res => {
                    this.loading = false;
                    if (res.error === 0) {
                       this.data= res.list.map(v=> {
                            v.links = v.links.filter(item=>item.url!='wx_service')
                            return v
                        });
                       this.list = this.data;
                       this.defaultChecked();
                    }
                });
            },
            handleSave() {
                if (this.name === 'custom') {
                    this.$emit('on-change', {url: this.link});
                } else {
                    this.$emit('on-change', this.selectRow);
                }
                this.handleCancel();
            },
            handleCancel() {
                this.$emit('on-cancel');
            },
        },
        watch: {
            value: {
                handler(val) {
                    if (val) {
                        this.getData();
                        if (this.current) {
                          if (typeof this.current === 'string') {
                            this.selectRow = {url: this.current};
                          } else {
                            this.selectRow = this.current;
                          }
                        } else {
                          this.selectRow = {};
                        }
                        this.name = 'shop'
                        this.link = '';
                        this.search.content = '';
                    }
                },
                immediate: true
            }
        }
    };
</script>

<style scoped lang="scss">
    .shopping-mall-link {
        position: relative;
        padding: 20px;

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
                        padding: 10px 0;
                        margin: 0 16px 16px 0;
                        color: $text-first;
                        @include font-14-20;
                        cursor: pointer;
                        width: 104px;
                        box-sizing: border-box;
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

    .custom-link {
        padding: 80px 85px 0 85px;
    }
    // 网络图片
    /*.image-selector-network {*/
    /*    display: flex;*/
    /*    flex-wrap: nowrap;*/
    /*    justify-content: center;*/
    /*    align-items: center;*/
    /*    height: 100%;*/
    /*}*/
</style>

<style lang="scss">
    .selector-shopping-mall {
        // tabs样式修改
        .ivu-tabs-bar {
            margin-bottom: 0;
        }

        .ivu-tabs-nav-scroll {
            display: flex;
            justify-content: center;

            .ivu-tabs-nav {
                .ivu-tabs-tab {
                    padding: 12px 50px;
                    @include font-18-25-bold;
                    color: $text-first;
                }

                .ivu-tabs-tab-active {
                    color: $brand-color;
                }
            }
        }
    }
</style>
