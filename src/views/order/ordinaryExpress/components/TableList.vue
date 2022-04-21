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
    <div class="good-list-table-list">
        <Table ref="table" :columns="columns" :data="getData" @on-selection-change="selectChange"
        ></Table>
        <div class="footer-action" v-show="data.length > 0">
            <Checkbox v-model="isSelectAll" :disabled='noManagePerm' @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled" @click="setStatus({type: 'start',status: '1'})">启用</Button>
            <Button :disabled="selectDisabled" @click="setStatus({type: 'close',status: '0'})">禁用</Button>
            <Button :disabled="selectDisabled" @click="handleDelete({type: 'multiple'})">删除</Button>
        </div>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
        </div>
    </div>
</template>

<script>
  export default {
    name: "TableList",
    props: {
      data: {
        type: Array,
        default: () => []
      },
      total: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        updateShopNameIndex: -1,
        columns: [
          {
            type: 'selection',
            width: 40,
            align: 'center'
          },
          {
            title: '排序',
            key: 'sort',
            width: 80
          },
          {
            title: '名称',
            key: 'dispatch_name',
            minWidth: 120,
            render: (h, params) => {
              let defaultComponent;
              if (params.row.is_default == '1') {
                defaultComponent = (
                  <kdx-tag-label type="info" size="small">默认</kdx-tag-label>
                );
              }
              return (
                <div class="ordinary-express-name">
                  <span>{params.row[params.column.key]}</span>
                  {
                    defaultComponent
                  }
                </div>
              );
            }
          },
          {
            title: '计费方式',
            key: 'calculate_type',
            minWidth: 100,
            render: (h, params) => {
              if (params.row[params.column.key] == '0') {
                return (
                  <kdx-tag-label type="warning" size="small">按重计费</kdx-tag-label>
                );
              } else if (params.row[params.column.key] == '1') {
                return (
                  <kdx-tag-label type="success" size="small">按件计费</kdx-tag-label>
                );
              }
            }
          },
          {
            title: '首(重/件)价格',
            key: 'first_price',
            minWidth: 90,
            render: (h, params) => {
              let data;
              // 重量
              if (params.row.calculate_type == '0') {
                data = params.row.start_weight_price;
              } else if (params.row.calculate_type == '1') {
                // 按件
                data = params.row.start_num_price;
              }
              if (data) {
                data = `￥${parseFloat(data).toFixed(2)}`;
              } else {
                data = '-';
              }
              return (
                <div>{data}</div>
              );
            }
          },
          {
            title: '续(重/件)价格',
            key: 'price',
            minWidth: 90,
            render: (h, params) => {
              let data;
              // 重量
              if (params.row.calculate_type == '0') {
                data = params.row.add_weight_price;
              } else if (params.row.calculate_type == '1') {
                // 按件
                data = params.row.add_num_price;
              }
              if (data) {
                data = `￥${parseFloat(data).toFixed(2)}`;
              } else {
                data = '-';
              }
              return (
                <div>{data}</div>
              );
            }
          },
          {
            title: '状态',
            key: 'state',
            minWidth: 80,
            render: (h, params) => {
              if (params.row[params.column.key] == '0') {
                return (
                  <kdx-status-text type="disabled">未启用</kdx-status-text>
                );
              } else if (params.row[params.column.key] == '1') {
                return (
                  <kdx-status-text type="success">启用</kdx-status-text>
                );
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            minWidth: 120,
            render: (h, params) => {
              let status, defaultComponent;
              if (params.row.is_default != '1') {
                defaultComponent = (
                  <Button disabled={this.noManagePerm} type="text" onClick={() => {
                    this.setDefault(params.row.id, '1');
                  }}>设置默认</Button>
                );
              } else {
                defaultComponent = (
                  <Button disabled={this.noManagePerm} type="text" onClick={() => {
                    this.setDefault(params.row.id, '0');
                  }}>取消默认</Button>
                );
              }
              if (params.row.state == '0') {
                status = (
                  <Button disabled={this.noManagePerm} type="text" onClick={() => {
                    this.setStatus({id: params.row.id, type: 'start', status: '1'});
                  }}>启用</Button>
                );
              } else if (params.row.state == '1') {
                status = (
                  <Button disabled={this.noManagePerm} type="text" onClick={() => {
                    this.setStatus({id: params.row.id, type: 'close', status: '0'});
                  }}>禁用</Button>
                );
              }
              return (
                <div class="action">
                  {
                    defaultComponent
                  }
                  {
                    status
                  }
                  <Button disabled={this.noManagePerm} type="text" onClick={()=>{this.$router.push({path:`/order/ordinary-express/edit`,query:{id:params.row.id}})}}>编辑</Button>
                  <Button disabled={this.noManagePerm} type="text" onClick={() => {
                    this.handleDelete({id: params.row.id});
                  }}>删除</Button>
                </div>
              );
            }
          }
        ],
        // 选中项
        selectRows: [],
        isSelectAll: false
      };
    },
    computed: {
      getData(){
        return this.data.map(item=>{
          item._disabled=this.noManagePerm
          return item
        })
      },
      // 下方按钮是否可操作
      selectDisabled() {
        return this.selectRows.length === 0;
      },
      noManagePerm(){
        return !this.$getPermMap("order.dispatch.manage");
      }
    },
    methods: {
      handlePageChange(page) {
          this.$emit('on-page-change', page);
      },
      // 选中项发生变化
      selectChange(selection) {
        this.selectRows = selection;
        this.isSelectAll = this.selectRows.length === this.data.length;
      },
      // 表格下方全选按钮
      checkboxChange(status) {
        this.$refs['table'].selectAll(status);
        this.data.forEach((item, index) => {
          this.$set(this.data[index], '_checked', status);
        });
        if (status) {
          this.selectRows = this.data;
        } else {
          this.selectRows = [];
        }
      },
      // 删除
      handleDelete({type, id}) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认彻底删除此快递模版？',
          onOk: () => {
            let ids;
            if (type && type === 'multiple') {
              ids = this.selectRows.map(item => item.id);
            } else {
              ids = [id];
            }
            this.$api.orderApi.deleteExpressStyle({ids})
              .then(res => {
                if (res.error === 0) {
                  this.$Message.success('快递模板删除成功');
                  this.$emit('on-refresh');
                }
              });
          },
          onCancel: () => {
          }
        });
      },
      // 改变状态
      setStatus({type, status, id}) {
        let content, ids;
        if (type === 'start') {
          content = '确认启用模板？';
        } else if (type === 'close') {
          content = '确认禁用模板?';
        }
        if (id) {
          ids = [id];
        } else {
          ids = this.selectRows.map(item => item.id);
        }
        this.setTemplateStatus(ids, status, content);
      },
      setTemplateStatus(ids, status, content) {
        this.$Modal.confirm({
          title: '提示',
          content,
          onOk: () => {
            this.$api.orderApi.setExpressStyleState({ids: ids, state: status})
              .then(res => {
                if (res.error === 0) {
                  this.$Message.success('快递模板状态修改成功');
                  this.$emit('on-refresh');
                }
              });
          },
          onCancel: () => {
          }
        });
      },
      // 设置是否为默认
      setDefault(id, status) {
        this.$api.orderApi.setExpressStyleDefault({id, is_default: status})
          .then(res => {
            if (res.error === 0) {
              this.$Message.success('快递模板默认设置成功');
              this.$emit('on-refresh');
            }
          });
      },
      reset(page) {
        this.$refs['page'].reset(page);
        this.initFooterData();
      },
      // 初始化下方的checkbox
      initFooterData() {
        this.isSelectAll = false;
        this.selectRows = [];
      },
    }
  };
