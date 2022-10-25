<template>
  <view>
    <view class="search-box">
      <!-- 使用 uni-ui 提供的搜索组件 -->
      <!-- 绑定input事件 通过radius设置圆角 cancelButton将取消按钮做出隐藏-->
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="SearchList.length!==0">
      <view class="sugg-item" v-for="(item, i) in SearchList" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag @click="gotoGoodsList(item)" type="primary" :text="item" v-for="(item, i) in historys" :key="i">
        </uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        kw: '',
        SearchList: [], // 关键字搜索数据存放列表
        // 搜索关键词的历史记录
        historyList: []
      };
    },
    onLoad() {
      // 页面初始化从本地存储中读取历史搜索记录并渲染
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    computed: {
      historys() {
        return [...this.historyList].reverse() // reverse方法会改变原来的数组
      }
    },
    methods: {
      // 输入框防抖处理,并将输入的关键字提取出一个变量去存放
      input(e) {
        // 触发事件先清除定时器   防抖
        clearTimeout(this.timer)
        // e. 就是最新输入的搜索内容
        // 开启定时器,在0.5秒内频繁触发事件什么都不执行，只有输入停止0.5秒之后才去触发内部代码
        this.timer = setTimeout(() => {
          this.kw = e
          this.getSearchList()
        }, 500)
      },
      // 关键字搜索数据获取，调用接口
      async getSearchList() {
        // 判断搜索关键字是否为空
        if (this.kw === '') {
          this.SearchList = []
          return
        }
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.SearchList = res.message
        // 关键字输入完毕，接口数据获取成功之后将输入的关键字存入定义的数组变量中并渲染到搜索历史页面
        this.saveSearchHistory()
      },
      // 点击搜索列表数据跳转到详情页
      gotoDetail(id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id =' + id
        })
      },
      // 保存搜索记录的方法
      saveSearchHistory() {
        this.historyList.push(this.kw)
        // this.historyList.unshift(this.kw)
        // 第一步：通过new Set()实现一个类数组,在历史记录数组原有的数据之上进行添加
        const set = new Set(this.historyList)
        // 第二部：在set对象中添加数据之前、先删除关键词对应的数据，如果对象中已有输入的关键词，先删除set对象中的关键词
        set.delete(this.kw)
        // 第三步：删除完毕之后在进行添加，这样关键字永远是最新的也不会重复
        set.add(this.kw)
        // 第四步：使用Array.from()将这个对象转化为数组并赋值给data的历史记录存放的数组
        this.historyList = Array.from(set)
        // 防止页面初始化搜索记录为空，所以将搜索过的关键字转为字符串，并存入本地存储，让页面在初始化的时候从本地存储中读取搜索历史纪录
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      gotoGoodsList(item){
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + item
        })
      },
     // 清空搜索历史记录
     clean() {
       // 清空 data 中保存的搜索历史
       this.historyList = []
       // 清空本地存储中记录的搜索历史
       uni.setStorageSync('kw', '[]')
     }
    }
  }
</script>

<style lang="scss">
  .uni-searchbar {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    position: relative;
    padding: 16rpx;
    /* 将默认的 #FFFFFF 改为 #C00000 */
    background-color: #c00000;
  }

  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
