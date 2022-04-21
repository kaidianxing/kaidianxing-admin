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
    <kdx-modal-frame v-model="visible" title="区域信息" width="810" @on-ok="handleOk" @on-cancel="handleCancel">
        <div class="region-select">
            <Icon type="ios-arrow-forward" class="jiantou"/>
<!--            <div class="info-text" v-if="!panelShow"><span class="fa fa-spinner fa-spin"></span> 正在加载数据...</div>-->
            <div class="region-body">
                <div class="es-panel panel-all" v-show="panelShow">
                    <div class="panel-header">
                        <div>地区选择</div>
                        <div class="pull-right">
                            <div class="pull-left inp-box">
                                <Input
                                        placeholder="搜索省/市/区"
                                        v-model="keywords"
                                        @on-change="search()"
                                        class="width-160"></Input>
                                <!--                                <Button type="primary" style="margin-left: 10px">搜索</Button>-->
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <ul class="provinces">
                            <li v-for="(p, index) in address" :key="index" v-show="p.show"
                                :class="p.expand_left?'active':''">
                                <p class="bar" @click="expand(1,p.id)">
                                    <!-- 适配国外 990000   990100   990101 -->
                                    <Icon :type="p.expand_left ? 'ios-arrow-down' : 'ios-arrow-forward'"
                                          v-show="p.children.length > 0 && p.children[0].code_id!='990100'" class="icon"/>
                                    <span class="name">{{p.name}}</span>
                                    <span class="plus disabled" @click.stop v-if="p.disabled">选择</span>
                                    <span class="plus" v-else @click="add(p.id)">选择</span>
                                </p>
                                <ul class="citys" v-if="p.children && p.children.length>0">
                                    <li v-for="(c, index) in p.children" :key="index" v-show="c.show"
                                        :class="c.expand_left?'active':''">
                                        <p class="bar" @click="expand(1,p.id,c.id)">
                                            <Icon :type="c.expand_left ? 'ios-arrow-down' : 'ios-arrow-forward'"
                                                  v-if="c.children.length > 0" class="icon"/>
                                            <span class="name"
                                                  :class="[ c.children.length<=0?'noareas':'' ]">{{c.name}}</span>
                                            <span class="plus disabled" @click.stop v-if="c.disabled">选择</span>
                                            <span class="plus" v-else @click="add(p.id,c.id)">选择</span>
                                        </p>
                                        <ul class="areas" v-if="c.children && c.children.length>0">
                                            <li v-for="(a, index) in c.children" :key="index" v-show="a.show">
                                                <p class="bar">
                                                    <span class="name">{{a.name}}</span>
                                                    <span class="plus disabled" @click.stop v-if="a.disabled">选择</span>
                                                    <span class="plus" v-else @click="add(p.id,c.id,a.id)">选择</span>
                                                </p>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
<!--                        <div class="info-text" v-html="all_text">没有未选择的城市</div>-->
                    </div>
                </div>
                <div class="es-panel panel-selected" v-show="panelShow">
                    <div class="panel-header">已选择</div>
                    <div class="panel-body">
                        <ul class="provinces">
                            <template v-for="(p, index) in address">
                                <li :key="index" v-if="p.add"
                                    :class="p.expand_right?'active':''">
                                    <p class="bar" @click="expand(2,p.id)">
                                        <Icon :type="p.expand_right ? 'ios-arrow-down' : 'ios-arrow-forward'"
                                              v-show="p.children.length > 0 && p.children[0].code_id!='990100'" class="icon"/>
                                        <span class="name">{{p.name}}</span>
                                        <span class="remove" @click="remove(p.id)">取消</span>
                                    </p>
                                    <ul class="citys" v-if="p.children && p.children.length>0">
                                        <template v-for="(c, index) in p.children">
                                            <li :key="index" v-if="c.add"
                                                :class="c.expand_right?'active':''">
                                                <p class="bar" @click="expand(2,p.id,c.id)">
                                                    <Icon :type="c.expand_right ? 'ios-arrow-down' : 'ios-arrow-forward'"
                                                          v-show="c.children.length > 0" class="icon"/>
                                                    <span class="name">{{c.name}}</span>
                                                    <span class="remove"
                                                          @click="remove(p.id,c.id)">取消</span>
                                                </p>
                                                <ul class="areas" v-if="c.children && c.children.length>0">
                                                    <template v-for="(a, index) in c.children">
                                                        <li :key="index" v-if="a.add">
                                                            <p class="bar">
                                                                <span v-text="a.name"></span>
                                                                <span class="remove"
                                                                      @click="remove(p.id,c.id,a.id)">取消</span>
                                                            </p>
                                                        </li>
                                                    </template>
                                                </ul>
                                            </li>
                                        </template>
                                    </ul>
                                </li>
                            </template>
                        </ul>