</script>

<style lang="scss">
    .good-list-table-list {
        .ivu-table {
            td {
                // 名称
                .ordinary-express-name {
                    >span {
                        margin-right: 4px;
                    }
                }

                // 计费方式
                .recharge-way {
                    @include font-12-16;

                    > .piece {
                        color: $success-color;
                        background-color: $success-light;
                        padding: 2px 8px;
                    }

                    > .weight {
                        color: $warning-color;
                        background-color: $warning-light;
                        padding: 2px 8px;
                    }
                }

                .status {
                    .enable {
                        color: $success-color;
                    }

                    .disabled {
                        color: $text-third;
                    }
                }

                .action {
                    margin-right: -8px;

                    .ivu-btn-text {
                        margin-right: 8px;
                    }
                }
            }
        }

        .footer-action {
            padding: 16px 0;
            .ivu-checkbox-default {
                margin-right: 0;
                width: 40px;
                text-align: center;

                > span {
                    /*&:last-child {*/
                    /*    display: none;*/
                    /*}*/
                }
            }

            .ivu-btn-default {
                width: inherit;
                margin-left: 10px;
            }
        }

        .footer-page {
            border-top: 1px solid $border-color;
            padding: 20px 0;
            display: flex;
            justify-content: center;
        }
    }

    // 预览
    .table-list-poptip {
        text-align: center;

        > img {
            width: 150px;
            height: 150px;
        }

        .text {
            @include font-12-16;
            color: $text-second;
            padding-top: 10px;
        }

        .ivu-btn-text {
            @include font-12-16;
        }
    }
</style>
