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
    <kdx-modal-frame v-model="value" title="订单发货" :width="700" :loading="loading" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <div class="send-goods-modal">
            <Form v-if="value" ref="form" :model="order" :rules="rules" :label-width="120" @submit.native.prevent>
                <FormItem label="处理方式：" class="r-form-item-checkbox" v-if="dispatch_type === '10'">
                    <RadioGroup v-model="order.type">
                        <Radio label="1" :disabled="disabled">整单发货</Radio>
                        <Radio label="0" :disabled="disabled">分包裹发货</Radio>
                    </RadioGroup>
                </FormItem>
                <!--分包裹商品-->
                <div class="shop-more" v-if="order.type === '0' && dispatch_type === '10'">
                    <kdx-hint-alert class="alert">选择需要发货的商品</kdx-hint-alert>
                    <send-goods-list :data="data.order_goods"
                                     @on-change="changeSendGoods"></send-goods-list>
                </div>
                <FormItem label="收货人姓名：" class="r-form-item-text">
                    {{data.buyer_name}}
                </FormItem>
                <FormItem label="联系方式：" class="r-form-item-text">
                    {{data.buyer_mobile}}
                </FormItem>
                <FormItem label="收货地址：" class="r-form-item-text">
                    {{data.address}}
                </FormItem>
                <FormItem label="快递公司：" prop="express_id" v-if="dispatch_type === '10'">
                    <select-express :value.sync="order.express_id" :option-data="express"
                                    class="width-340"></select-express>
                </FormItem>
                <FormItem label="自定义名称：" prop="express_name" v-if="order.express_id==96">
                    <Input v-model="order.express_name" class="width-340" placeholder="请输入" maxlength="6" show-word-limit @on-enter="handleOk"/>
                    <kdx-hint-text>其他快递不支持物流查询，不支持打印电子面单</kdx-hint-text>
                </FormItem>
                <FormItem label="快递单号：" prop="express_code" v-if="dispatch_type === '10'">
                    <Input v-model="order.express_code" class="width-340" placeholder="请输入" @on-enter="handleOk"/>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
  import SelectExpress from "../SelectExpress";
  import SendGoodsList from './components/GoodsList';

  export default {
    name: "SendGoods",
    components: {SelectExpress, SendGoodsList},
    props: {
      id: {
        type: String
      },
      dispatch_type: {
          type: [String, Number],
      },
    },
    data() {
      return {
        value: false,
        order: {
          express_code: '', // 快递单号
          express_id: '', // 快递公司
          goodsId: [], // 商品id
          type: '1',
          city_distribution_type: '0', // 0商家配送 1达达 2码科
          express_name  : '其他快递', //自定义其他快递名称
        },
        // 类型，是否禁止操作，当为一件商品和多包裹发货时禁用
        disabled: false,
        data: {},
        message: '',
        express: [],
        rules: {
          express_id: [
            {required: true, message: '快递公司必填'}
          ],
          express_code: [
            {required: true, message: '快递单号必填'}
          ],
          city_distribution_type: [
            {required: true, message: '配送方式必选'}
          ],
          express_name: [
            {required: true, message: '自定义名称必填'}
          ],
        },
        loading: false
      };
    },
    methods: {
      setValue() {
        this.value = !this.value;
        if (this.value) {
          this.resetModel();
          this.getData();
        }
      },
      handleCancel() {
        this.setValue();
      },
      handleOk() {
        if (this.message) {
          this.$Message.error(this.message);
          return;
        }
        this.$refs['form'].validate(valid => {
          if (valid) {
            let params = {}, message;
            if (this.order.type === '1') {
              let order_goods_id = this.data.order_goods.map(item => item.id);
              // 按照订单发货
              params = {
                more_package: '0',
                order_id: this.id,
                no_express: '0',
                express_id: this.order.express_id,
                express_sn: this.order.express_code,
                order_goods_id,
              };
              if(this.order.express_id==96) {
                params.express_name = this.order.express_name
              }else {
                  delete params.express_name
              }
              message = '订单发货成功';
            } else if (this.order.type === '0') {
              // 分包裹
              params = {
                more_package: '1',
                order_id: this.id,
                no_express: '0',
                order_goods_id: this.order.goodsId,
                express_id: this.order.express_id,
                express_sn: this.order.express_code,
                express_name: this.order.express_name,
              };
                if(this.order.express_id!=96) {
                    delete params.express_name
                }
              if (!params.order_goods_id?.length) {
                let _message = ''
                  _message = '请选择要发货的包裹'
                this.$Message.error(_message);
                return;
              }
              message = '分包裹发货成功';
            }
              this.loading = true;
            this.$api.orderApi.setSendGoods(params)
              .then(res => {
                if (res.error === 0) {
                  this.$Message.success(message);
                  this.setValue();
                  this.$emit('on-refresh');
                }
              }).finally(() => {
                  this.loading = false;
            });
          }
        });
      },
      // 选中/取消选中商品列表
      changeSendGoods(id) {
        let index = this.order.goodsId.indexOf(id),
          goodsArr = this.order.goodsId ? this.order.goodsId : [];
        if (index > -1) {
          goodsArr.splice(index, 1);
        } else {
          goodsArr.push(id);
        }
        this.order.goodsId = goodsArr;
        this.initGoodsData();
      },
      // 初始化data,添加选中属性
      initGoodsData() {
        this.data.order_goods.forEach((item, index) => {
          if (this.order.goodsId.indexOf(item.id) > -1) {
            this.$set(this.data.order_goods[index], 'checked', true);
          } else {
            this.$set(this.data.order_goods[index], 'checked', false);
          }
        });
      },
      // 获取数据
      getData() {
        this.loading = true;
        this.$api.orderApi.getSendGoods({order_id: this.id})
          .then(res => {
            this.loading = false;
            if (res.error === 0) {
              this.message = '';
              this.express = res.express;
              this.$nextTick(() => {
                this.data = res;
              });
              if (res.order_goods.length <= 1) {
                this.disabled = true;
              } else {
                this.disabled = false;
                res.order_goods.forEach(item => {
                  if (item.status === '11' || item.can_send != '1') {
                    this.disabled = true;
                    this.order.type = '0';
                  }
                });
              }
            } else {
              this.message = res.message;
            }
          });
      },
      resetModel() {
       // this.$refs['form']?.resetFields();
        this.order = {
          express_code: '', // 快递单号
          express_id: '', // 快递公司
          goodsId: [], // 商品id
          type: '1',
          express_name: '其他快递',
        };
        this.express = [];
        this.disabled = false;
      }
    },
  };
</script>

<style lang="scss">
    .send-goods-modal {
        padding: 30px 0;

        .ivu-form {
            .ivu-form-item {
                margin-bottom: 20px;
                .ivu-form-item-label {
                    padding-right: 0;
                }
            }
        }

        .ivu-table {
            .ivu-table-header {
                .ivu-table-cell {
                    padding: 10px 15px;
                }
            }
        }

        .shop-more {
            margin: 0 40px 20px 40px;
            padding: 20px;
            background-color: $background-color;

            > .alert {
                margin-bottom: 10px;
            }
        }
    }
    .open-dispatch {
        color: $brand-color;
        cursor: pointer;
    }
</style>
