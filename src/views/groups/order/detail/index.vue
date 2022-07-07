<template>
    <div class="order-detail" v-loading="loading">
        <div class="steps">
            <Steps :current="current">
                <Step title="已开团" :content="info.create_time"></Step>
                <Step :title="lastStep" :status="status" :content="lastTime"></Step>
            </Steps>
        </div>
        <div class="box">
            <order-status :data="info" :user-list="list" @on-change="confirmGroups"></order-status>
            <order-list :data="table.list" :info="info" @on-order="routeOrder"></order-list>
        </div>
    </div>
</template>

<script>
import OrderList from "./components/OrderList";
import OrderStatus from "./components/OrderStatus";

export default {
    name: "index",
    components: {
        OrderList,
        OrderStatus
    },
    data() {
        return {
            info: {},
            list: [],
            table: {
              list: []
            },
            id: '',
            loading: false,
            current: 1,
            lastStep: '待成团',
            lastTime: '',
            status: 'process',
            countInterval: null,
        };
    },
    mounted() {
        this.id = this.$route.query?.id || '';
        this.getData();
    },
    beforeDestroy() {
        clearInterval(this.countInterval);
    },
    methods: {
        getData() {
            this.loading = true;
            this.$api.groupsApi.getGroupsOrderDetail({id: this.id}).then(res => {
                if (res.error === 0) {
                    this.lastStep = '待成团';
                    this.lastTime = '';
                    this.info = res.groups_detail;
                    this.list = res.team_detail || [];
                    let list = []
                     this.list.forEach(item => {
                        if (item.order_no) {
                            list.push(item);
                        }
                    });
                    this.table.list = list;
                    this.status = 'process';
                    if (res.groups_detail?.success == 0) {
                        this.current = 1;
                        this.info.end_time && this.setCount();
                    } else if (res.groups_detail?.success == 1) {
                        this.current = 2;
                        this.lastStep = '拼团成功';
                        this.lastTime = this.info.success_time;
                    } else {
                        this.current = 1;
                        this.lastStep = '拼团失败';
                        this.status = 'error';
                        this.lastTime = this.info.end_time;
                    }
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        setCount() {
            clearInterval(this.countInterval);
            this.countDown();
            this.countInterval = setInterval(() => {
                this.countDown();
            }, 1000);
        },
        // 成团倒计时
        countDown() {
            let timeNum = new Date(this.info.end_time).getTime() / 1000;
            let time = this.$utils.countDown(timeNum, false, true);
            let timeKey = ['天', '时', '分', '秒'];
            let res = '';
            if (time) {
                time.forEach((item, index) => {
                    if (item) {
                        res += item + timeKey[index];
                    }
                });
                this.$set(this.info, 'countTime', res);
            } else {
                // this.$set(this.info, 'countTime', '');
                clearInterval(this.countInterval);
                this.getData();
            }
        },
        confirmGroups() {
            this.$Modal.confirm({
                title: '手动确认成团?',
                content: '此团下有待支付订单，确认成团后，待支付订单将自动关闭。',
                onOk: () => {
                    this.$api.groupsApi.confirmGroups({id: this.id, success: 1}).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('拼团成功');
                            this.getData();
                        }
                    });
                }
            });
        },
        routeOrder(orderNo) {
            this.$utils.openNewWindowPage('/order/list/all', {
                keywords: orderNo,
                search_field: 'order_no'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.order-detail {
    margin-top: 20px;
    position: relative;

    .steps {
        background-color: #ffffff;
        padding: 20px;

        .ivu-steps {
            max-width: 600px;
            margin: 0 auto;
        }
    }

    .box {
        background-color: #ffffff;
        margin-top: 10px;
    }
}
</style>
