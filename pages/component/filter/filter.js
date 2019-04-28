// pages/component/filter/filter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods_obj:Object,
    // 按钮
    filter_btns:Array,
    // 是否升序
    is_price_asc:Boolean,
    // 是否降序
    is_price_desc:Boolean,
    // 是否隐藏过滤弹窗
    is_hidden_screen_box:Boolean,
    // 过滤弹窗中的按钮
    screen_btns:Array,
    // 商品销量
    goods_sale:Number,
    // 最低价
    low_price:Number,
    // 最高价
    high_price:Number
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变排序方式
    changeSortWay: function (event) {
      var temp = this.data.sort_way;
      var index = event.currentTarget.dataset.index;
      // 变颜色
      if (index < 3) {
        if (index != temp) {
          var s = '';
          for (var i = 0; i < this.data.filter_btns.length; ++i) {
            s = 'filter_btns[' + i + '].is_select';
            this.setData({
              [s]: false
            })
          }
          s = 'filter_btns[' + index + '].is_select';
          this.setData({
            [s]: true
          })
        }
        // 隐藏筛选
        this.hideScreenBox();
        this.data.sort_way = index;
      }
      // 显示筛选侧栏
      if (index == 3) {
        this.setData({
          is_hidden_screen_box: false
        })
      }
      // 事件
      if (index < 2) {
        this.setData({
          is_price_asc: false,
          is_price_desc: false
        })
      }
      if (index == 0) {
        deleteProperty('sort');
      }
      if (index == 1) {
        addProperty('sort', 'goods_sale desc');
      }
      if (index == 2 && temp == 2) {
        if (this.data.is_price_asc) {
          this.setData({
            is_price_asc: false,
            is_price_desc: true
          })
          addProperty('sort', 'goods_price desc');
        } else {
          this.setData({
            is_price_asc: true,
            is_price_desc: false
          })
          addProperty('sort', 'goods_price asc');
        }
      }
      if (index == 2 && temp != 2) {
        this.setData({
          is_price_asc: true,
          is_price_desc: false
        })
        addProperty('sort', 'goods_price asc');
      }
    },
    // 隐藏筛选侧栏
    hideScreenBox: function () {
      this.setData({
        is_hidden_screen_box: true
      })
    },
    // 筛选事件
    changeScreen: function (event) {
      var index = event.currentTarget.dataset.index;
      var temp = index - 1;
      var s = 'screen_btns[' + temp + '].is_select';
      if (this.data.screen_btns[index - 1].is_select) {
        this.setData({
          [s]: false
        });
        deleteProperty(this.data.screen_btns[index - 1].an_name);
      } else {
        this.setData({
          [s]: true
        });
        if (index == 1 && this.data.screen_btns[1].is_select) {
          s = 'screen_btns[1].is_select';
          this.setData({
            [s]: false
          });
          if (goods_obj.hasOwnProperty('is_ju')) {
            delete goods_obj['is_ju'];
          }
        }
        if (index == 2 && this.data.screen_btns[0].is_select) {
          s = 'screen_btns[0].is_select';
          this.setData({
            [s]: false
          });
          if (goods_obj.hasOwnProperty('is_qiang')) {
            delete goods_obj['is_qiang'];
          }
        }
        addProperty(this.data.screen_btns[index - 1].an_name, '1');
      }

    },
    // 滚动事件
    scrollGoodsList: function (event) {
      // console.log(event.detail);
      if (event.detail.scrollTop > this.data.scroll_goods_list.height && this.data.is_hidden_top) {
        this.setData({
          is_hidden_top: false
        })
      } else if (event.detail.scrollTop < this.data.scroll_goods_list.height && !this.data.is_hidden_top) {
        this.setData({
          is_hidden_top: true
        })
      }
    },
    // 跳转详情页
    jumpToDetail: function (e) {
      var id = e.currentTarget.dataset.id;
      var url = "../../pages/detail/detail?id=" + id;
      wx.navigateTo({
        url: url
      })
    },
    // 跳转到领券
    jumpToCoupon: function (e) {
      var coupon = e.currentTarget.dataset.url.split("?");
      var temp = coupon[1].split('&');
      var sellerId = temp[0].split('=')[1];
      var activityId = temp[1].split('=')[1];
      var url = "../../pages/coupon/coupon?sellerId=" + sellerId + "&activityId=" + activityId;
      wx.navigateTo({
        url: url
      })
    },
    // 滑动到底部加载更多
    scrollLowerEvent: function () {
      loadNextPage();
    },
    // 回到顶部
    scrollToTop: function () {
      this.setData({
        "scroll_goods_list.top": 0
      })
    },
    // 获取输入的销量值
    getInputSale: function (e) {
      if (e.detail.value != '') {
        this.data.goods_sale = e.detail.value;
      }
    },
    // 获取最低价
    getLowPrice: function (e) {
      if (e.detail.value != '') {
        this.data.low_price = e.detail.value;
      }
    },
    // 获取最高价
    getHighPrice: function (e) {
      if (e.detail.value != '') {
        this.data.high_price = e.detail.value;
      }
    },
    // 重置
    clear: function () {
      this.resetScreenBtns();
      this.resetInput();
      this.clearGoodsObj();
    },
    // 清理goods_obj
    clearGoodsObj: function () {
      var e = '';
      if (goods_obj['sort'] != undefined && goods_obj['sort'] != '') {
        e = goods_obj['sort'];
      }
      initGoodsObj();
      addProperty('sort', e);
    },
    // 重置筛选按钮
    resetScreenBtns: function () {
      var s = '';
      for (var i = 0; i < 3; ++i) {
        s = 'screen_btns[' + i + '].is_select';
        this.setData({
          [s]: false
        })
      }
    },
    // 重置input
    resetInput: function () {
      this.setData({
        goods_sale: '',
        low_price: '',
        high_price: ''
      })
    },
    // 确认
    confirm: function () {
      var flag = false;
      if (this.data.goods_sale != '') {
        goods_obj['sale_num'] = this.data.goods_sale;
        flag = true;
      }
      if (this.data.low_price != '') {
        goods_obj['start_price'] = this.data.low_price;
        flag = true;
      }
      if (this.data.high_price != '') {
        goods_obj['end_price'] = this.data.high_price;
        flag = true;
      }
      if (this.data.low_price != '' && this.data.high_price != '' && this.data.high_price < this.data.low_price) {
        var low = this.data.high_price;
        var high = this.data.low_price;
        goods_obj['start_price'] = low;
        goods_obj['end_price'] = high;
        this.setData({
          low_price: low,
          high_price: high
        })
      }
      if (flag) {
        var e = goods_obj['page_num'];
        addProperty('page_num', e);
      }
    }
  }
})
// 初始化goods_obj
function initGoodsObj() {
  goods_obj = {};
  if (cid != '0') {
    goods_obj['goods_cid'] = cid;
  }
  goods_obj['page_num'] = 1;
  goods_obj['page_size'] = 10;
  // goods_obj['is_ju'] = 1;
  // goods_obj['is_qiang'] = 1;
}

