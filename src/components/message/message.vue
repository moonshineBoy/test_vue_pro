<style lang="less" rel="stylesheet/less">
  @import './message.less';
</style>

<template>
  <div class="message-main-con">
    <div class="message-mainlist-con">
      <div>
        <Button @click="setCurrentMesType()" size="large" long type="text">
          <transition name="mes-current-type-btn">
            <Icon v-show="currentMessageType === 'unread'" key="1" type="checkmark"></Icon>
          </transition>
          <span class="mes-type-btn-text">全部消息</span>
          <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="unreadCount"></Badge>
        </Button>
      </div>
      <div>
        <Button @click="setCurrentMesType('unread')" size="large" long type="text">
          <transition name="mes-current-type-btn">
            <Icon v-show="currentMessageType === 'unread'" key="1" type="checkmark"></Icon>
          </transition>
          <span class="mes-type-btn-text">未读消息</span>
          <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="unreadCount"></Badge>
        </Button>
      </div>
      <div>
        <Button @click="setCurrentMesType('hasread')" size="large" long type="text">
          <transition name="mes-current-type-btn">
            <Icon v-show="currentMessageType === 'hasread'" key="1" type="checkmark"></Icon>
          </transition>
          <span class="mes-type-btn-text">已读消息</span>
          <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="hasreadCount"></Badge>
        </Button>
      </div>
      <div>
        <Button @click="setCurrentMesType('recyclebin')" size="large" long type="text">
          <transition name="mes-current-type-btn">
            <Icon v-show="currentMessageType === 'recyclebin'" key="1" type="checkmark"></Icon>
          </transition>
          <span class="mes-type-btn-text">回收站</span>
          <Badge class="message-count-badge-outer" class-name="message-count-badge" :count="recyclebinCount"></Badge>
        </Button>
      </div>
    </div>
    <div class="message-content-con">
      <transition name="view-message">
        <div v-if="showMesTitleList" key="1" class="message-title-list-con">
          <Table ref="messageList" :columns="mesTitleColumns" :data="currentMesList" :no-data-text="noDataText"></Table>
        </div>
      </transition>
      <transition name="back-message-list">
        <div v-if="!showMesTitleList" key="1" class="message-view-content-con">
          <div class="message-content-top-bar">
            <span class="mes-back-btn-con"><Button type="text" @click="backMesTitleList"><Icon
              type="chevron-left"></Icon>&nbsp;&nbsp;返回</Button></span>
            <h3 class="mes-title">{{ mes.title }}</h3>
          </div>
          <p class="mes-time-con">
            <Icon type="android-time"></Icon>
            &nbsp;&nbsp;{{ mes.ctime |formatData }}
          </p>
          <div class="message-content-body">
            <p class="message-content">{{ mes.content }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'message',
    data () {
      const markAsreadBtn = (h, params) => {
        return h('Button', {
          props: {
            size: 'small'
          },
          on: {
            click: () => {
              this.hasreadMesList.unshift(this.currentMesList.splice(params.index, 1)[0]);
            }
          }
        }, '标为已读');
      };
      const deleteMesBtn = (h, params) => {
        return h('Button', {
          props: {
            size: 'small',
            type: 'error'
          },
          on: {
            click: () => {
              this.recyclebinList.unshift(this.hasreadMesList.splice(params.index, 1)[0]);
            }
          }
        }, '删除');
      };
      const restoreBtn = (h, params) => {
        return h('Button', {
          props: {
            size: 'small'
          },
          on: {
            click: () => {
              this.hasreadMesList.unshift(this.recyclebinList.splice(params.index, 1)[0]);
            }
          }
        }, '还原');
      };
      return {
        currentMesList: [],
        unreadMesList: [],
        hasreadMesList: [],
        recyclebinList: [],
        currentMessageType: 'unread',
        showMesTitleList: true,
        unreadCount: 0,
        hasreadCount: 0,
        recyclebinCount: 0,
        noDataText: '暂无未读消息',
        mes: {},
        mesTitleColumns: [
          {
            title: ' ',
            key: 'title',
            align: 'left',
            ellipsis: true,
            render: (h, params) => {
              return h('a', {
                style: {},
                on: {
                  click: () => {

//                                  this.mes.title = params.row.title;
//                                  this.mes.time = this.formatDate(params.row.time);
                    this.getContent(params.row.id);
                  }
                }
              }, params.row.title);
            }
          },
          {
            title: ' ',
            key: 'ctime',
            align: 'center',
            width: 180,
            render: (h, params) => {
              return h('span', [
                h('Icon', {
                  props: {
                    type: 'android-time',
                    size: 12
                  },
                  style: {
                    margin: '0 5px'
                  }
                }),
                h('span', {
                  props: {
                    type: 'android-time',
                    size: 12
                  }
                }, this.$api.gettime(params.row.ctime))
              ]);
            }
          },
          {
            title: ' ',
            key: 'asread',
            align: 'center',
            width: 100,
            render: (h, params) => {
              if (this.currentMessageType === 'unread') {
                return h('div', [
                  markAsreadBtn(h, params)
                ]);
              } else if (this.currentMessageType === 'hasread') {
                return h('div', [
                  deleteMesBtn(h, params)
                ]);
              } else {
                return h('div', [
                  restoreBtn(h, params)
                ]);
              }
            }
          }
        ]
      };
    },
    methods: {
      backMesTitleList () {
        this.showMesTitleList = true;
      },
      setCurrentMesType (type) {
        if (this.currentMessageType !== type) {
          this.showMesTitleList = true;
        }
        this.currentMessageType = type;
        if (type === 'unread') {
          this.noDataText = '暂无未读消息';
          this.currentMesList = this.unreadMesList;
        } else if (type === 'hasread') {
          this.noDataText = '暂无已读消息';
          this.currentMesList = this.hasreadMesList;
        } else {
          this.noDataText = '回收站无消息';
          this.currentMesList = this.recyclebinList;
        }
      },
      getContent (id) {
        this.$http.get('/api/user_commonmanage/commondisplay/usermassages/' + id + '/').then(function (res) {
          this.mes = res.data;
          this.showMesTitleList = false;
        }.bind(this))
      }
    },
    mounted () {
      this.getdata();
      this.unreadCount = this.unreadMesList.length;
      this.hasreadCount = this.hasreadMesList.length;
      this.recyclebinCount = this.recyclebinList.length;
    },
    methods: {
      getdata(){
        this.$http.get('/api/user_commonmanage/commondisplay/usermassages/list/') //
          .then(function (response) {
            this.currentMesList = response.data;
          }.bind(this))
      }
    },
    created(){

    },
    watch: {
      unreadMesList (arr) {
        this.unreadCount = arr.length;
      },
      hasreadMesList (arr) {
        this.hasreadCount = arr.length;
      },
      recyclebinList (arr) {
        this.recyclebinCount = arr.length;
      }
    }
  };
</script>

