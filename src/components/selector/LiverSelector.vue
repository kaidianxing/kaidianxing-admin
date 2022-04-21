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
  <kdx-modal-frame
    :value="value"
    title="直播间选择器"
    :width="850"
    class-name="select-page-type-modal"
    @on-cancel="handleCancel"
    @on-ok="handleOk"
    ok-text="保存"
  >
    <div class="select-page-type">
      <div class="type-content">
        <div class="search">
          <Input
            v-model="search.keywords"
            search
            enter-button="搜索"
            placeholder="请输入"
            @on-search="handleSearch"
            class="width-250"
          />
        </div>
        <Table
          ref="table"
          :columns="columns"
          :data="table.data"
          v-loading="table.loading"
        ></Table>
        <kdx-page-component
          class="pagation"
          ref="page"
          :total="table.total"
          @on-change="handlePageChange"
        ></kdx-page-component>
      </div>
    </div>
  </kdx-modal-frame>
</template>

<script>

export default {
  name: 'LiverSelector',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    current: {
      type: [String, Object],
      default: () => { }
    },
    currentList: {
      type: Array,
      default: () => []
    },

    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number
    },
  },

  data() {
    return {
      show: true,
      page: {
        pageSize: 10,
        pageNumber: 1,
      },
      search: {
        keywords: ''
      },
      table: {
        total: 30,
        data: [],
        loading: false
      },
      columns: [{
        title: '直播间ID',
        key: 'id',
        width: 100,
      }, {
        title: '直播间信息',
        width: 400,
        render: (h, params) => {
          return (
            <div class="liver-info">
              <img src={ this.$utils.getWechatImg(params.row.share_img) ||this.$utils.staticImg('decorate/goods_col2.png')} class="liver-thumb" />
              <div class="two-line-hide liver-title">{params.row.title}</div>
            </div>
          )
        },

      }, {
        title: '直播状态',
        render: (h, params) => {
          let statusInfo = {
            '101': { text: '直播中', status: 'pending' },
            '102': { text: '未开始', status: 'wait' },
            '103': { text: '已结束', status: 'finished' },
            '104': { text: '禁播', status: 'finished' },
            '105': { text: '暂停', status: 'finished' },
            '106': { text: '异常', status: 'finished' },
            '107': { text: '已过期', status: 'finished' },
          }

          return (
            <div class={'liver-status ' + statusInfo[params.row.status]?.status || 'wait'}>{statusInfo[params.row.status]?.text}</div>
          )
        },
      }, {
        title: '操作',
        width: 80,
        render: (h, params) => {
          let temp;
          if (params.row.checked) {
            temp = <Button type="primary" onClick={() => this.setChecked(params.index, false)}>已选</Button>
          } else {
            temp = <Button type="default" onClick={() => this.setChecked(params.index, true)}>选择</Button>
          }
          return (
            temp
          )
        }
      }],
      selectRows: [],
      selectRow: {}
    }
  },
  created(){
    this.getLivers()
  },
  watch: {
    value: {
      handler(val) {
        // 当val为true时表示弹窗打开
        if (val) {
          if (this.multiple) {
            this.selectRows = [...this.currentList] || [];
          } else {
            this.selectRow = this.current || {};
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSearch() {
      this.resetPage()
      this.getLivers()
    },
    resetPage() {
      this.page = {
        pageSize: 10,
        pageNumber: 1
      }
      this.$refs['page']?.reset()
    },
    getLivers() {
      this.table.loading = true
      let params = {
        pagesize: this.page.pageSize,
        page: this.page.pageNumber,
        ...this.search,
      }
      this.$api.liverApi
        .decorateLiver(params)
        .then((res) => {
          if (res.error === 0) {
            this.table.data = res.list
            this.table.total = res.total
            this.table.loading = false
            this.defaultChecked()
          }
        })
        .catch()
    },
    handlePageChange(page) {
      this.page = page;
      this.getLivers()
      try{
        document.querySelectorAll('.select-page-type-modal .ivu-modal-body  .content')[0].scrollTop =0;
      }catch(err){
        console.log(err)
      }
    },
    setChecked(index, isChecked) {
      if (this.multiple) {
        if (this.limit && this.selectRows.length === this.limit && isChecked) {
          this.$Message.error('已超出最大可选数量');
          return;
        }
        this.$set(this.table.data[index], 'checked', isChecked)
        if (this.selectRows.length === 0) {
          this.selectRows.push(this.table.data[index])
        } else {
          if (isChecked) {
            this.selectRows.push(this.table.data[index])
          } else {
            this.selectRows =this.selectRows.filter(item=> item.id!==this.data[index].id)
          }
        }
      } else {
        // 单选
        if (isChecked) {
          this.table.data.forEach((item, i) => {
            this.$set(this.table.data[i], 'checked', false)
          })
          this.$set(this.table.data[index], 'checked', true)
          this.selectRow = this.table.data[index]
        } else {
          this.$set(this.table.data[index], 'checked', false)
          this.selectRow = {}
        }
      }
    },
    // 进行默认选中
    defaultChecked() {
      if (this.multiple) {
        this.table.data.forEach((item, index) => {
          for (let current of this.selectRows) {
            if (current.id === item.id) {
              this.$set(this.table.data[index], 'checked', true)
              break
            }
          }
        })
      } else {
        this.table.data?.forEach((item, index) => {
          if (this.selectRow && item.id === this.selectRow.id) {
            this.$set(this.table.data[index], 'checked', true)
          } else {
            this.$set(this.table.data[index], 'checked', false)
          }
        })
      }
    },
    handleOk() {
      if (this.multiple) {
        this.$emit('on-change', this.selectRows)
      } else {
        this.$emit('on-change', this.selectRow)
      }
      this.handleCancel()

    },
    handleCancel() {
      this.$emit('input', false)
    },
  }
}
</script>

<style lang="scss" scoped>
.select-page-type {
  padding: 20px 40px;
  background-color: #fff;
  .type-content {
  }
  /deep/ .ivu-table-cell {
    padding: 10px 15px;
    text-overflow: clip;
  }
}

/deep/ .liver-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .liver-thumb {
    margin-right: 10px;
    width: 100px;
    height: 80px;
    border-radius: 2px;
  }

  .liver-title {
    font-size: 14px;
    line-height: 20px;
    color: #262b30;
  }
}

/deep/ .liver-status {
  display: inline-block;
  border-radius: 2px;
  padding: 0 8px;
  height: 24px;
  font-size: 14px;
  text-align: center;
  line-height: 24px;

  &.pending {
    background: #edfff3;
    color: #19be6b;
  }

  &.wait {
    background: #f4f6f8;
    color: #939799;
  }

  &.complete {
    background: #fff9e6;
    color: #ff9900;
  }
}

.pagation {
  margin-top: 20px;
  text-align: center;
}
</style>