// 获取商品
function getGoods(callback) {
  wx.request({
    url: 'http://localhost:8088/getGoods',
    data: goods_obj,
    method: 'get',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      // 错误次数清零
      current_page.data.error_count = 0;
      if (res != null && res.data != null) {
        callback(res.data);
      }
    },
    fail: function (res) {
      current_page.data.error_count++;
      // 错误三次就无法请求
      if (current_page.data.error_count >= 3) {
        current_page.data.can_ajax = false;
      }
      console.log('请求错误' + res);
      closeLoading();
    }
  })
}

// 解析商品列表
function parseGoodsList(data) {
  // console.log(data.goods);
  if (data.goods != null) {
    if (current_page.data.is_clear_list) {
      current_page.setData({
        goods_list: data.goods
      })
    } else {
      current_page.setData({
        goods_list: current_page.data.goods_list.concat(data.goods)
      })
    }
  }
  // 关闭动画
  closeLoading();
  // 显示没有更多了提示
  if (data.goods == null || data.goods.length < goods_obj['page_size']) {
    current_page.setData({
      is_more_goods: false
    })
  }
  // 可以进行下一次ajax请求
  setTimeout(function () {
    current_page.data.can_ajax = true;
  }, 400)

  // 
}

// 从goods_obj中添加属性
function addProperty(name, value) {
  goods_obj['page_num'] = 1;
  goods_obj[name] = value;
  prepareGetGoods();
  console.log(goods_obj);
}

// 从goods_obj中删除属性
function deleteProperty(name) {
  if (goods_obj.hasOwnProperty(name)) {
    goods_obj['page_num'] = 1;
    delete goods_obj[name];
    prepareGetGoods();
  }
  console.log(goods_obj);
}

// 加载下一页
function loadNextPage() {
  if (current_page.data.is_more_goods && current_page.data.can_ajax) {
    current_page.data.can_ajax = false;
    // 不清空
    current_page.data.is_clear_list = false;
    // 显示加载动画
    current_page.setData({
      is_hidden_loading: false
    })
    var num = goods_obj['page_num'];
    goods_obj['page_num'] = num + 1;
    setTimeout(function () {
      getGoods(parseGoodsList);
    }, 600)
  }
}

// 准备请求排序商品数据
function prepareGetGoods() {
  if (current_page.data.can_ajax) {
    current_page.data.can_ajax = false;
    // 关闭"没有更多了..."提示
    current_page.setData({
      is_more_goods: true
    })
    // 清空数组标志
    current_page.data.is_clear_list = true;
    // 返回顶部并开启加载动画
    current_page.setData({
      'scroll_goods_list.top': 0,
      is_hidden_top_loading: false
    })
    setTimeout(function () {
      getGoods(parseGoodsList);
    }, 400)
  }
}

// 关闭动画
function closeLoading() {
  current_page.setData({
    is_hidden_loading: true,
    is_hidden_top_loading: true
  })
}