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
    <div class="order-ordinary-express-charge-mode-list">
        <Table ref="table" :columns="columns" :data="table.data"></Table>
    </div>
</template>

<script>
  export default {
    name: "chargeModeList",
      props: {
      type: {
        type: [String, Number],
        default: 1
      }
    },
    data() {
      return {
        columns: [],
        table: {
          data: []
        },
        pieceColumns: [
          {
            title: '配送范围',
            key: 'way',
            minWidth: 200,
            render: (h, params) => {
              if (params.index === 0) {
                return (
                  <div class="national-unity">全国统一运费</div>
                )
              } else {
                return (
                  <div class="other-area">
                      <div class="area">{params.row.region_area.text}</div>
                      <div class="area-btn">
                          <Button type="text" onClick={() => { this.editRegion(params.index, params.row.region_area)}}>编辑</Button>
                          <Button type="text" onClick={() => {this.deleteRegion(params.index, params.row)}}>删除</Button>
                      </div>
                  </div>
                )
              }
            }
          },
          {
            title: '首件(个)',
            key: 'start_num',
            render: (h, params) => {
              return (
                <kdx-rr-input type="text" number maxValue={999999999} fixed={0} value={params.row[params.column.key]}
                       onOn-blur={e => {this.changeData(params.index, params.column.key, e.target.value, 'int')}}
                ></kdx-rr-input>
              )
            }
          },
          {
            title: '运费(元)',
            key: 'start_num_price',
            render: (h, params) => {
              return (
                <kdx-rr-input type="text" number maxValue={9999999.99} fixed={2} value={params.row[params.column.key]}
                onOn-blur={e => {this.changeData(params.index, params.column.key, e.target.value, 'float')}}
                ></kdx-rr-input>
              )
            }
          },
          {
            title: '续件(个)',
            key: 'add_num',
            render: (h, params) => {
              return (
                <kdx-rr-input type="text" number maxValue={999999999} fixed={0} value={params.row[params.column.key]}
                       onOn-blur={e => {this.changeData(params.index, params.column.key, e.target.value, 'int')}}
                ></kdx-rr-input>
              )
            }
          },
          {
            title: '运费(元)',
            key: 'add_num_price',
            render: (h, params) => {
              return (
                <kdx-rr-input type="text" number maxValue={9999999.99} fixed={2} value={params.row[params.column.key]}
                       onOn-blur={e => {this.changeData(params.index, params.column.key, e.target.value, 'float')}}
                ></kdx-rr-input>
              )
            }
          }
        ],
        weightColumns: [
          {
            title: '配送范围',
            key: 'way',
            minWidth: 200,
            render: (h, params) => {
              if (params.index === 0) {
                return (
                  <div class="national-unity">全国统一运费</div>
                )
              } else {
                return (
                  <div class="other-area">
                      <div class="area">{params.row.region_area.text}</div>
                      <div class="area-btn">
                          <Button type="text" onClick={() => {this.editRegion(params.index, params.row.region_area[0])}}>编辑</Button>
                          <Button type="text" onClick={() => {this.deleteRegion(params.index)}}>删除</Button>
                      </div>
                  </div>
                )
              }
            }
          },
          {
            title: '首重(克)',
            key: 'start_weight',
            render: (h, params) => {
              return (
                <kdx-rr-input type="text" number maxValue={9999999.99} fixed={2} value={params.row[params.column.key]}
                       onOn-blur={e => {this.changeData(params.index, params.column.key, e.target.value, 'float')}}
                ></kdx-rr-input>
              )
            }
          },
          {
            title: '运费(元)',
            key: 'start_weight_price',
            render: (h, params) => {
              return (
                <kdx-rr-input type="text" number maxValue={9999999.99} fixed={2} value={params.row[params.column.key]}
                       onOn-blur={e => {this.changeData(params.index, params.column.key, e.target.value, 'float')}}
                ></kdx-rr-input>
              )
            }
          },
          {
            title: '续重(克)',
            key: 'add_weight',
            render: (h, params) => {
              return (
                <kdx-rr-input type="text" number maxValue={9999999.99} fixed={2} value={params.row[params.column.key]}
                       onOn-blur={e => {this.changeData(params.index, params.column.key, e.target.value, 'float')}}
                ></kdx-rr-input>
              )
            }
          },
          {
            title: '运费(元)',
            key: 'add_weight_price',
            render: (h, params) => {
              return (
                <kdx-rr-input type="text" number maxValue={9999999.99} fixed={2} value={params.row[params.column.key]}
                       onOn-blur={e => {this.changeData(params.index, params.column.key, e.target.value, 'float')}}
                ></kdx-rr-input>
              )
            }
          }
        ],
        priceItem: {
          start_num: '',
          start_num_price: '',
          add_num: '',
          add_num_price: '',
          region_area: {}
        },
        weightItem: {
          start_weight: '',
          start_weight_price: '',
          add_weight: '',
          add_weight_price: '',
          region_area: {}
        },
        index: 0
      };
    },
    watch: {
      type: {
        handler() {
          this.init();
        },
        immediate: true
      }
    },
    methods: {
      // 数据改变时
      changeData(index, key, value, type) {
        let data;
        if (type === 'int') {
          data = Math.abs(parseInt(value)) || '0';
        } else if (type === 'float') {
          data = parseFloat(value)? Math.abs(parseFloat(value).toFixed(2)):'0.00';
        }
        this.$set(this.table.data[index], key, data);
      },
      // column初始化
      init() {
        let item = {};
        // 按件计费
        if (this.type === 1) {
          this.columns = this.pieceColumns;
          Object.assign(item, this.priceItem);
        } else if (this.type === 0) {
          // 按重计费
          this.columns = this.weightColumns;
          Object.assign(item, this.weightItem);
        }
        this.table.data = [item]
      },
      // type :0：data初始化1新增，2修改
      initData({type, data}) {
        if (type == '0') {
          if (data?.length) {
              this.table.data = data;
          } else {
              this.init();
          }
        } else if (type == '1') {
          let item = {};
          if (this.type == 1) {
            item = Object.assign({}, this.priceItem)
          } else if (this.type == 0) {
            item = Object.assign({}, this.weightItem);
          }
          item.region_area = data;
          this.table.data.push(item);
        } else if (type == '2') {
          this.$set(this.table.data[this.index], 'region_area', data);
        }
      },
      editRegion(index, data = {}) {
        this.index = index;
        this.$emit('on-edit', data);
      },
      // 删除
      deleteRegion(index) {
        this.table.data.splice(index, 1);
      },
        validate() {
            let flag = false;
            let numKey = '';
            numKey = this.type == 1 ? 'start_num,add_num' : 'start_weight,add_weight';
          for (let item of this.table.data) {
             let keys = Object.keys(item);
             for (let key of keys) {
                 // 判断是否为空
                 if (!item[key]) {
                     flag = true;
                     this.$Message.error('计费信息不可为空');
                     break;
                 }
                 // 判断是否为0
                 if (numKey.indexOf(key) > -1 && parseFloat(item[key]) == '0') {
                     flag = true;
                     if (this.type === 1) {
                         this.$Message.error('首件和续件不可为0')
                     } else {
                         this.$Message.error('首重和续重不可为0')
                     }
                     break;
                 }
             }
             if (flag) {
                 break;
             }
          }
          return flag;
        },
      getModel() {
        let params = {};
        let defaultItem = this.table.data[0];
        delete defaultItem.region_area;
        Object.assign(params, defaultItem);
        if (this.table.data.length > 1) {
          let dispatch_area = [];
          this.table.data.forEach((item, index) => {
            if (index > 0) {
              let data = item;
              data.city = item.region_area.text;
              data.citys_code = item.region_area.areas;
              delete data.region_area;
              dispatch_area.push(data);
            }
          });
          if (dispatch_area.length === 0) dispatch_area = '';
          Object.assign(params, {dispatch_area: JSON.stringify(dispatch_area)});
        } else {
            params.dispatch_area = '';
        }
        return params;
      },
      // 获取area的code值
      getAreaCode() {
        if (this.table.data.length > 1) {
          let code = [];
          this.table.data.forEach((item, index) => {
            if (index >0) {
             code =  code.concat(item.region_area.areas || []);
            }
          })
          return code;
        } else {
          return [];
        }
      }
    },
    mounted() {
      this.init();
    }
  };
</script>

<style scoped lang="scss">
    .order-ordinary-express-charge-mode-list {
        padding: 0 10px;
        background-color: #ffffff;
        /deep/ .ivu-table {
            th {
                padding: 0;

                .ivu-table-cell {
                    padding: 15px;
                }
            }

            td {
                // 全国统一运费
                .national-unity {
                    @include font-12-16;
                    .ivu-checkbox {
                        margin-right: 10px;
                    }

                    .hint-text {
                        padding-left: 30px;
                    }
                }

                // 地区
                .other-area {
                    > .area {
                        @include font-12-24;
                        margin-bottom: 10px;
                    }

                    > .area-btn {
                        .ivu-btn {
                            padding-left: 5px;
                            border-radius: 0;
                            @include font-12-16;

                            &:first-child {
                                padding-left: 0;
                                padding-right: 5px;
                                border-right: 1px solid $brand-color;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
