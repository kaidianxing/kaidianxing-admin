/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
  <kdx-content-bar>
    <kdx-header-bar class="header">
      <Button type="primary" @click="isShow = true" :disabled="noManagePerm"
        >+添加企业</Button
      >
      <Form ref="form" class="form_wraps" inline :label-width="120" @submit.native.prevent>
        <FormItem label="企业名称：" prop="company_name">
          <Input
            type="text"
            v-model="company_name"
            placeholder="请输入企业名称"
            @on-enter="handleSearch"
          />
        </FormItem>
        <div class="ivu-form-item-btn">
          <Button type="primary" @click="handleSearch">搜索</Button>
          <Button type="text" @click="handleReset">重置</Button>
        </div>
      </Form>
    </kdx-header-bar>
    <div class="content">
      <div class="table-list">
        <Table
          ref="table"
          :columns="columns"
          :data="data"
          :loading="loading"
        ></Table>
      </div>
      <div class="footer-page">
        <kdx-page-component
          :current="page.page"
          ref="page"
          :total="total"
          @on-change="handlePageChange"
        ></kdx-page-component>
      </div>
    </div>
    <kdx-modal-frame
      :value="isShow"
      title="添加企业"
      width="700"
      ok-text="保存"
      ok-cancel="取消"
      @on-ok="save"
      @on-cancel="hide"
    >
      <div class="company_modal_wrap">
        <Form
          ref="form_modal"
          class="form_wraps"
          :model="model"
          :rules="rules"
          inline
          :label-width="120"
        >
          <FormItem label="企业ID：" prop="corp_id">
            <Input
              type="text"
              v-model="model.corp_id"
              placeholder="请输入企业ID"
              class="width-500"
            ></Input>
            <kdx-hint-text
              content="请输入正确的企业微信ID，同小程序后台配置的企业ID保持一致，否则小程序无法发起会话"
            ></kdx-hint-text>
          </FormItem>
          <FormItem label="企业名称：" prop="name">
            <Input
              maxlength="30"
              show-word-limit
              type="text"
              v-model="model.name"
              placeholder="请输入企业名称"
              class="width-500"
            ></Input>
          </FormItem>
        </Form>
      </div>
    </kdx-modal-frame>
  </kdx-content-bar>
</template>

<script>
export default {
  name: "company_manage",
  props: {},
  data() {
    return {
      isShow: false,
      company_name: "",
      model: {
        corp_id: "",
        name: "",
        id: "",
      },
      columns: [
        {
          title: "企业ID",
          key: "corp_id",
        },

        {
          title: "企业名称",
          key: "name",
        },
        {
          title: "企业客服数",
          key: "count",
        },
        {
          title: "创建时间",
          key: "create_time",
        },
        {
          title: "操作",
          key: "action",
          with: 150,
          render: (h, params) => {
            return (
              <div>
                <a
                  class={this.noManagePerm ? "disabled-btn" : "btn-item"}
                  onClick={() => {
                    if (this.noManagePerm) return;
                    this.editShow(params.row);
                  }}
                >
                  编辑
                </a>
                <a
                  onClick={() => {
                    if (this.noManagePerm) return;
                    this.delConfirm(params.row.id);
                  }}
                  class={this.noManagePerm ? "disabled-btn" : "btn-item"}
                >
                  删除
                </a>
              </div>
            );
          },
        },
      ],
      data: [],
      total: 0,
      page: {
        pagesize: 10,
        page: 1,
      },
      loading: false,

      rules: {
        corp_id: [{ required: true, message: "请输入企业ID" }],
        name: [{ required: true, message: "请输入企业名称" }],
      },
    };
  },

  computed: {
    noManagePerm() {
      //管理权限
      return !this.$getPermMap("wechatCustomerService.company.manage");
    },
  },
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    //添加企业
    save() {
      this.$refs.form_modal.validate((valid) => {
        if (!valid) return;
        console.log(this.model.id);
        this.model.id ? this.editCompany() : this.addCompany();
      });
    },
    addCompany() {
      this.$api.customerApi.addCompany(this.model).then((res) => {
        const { error } = res;
        if (error == 0) {
          this.$Message.success("保存成功");
          this.getList();
          this.hide();
        }
      });
    },
    editCompany() {
      this.$api.customerApi.editCompany(this.model).then((res) => {
        const { error } = res;
        if (error == 0) {
          this.$Message.success("编辑成功");
          this.getList();
          this.hide();
        }
      });
    },

    hide() {
      this.$refs.form_modal.resetFields()
      this.isShow = false;
      this.model = {
        corp_id: "",
        name: "",
        id: "",
      }
    },

    //编辑
    editShow(company) {
      this.isShow = true;
      this.model = { ...company };
      console.log(company);
    },

    //删除
    delConfirm(id) {
      this.$Modal.confirm({
        title: "您确定要删除当前企业？",
        content:
          "<div style='color:#ff0000c7;'>删除后该企业下的客服链接将失效，如果咨询入口已正式对外，建议先下掉咨询入口后再删除账号</div>",
        onOk: () => {
          this.del(id);
        },
      });
    },
    del(id) {
      this.$api.customerApi.delCompany({ id: id }).then((res) => {
        const { error } = res;
        if (error == 0) {
          console.log(res);
          this.getList();
          this.$Message.success("删除成功");
        }
      });
    },

    /*
     * 页码改变
     *@params {page} 页码改变对象
     */
    handlePageChange(page) {
      this.page.page = page.pageNumber;
      this.page.pagesize = page.pageSize;
      this.getList();
    },
    handleSearch() {
      this.getList();
    },

    handleReset() {
      this.company_name = "";
      this.page.page = 1;
      this.getList();
    },

    getList() {
      const params = {
        name: this.company_name,
        ...this.page,
        only_list: 0,
      };
      this.$api.customerApi.getCompanyList(params).then((res) => {
        const {
          error,
          data: { list, total },
        } = res;
        if (error == 0) {
          this.data = list;
          this.total = total;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.search .content {
  width: 100%;
  padding: 0 20px;
}
.form_wraps {
  float: right;
}
/deep/.btn-item {
  margin-left: 10px;
}
/deep/.disabled-btn {
  margin-left: 10px;
  color: #262b3099;
}
.company_modal_wrap {
  margin: 40px 0 80px;
}
.header {
    margin-top: 20px;
}
.content {
    padding: 0 20px;
    background: #fff;
}
</style>