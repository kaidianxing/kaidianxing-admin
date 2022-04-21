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
    <kdx-modal-frame v-model="value" :width="970" footerHide @on-cancel="setValue">
        <template #header>
            <div class="icon-selector-header-title">
                <span class="title">图标选择器</span>
                <span class="text">提示：为保证页面样式统一性，尽量选择同一套图标</span>
            </div>
        </template>
        <div class="icon-selector">
            <div class="icon-selector-label">
                <ul>
                    <li class="header-title" v-for="(item, index) in label" :key="index">
                        <div class="header-title">
                            {{item.title}}
                        </div>
                        <ul v-for="child in item.children" :key="child.key" :class="{'checked': labelName === child.key}" @click="labelClick(child)">
                            <li class="item-name">
                                {{child.name}}
                                <span v-if="child.tag" :class="[child.class]">({{child.tag}})</span>
                            </li>
                            <li class="item-num">{{child.num}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="icon-selector-content">
                <!--<div class="hint">
                    <kdx-hint-alert type="error" :show-icon="false" class="marginB-10" style="margin-right: 20px">提示：一个月后，</kdx-hint-alert>
                </div>-->
                <div class="search">
                    <Input
                            v-model="keywords"
                            search
                            enter-button="搜索"
                            placeholder="可搜索中文/英文关键词"
                            @on-search="handleSearch"
                            @on-enter="handleSearch"
                            class="width-250"
                    />
                </div>
                <div class="icon-selector-content-icon" ref='scrollBox'>
                    <ul v-if="list.length > 0">
                        <template v-for="(item, index) in list">
                            <li :key="index" @click="selectIcon(item.icon)" v-if="item.name !== '地址-红蓝条'">
                                <p class="icon">
                                    <i :class="[`${item.icon}`]"></i>
                                </p>
                                <p class="icon-name">
                                    {{ item.name }}
                                </p>
                            </li>
                        </template>
                    </ul>
                    <div class="no-icon" v-else>
                        <div class="icon">
                            <span class="iconfont icon-fenxiao-leijiyongjin-"></span>
                        </div>
                        <div class="btn">
                            暂无数据
                        </div>
                    </div>
                </div>
                <div class="footer-page">
                    <kdx-page-component ref="page" :total="total" :pageSizeOption="pageSizeOption"
                                    @on-change="handlePageChange"></kdx-page-component>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
import iconfont from '@/assets/font/iconfont.json';
import iconfontCustom from '@/assets/font/iconfontCustom.json';
import iconfontNew from '@/assets/font/iconfontNew.json';
import remixiconNew from '@/assets/font/remixiconNew.json';

export default {
    name: "IconSelector",
    data() {
        return {
            value: false,
            data: {
                officialNew: [],
                officialOld: [],
                thirdPartyNew: [],
            },
            list: [],
            searchList: [],
            total: 0,
            page: {
                pageSize: 70,
                pageNumber: 1
            },
            keywords: '',
            pageSizeOption: [70, 100, 200],
            labelName: 'officialNew',
            label: [
                {
                    title: '官方图标库',
                    children: [
                        {
                            name: '官方图标',
                            tag: '新',
                            class: 'success-color',
                            key: 'officialNew',
                            num: 0,
                        },
                        {
                            name: '官方图标',
                            tag: '旧',
                            class: 'disabled-color',
                            key: 'officialOld',
                            num: 0,
                        }
                    ]
                },
                {
                    title: '第三方图标库',
                    children: [
                        {
                            name: 'Remixicon',
                            tag: '新',
                            class: 'success-color',
                            key: 'thirdPartyNew',
                            num: 0,
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        setValue() {
            this.value = !this.value;
            if (this.value) {
                this.searchList = [];
                this.keywords = '';
                this.resetPage();
            }
        },
        selectIcon(icon) {
            this.$emit('on-change', icon);
            this.setValue();
        },
        handleSearch() {
            this.searchList = [];
            this.data[this.labelName].forEach(item => {
                if (item.keyword.indexOf(this.keywords) > -1) {
                    this.searchList.push(item);
                }
            });
            this.resetPage();
        },
        // 获取当前显示的商品
        getPageData() {
            let list = [];
            if (this.keywords) {
                list = this.searchList;
            } else {
                list = this.data[this.labelName];
            }
            this.total = list.length;
            let start = this.page.pageSize * (this.page.pageNumber - 1),
                    end = this.page.pageSize * this.page.pageNumber;
            this.list = list.slice(start, end);
        },
        handlePageChange(page) {
            this.page = page;
            this.getPageData();
            try {
                this.$refs.scrollBox.scrollTop = 0;
            } catch (e) {
                console.log(e);
            }
        },
        resetPage() {
            this.page = {
                pageSize: 70,
                pageNumber: 1
            };
            this.$refs['page'].reset(this.page);
            this.getPageData();
        },
        getIcon() {
            this.data.officialNew = this.getIconData(iconfontNew);
            this.data.officialOld = [...this.getIconData(iconfont), ...this.getIconData(iconfontCustom)];
            this.data.thirdPartyNew = this.getIconData(remixiconNew);
            this.getIconNum();
        },
        getIconData(data) {
           return data.glyphs.map(item => {
                item.icon = `${data.font_family} ${data.css_prefix_text}${item.font_class}`;
                item.keyword = `${item.name},${item.font_class}`;
                return item;
            });
        },
        getIconNum() {
          this.label.forEach(item => {
              item.children.forEach(child => {
                  child.num = this.data[child.key].length;
              })
          })
        },
        labelClick(item) {
            this.labelName = item.key;
            this.searchList = [];
            this.keywords = '';
            this.resetPage();
        }
    },
    beforeMount() {
        this.getIcon();
    }
};
</script>

<style scoped lang="scss">
.icon-selector-header-title {
    padding: 5px 4px;

    .title {
        @include font-16-22-bold;
        color: $text-first;
        padding-right: 10px;
    }

    .text {
        @include font-14-20;
        color: $text-second;
    }
}
.icon-selector {
    display: flex;
    .icon-selector-label {
        width: 200px;
        flex-shrink: 0;
        box-sizing: border-box;
        border-right: 1px solid $border-color;
        >ul {
            overflow-y: auto;
            >li {
                padding-top: 10px;
                .header-title {
                    @include font-12-16-bold;
                    color: $text-first;
                    padding: 12px 20px;
                }
                >ul {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 20px 12px 30px;
                    border-right: 2px solid #ffffff;
                    cursor: pointer;
                    >li {
                        color: $text-third;
                        .item-num,
                        .item-name {
                            @include font-12-16;
                        }
                    }
                    &.checked {
                        background-color: $brand-light;
                        border-right-color: $brand-color;
                        >li {
                            color: $brand-color;
                            span {
                                color: $brand-color!important;
                            }
                        }
                    }
                }
            }
        }
    }
}
.icon-selector-content {
    padding: 20px 0 20px 20px;
    overflow-x: hidden;
    flex: 1;

    > .search {
        display: flex;
        padding-bottom: 10px;

        .label {
            display: inline-block;
            width: 100px;
            padding-top: 6px;
            text-align: right;
            color: $text-first;
            @include font-14-20;
        }
    }

    .icon-selector-content-icon {
        max-height: calc(100vh - 110px - 160px - 40px - 42px - 43px);
        overflow-y: auto;
        overflow-x: hidden;
        margin-right: -10px;

        > ul {
            display: flex;
            flex-wrap: wrap;
            margin-right: -10px;

            > li {
                width: 82px;
                height: 82px;
                box-sizing: border-box;
                //background-color: $background-color;
                //border: 1px solid $border-color;
                border-radius: 2px;
                cursor: pointer;
                margin-right: 10px;
                margin-bottom: 10px;
                z-index: 0;
                /*overflow: hidden;*/
                &:hover {
                    border: 1px solid $brand-color;
                    background-color: $brand-light;

                    .icon {
                        color: $brand-color;
                    }

                    .icon-name {
                        color: $brand-color;
                    }
                }

                > .icon {
                    text-align: center;
                    margin: 10px auto;
                    z-index: 2;
                    transition: font-size 0.25s linear, width 0.25s linear;
                    color: #162a48;
                    /*&:hover {*/
                    /*    font-size: 100px;*/
                    /*}*/
                    > i {
                        font-size: 24px;
                    }

                    .iconfont-m-.icon-m-dizhi-honglantiao {
                        font-size: 1px;
                        display: inline-block;
                        transform: scale(0.4) translate(-40%, 0);
                    }
                }

                > .icon-name {
                    /*padding: 5px;*/
                    text-align: center;
                    @include font-12-16;
                    color: $text-first;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

        .no-icon {
            width: 100%;
            height: 100%;
            text-align: center;
            padding: 20px 0;

            > .icon {
                .iconfont {
                    font-size: 80px;
                }
            }

            > .btn {
                color: $text-second;
                @include font-14-20;
            }
        }
    }

    .footer-page {
        padding-top: 10px;
        padding-bottom: 0;
    }
}
</style>