<!--                        <div class="info-text" v-show="selected_text_show">没有选择任何区域</div>-->
                    </div>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    const FORIEGN = {
        add: false,
        all_add: false,
        code_id: "990000",
        expand: false,
        expand_left: false,
        expand_right: false,
        id: "990000",
        label: "国外",
        letter: "guowai",
        level: "1",
        location: "",
        name: "国外",
        parent_id: "0",
        show: true,
        sort: "G",
        value: "国外",
        children: [
            {
                add: false,
                all_add: false,
                code_id: "990100",
                expand: false,
                expand_left: false,
                expand_right: false,
                id: "990100",
                label: "国外",
                letter: "guowai",
                level: "2",
                location: "",
                name: "国外",
                parent_id: "990000",
                show: true,
                sort: "G",
                value: "国外",
                children: [
                    {
                        add: false,
                        all_add: false,
                        code_id: "990101",
                        expand: false,
                        expand_left: false,
                        expand_right: false,
                        id: "990101",
                        label: "国外",
                        letter: "guowai",
                        level: "3",
                        location: "",
                        name: "国外",
                        parent_id: "990100",
                        show: true,
                        sort: "G",
                        value: "国外",
                        children: []
                    }
                ],
            }
        ],
    }
    export default {
        name: "SelectorRegion",
        props: {
            visible: {
              type: Boolean,
              default: false
            },
            list: {
                type: Object,
                default: () => {
                    return {};
                }
            },
          limitList: {
              type: Array,
            default: () => []
          }
        },
        data() {
            return {
                address: [],
                panelShow: true,
                selecteds: {},
                hides: {
                    provinces: [],
                    citys: [],
                    areas: []
                },
                keywords: '',
                all_text: '',
                all_text_show: false,
                selected_text: '没有选择任何区域',
                selected_text_show: true,
            };
        },
        created() {
            this.selecteds = this.list;
        },
        watch: {
            show_modal(newValue) {
                if (newValue) {
                    this.init();
                }
            },
            list(newValue) {
                this.selecteds = newValue;
                this.init();
            }
        },
        mounted() {
            this.$store.dispatch('config/getAddress').then(()=>{
                // this.address = this.$store.state?.config?.address || [];
                let arr = JSON.parse(JSON.stringify(this.$store.state?.config?.address)) || []
                if (arr.length){
                    arr.push(FORIEGN)
                }
                this.address = arr;
            })
           
        },
        methods: {
            handleOk() {
                this.$emit('on-ok', this.submit());
            },
            handleCancel() {
                this.$emit('on-cancel', false);
            },
            async init() {
                await this.$store.dispatch('config/getAddress')
                if (!this.address || this.address.length === 0) {
                    this.address = this.$store.state.config.address;
                }
                this.selected_text_show = true;

                //清除选择
                this.clearAdd();

                //隐藏不能选择的
                this.checkHide();
                if (this.selecteds && this.selecteds.areas) {
                    this.address.forEach(p => {
                      let area_total = 0;
                      p.disabled = false;
                      p.children.forEach(c => {
                          let area_add = 0;
                        c.disabled = false;
                        c.children.forEach(a => {
                          a.disabled = false;
                          if (this.selecteds.areas.indexOf(a.id) > -1 ) {
                            a.add = true;
                            a.show = false;
                            area_add++;
                          }
                        })
                        if (area_add > 0) {
                            p.add = true;
                          c.add = true;
                          c.show = area_add !== c.children.length;
                          !c.show && area_total++;
                        }
                      })
                      if (area_total > 0) {
                        p.show = area_total !== p.children.length;
                      }
                    });
                    this.selected_text_show = false;
                    this.panelShow = true;
                }
                this.initDisabled();
            },
            //点击展开合并
            expand(index, pcode, ccode) {
                if (pcode == 990000) {
                    return
                }
                if (typeof (ccode) !== 'undefined') {
                    this.address.forEach(p => {
                        if (pcode === p.id) {
                            p.children.forEach(c => {
                                if (ccode === c.id) {
                                    if (index === 1) {
                                        c.expand_left = !c.expand_left;
                                    } else {
                                        c.expand_right = !c.expand_right;
                                    }
                                    c.expand = !c.expand;
                                    return false;
                                }
                            });
                        }
                    });
                } else if (typeof (pcode) !== 'undefined') {
                    this.address.forEach(p => {
                        if (pcode === p.id) {
                            if (index === 1) {
                                p.expand_left = !p.expand_left;
                            } else {
                                p.expand_right = !p.expand_right;
                            }
                            p.expand = !p.expand;
                            return false;
                        }
                    });
                }
            },
            //合并左侧所有展开
            closeExpand() {
                this.address.forEach(province => {
                    province.expand_left = false;
                    province.children.forEach(city => {
                        city.expand_left = false;
                    });
                });
            },
            //选择
            add(pcode, ccode, acode) {
                event.stopPropagation();

                if (typeof (acode) !== 'undefined') {
                    this.address.forEach(p => {
                        if (pcode === p.id) {
                            p.children.forEach(c => {
                                if (ccode === c.id) {
                                    c.children.forEach(a => {
                                        if (a.id === acode) {
                                            a.add = true;
                                            a.show = false;
                                            return false;
                                        }
                                    });
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                } else if (typeof (ccode) !== 'undefined') {
                    this.address.forEach(p => {
                        if (pcode === p.id) {
                            p.children.forEach(c => {
                                if (ccode === c.id) {
                                    c.children.forEach(a => {
                                        a.add = true;
                                        a.show = false;
                                    });
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                } else if (typeof (pcode) !== 'undefined') {
                    this.address.forEach(p => {
                        if (pcode === p.id) {
                            p.children.forEach(c => {
                                c.children.forEach(a => {
                                    a.add = true;
                                    a.show = false;
                                });
                            });
                            return false;
                        }
                    });
                }
                //检测选择情况
                this.check(1, pcode);
                this.address = JSON.parse(JSON.stringify(this.address));
            },
            //点击取消
            remove(pcode, ccode, acode) {
                event.stopPropagation();

                if (typeof (acode) !== 'undefined') {
                    this.address.forEach(p => {
                        if (pcode === p.id) {
                            p.children.forEach(c => {
                                if (ccode === c.id) {
                                    c.children.forEach(a => {
                                        if (a.id === acode) {
                                            a.add = false;
                                            a.show = true;
                                            return false;
                                        }
                                    });
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                } else if (typeof (ccode) !== 'undefined') {
                    this.address.forEach(p => {
                        if (pcode === p.id) {
                            p.children.forEach(c => {
                                if (ccode === c.id) {
                                    c.children.forEach(a => {
                                        a.add = false;
                                        a.show = true;
                                    });
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                } else if (typeof (pcode) !== 'undefined') {


                    this.address.forEach(p => {
                        if (pcode === p.id) {
                            p.children.forEach(c => {
                                c.children.forEach(a => {
                                    a.add = false;
                                    a.show = true;
                                });
                            });
                            return false;
                        }
                    });
                }
                //检测选择情况
                this.check(0, pcode);
            },
            //判断是省市是否全选
            //type: Number  0:删除  1:添加
            check(type, pcode) {
                // let added = false;

                this.address.forEach(p => {

                    let area_total = 0;
                    let area_add_total = 0;
                    if (p.id === pcode) {
                        let city_add = 0; //选择中的城市数量
                        area_total += p.children.length;
                        if (p.children.length !== 0) {
                            p.children.forEach(c => {

                                area_total += c.children.length;

                                let area_add = 0;  //选择中的地区 数量
                                if (c.children.length !== 0) {
                                    c.children.forEach(a => {
                                        if (a.add) {
                                            area_add++;
                                            area_add_total++;
                                            // added = true;
                                        }
                                    });

                                    c.add = area_add > 0;
                                    c.show = area_add < c.children.length;//如果选中地区总数等于地区总数，城市全选
                                    c.add_all = area_add >= c.children.length;
                                    area_add >= c.children.length ? area_add_total++ : '';
                                } else {
                                    if (type === 1) {
                                        c.add = true;
                                        c.add_all = true;
                                        c.show = false;
                                        area_add_total++;
                                    } else {
                                        c.add = false;
                                        c.add_all = false;
                                        c.show = true;
                                    }
                                }

                                if (c.add) {
                                    // added = true;
                                    city_add++;
                                }
                            });

                            p.add = city_add > 0;
                            p.show = area_add_total < area_total;//如果选中城市总数等于城市总数，省份全选
                            p.add_all = area_add_total >= area_total;

                        } else {
                            if (type === 1) {
                                p.add = true;
                                p.add_all = true;
                                p.show = false;
                                area_add_total++;
                            } else {
                                p.add = false;
                                p.add_all = false;
                                p.show = true;
                            }
                        }

                        if (p.add) {
                            // added = true;
                        }
                    }
                });
            },
            checkHide() {
                //隐藏 不能选择的
                this.hide = this.selecteds;
                this.address.forEach(p => {
                    // let area_total = 0;
                    // let area_hide = 0;
                    p.children.forEach(c => {
                        // area_total += c.areas.length;
                        // let city_area_hide = 0;
                        c.children.forEach(a => {
                            this.hides.areas.forEach(ha => {
                                if (ha === a.id) {
                                    a.show = false;
                                    // city_area_hide++;
                                    // area_hide++;
                                }
                            });
                        });
                    });
                });
            },
            //清除所有显示
            clearShow() {
                this.address.forEach(p => {
                    p.children.forEach(c => {
                        c.children.forEach(a => {
                            a.show = false;
                        });
                        c.show = false;
                        c.expand = false;
                        c.expand_left = false;
                    });
                    p.show = false;
                    p.expand = false;
                    p.expand_left = false;
                });
            },
            //清除所有添加
            clearAdd() {
                this.address.forEach(p => {
                    p.children.forEach(c => {
                        c.children.forEach(a => {
                            a.add = false;
                            a.show = true;
                            a.disabled = false;
                        });
                        c.add = false;
                        c.add_all = false;
                        c.show = true;
                        c.expand = false;
                        c.expand_left = false;
                        c.expand_right = false;
                        c.disabled = false;
                    });
                    p.add = false;
                    p.add_all = false;
                    p.show = true;
                    p.expand = false;
                    p.expand_left = false;
                    p.expand_right = false;
                    p.disabled = false;
                });
            },
            //搜索
            search() {
                this.clearShow();
                this.address.forEach(p => {
                    p.children.forEach(c => {
                        let area_show = false;
                        c.children.forEach(a => {
                            //搜索地区
                            if (a.name.indexOf(this.keywords) !== -1 && !a.add) {
                                area_show = true;
                                a.show = true;
                                c.show = true;
                                c.expand = true;
                                c.expand_left = true;
                                p.show = true;
                                p.expand = true;
                                p.expand_left = true;
                            }
                        });
                        //搜索城市
                        if ((c.name.indexOf(this.keywords) !== -1 || area_show) && !c.add_all) {

                            c.children.forEach(a => {
                                if (!a.add) {
                                    a.show = true;
                                }
                            });
                            c.show = true;
                            c.expand = true;
                            c.expand_left = true;

                            p.show = true;
                            p.expand = true;
                            p.expand_left = true;
                        }
                    });
                    //搜索省
                    if (p.name.indexOf(this.keywords) !== -1 && !p.add_all) {
                        p.children.forEach(c => {
                            if (!c.add_all) {
                                c.children.forEach(a => {
                                    if (!a.add) {
                                        a.show = true;
                                    }
                                });
                                c.show = true;
                                c.expand = false;
                                c.expand_left = false;
                            }
                        });
                        p.show = true;
                        p.expand = true;
                        p.expand_left = true;
                    }
                });
                if (this.keywords === '') {
                    this.closeExpand();
                }
            },
            submit() {
                let selected_provinces = [], selected_citys = [], selected_areas = [], texts = '', provinceName = [],
                    cityName = [];
                this.address.forEach(p => {
                    // let province = {
                    //     code: p.code,
                    //     name: p.name,
                    //     citys: []
                    // };
                    if (p.add) {
                        selected_provinces.push(p.id);
                        p.children.forEach(c => {
                            if (c.add) {
                                selected_citys.push(c.id);
                                c.children.forEach(a => {
                                    if (a.add) {
                                        selected_areas.push(a.id);
                                    }
                                });
                            }
                        });
                    }
                });
                selected_provinces.forEach(sp => {
                    this.address.forEach(p => {
                        if (sp === p.id) {
                            texts += (texts.length > 0 ? "，" : '') + p.name;
                            provinceName.push(p.name);
                            if (p.show) {
                                texts += '【';
                                selected_citys.forEach(sc => {

                                    p.children.forEach(c => {

                                        if (sc === c.id) {
                                            texts += texts[texts.length-1] === '【' ? c.name : `，${c.name}`
                                            cityName.push(c.name);
                                            if (c.show) {
                                                texts += "(";
                                                let areas = [];
                                                selected_areas.forEach(sa => {

                                                    c.children.forEach(a => {
                                                        if (sa === a.id) {
                                                            areas.push(a.name);
                                                        }
                                                    });
                                                });
                                                texts += areas.join(',') + ")";
                                            }
                                        }
                                    });
                                });
                                texts += (texts.length > 0 ? "】" : '');
                            }
                        }
                    });
                });

                // if (typeof (model.callback) === 'function') {
                //     model.callback({
                //         'provinces': selected_provinces,
                //         'citys': selected_citys,
                //         'areas': selected_areas,
                //         'text': texts
                //     });
                // }
                return {
                  provinces: selected_provinces,
                  citys: selected_citys,
                  areas: selected_areas,
                  text: texts,
                  provinceName: provinceName,
                  cityName: cityName,
                };
            },
          initDisabled() {
              if (this.limitList.length > 0) {
                this.address.forEach(p => {
                  p.children.forEach(c => {
                    c.children.forEach(a => {
                      if (!a.add && this.limitList.indexOf(a.id) > -1) {
                        a.disabled = true;
                        if (!c.add) {
                          c.disabled = true;
                        }
                        if (!p.add) {
                          p.disabled = true;
                        }
                      }
                    })
                  })
                })
              }
          }
        },
    };
</script>

<style scoped lang="scss">
    .region-select {
        margin: 20px;
        position: relative;

        &:after {
            content: '';
            clear: both;
            display: block;
        }

        .jiantou {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #999999;
            font-size: 26px;
        }

        > .region-body {
            &:after {
                content: '';
                clear: both;
                display: block;
            }

            .panel-header {
                height: 44px;
                box-sizing: border-box;
                padding-bottom: 10px;
                font-size: 14px;
                color: #333;
                line-height: 34px;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
            }

            .panel-all {

            }

        }
    }


    .panel-all, .panel-selected {
        float: left;
        width: 349px;
        height: 511px;
        box-sizing: border-box;
    }

    .panel-selected {
        float: right;
    }

    .panel-body {
        box-sizing: border-box;
        border: 1px solid #ededed;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        height: 467px;
        width: 100%;
        overflow-y: auto;
        padding: 16px;
        padding-bottom: 0;

        li {
            margin-bottom: 16px;
            cursor: pointer;
            box-sizing: border-box;
            list-style: none;

            .plus {
                float: right;
                font-size: 12px;
                line-height: 12px;
                color: $brand-color;

                &:hover {
                    text-decoration: underline;
                }
            }

            .remove {
                float: right;
                font-size: 12px;
                line-height: 12px;
                color: $brand-color;

                &:hover {
                    text-decoration: underline;
                }
            }

            .bar {
                position: relative;
                padding-left: 16px;
            }

            .icon {
                font-size: 16px;
                color: #333;
                position: absolute;
                top: 0;
                left: 0;
                transform: scale(0.7, 0.7);
                transition: transform 0.5s;
            }
            .disabled {
               color: $text-zhushi;
            }
        }

        .provinces {
            box-sizing: border-box;

            & > li {
                font-size: 14px;
                color: #333;
                line-height: 14px;

                & > ul {
                    height: 0;
                    overflow: hidden;
                    display: none;
                }

                &.active {
                    & > ul {
                        height: auto;
                        overflow: visible;
                        display: block;
                    }
                }
            }
        }

        .citys {
            padding-top: 16px;
            box-sizing: border-box;

            & > li {
                font-size: 12px;
                color: #333;
                line-height: 12px;
                text-indent: 16px;

                & > ul {
                    height: 0;
                    overflow: hidden;
                    display: none;
                }

                &.active {
                    & > ul {
                        height: auto;
                        overflow: visible;
                        display: block;
                    }
                }
            }
        }

        .areas {
            padding-top: 16px;
            box-sizing: border-box;

            & > li {
                font-size: 12px;
                color: #999;
                line-height: 12px;
                text-indent: 16px;
            }
        }

        .info-text {
            height: 435px;
            width: 100%;
            text-align: center;
            line-height: 435px;
        }
    }
</style>
