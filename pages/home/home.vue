<template>
  <view>
    <view class="search-box">
        <my-search @myclick="handleClick"></my-search>
    </view>
    <!-- 轮播图区域 -->
    <!-- indicator-dots="true" 小圆点 -->
    <!-- autoplay自动播放 interval播放的间隔时间 circular开始轮播图自动播放 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <!-- 因为点击要跳转商品页,所以这里将view修改为声明式导航跳转到详情页 -->
        <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id" class="swiper-item">
          <img :src="item.image_src" alt="">
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航 -->
    <view class="nav-list">
      <view @click="navClickHandler(item)" class="nav-item" v-for="(item,index) in navList" :key="index">
        <img class="nav-img" :src="item.image_src">
      </view>
    </view>
    <!-- 楼层区域 -->
    <!-- 楼层容器 -->
    <view class="floor-list">
      <!-- 每一个楼层的item项 -->
      <view class="floor-item" v-for="(item,i) in floorList" :key="i">
        <img :src="item.floor_title.image_src" class="floor-title">
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <img :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width + 'rpx'}" mode="widthFix">
          </navigator>
          <!-- 右侧四个小盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item"  v-for="(item1,i1) in item.product_list" :key="i1" :url="item1.url">
              <img :src="item1.image_src" v-if="i1 !== 0" :style="{width: item1.image_width + 'rpx'}" mode="widthFix">
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        swiperList: [], // 轮播图存放变量
        navList: [], // 分类导航的数据存放变量
        floorList: [], // 楼层数据存放变量
      };
    },
    // onLoad页面初始化执行的钩子函数,类似于VUE的created()
    onLoad() {
      // 页面初始化,调用方法获取轮播图数据
      this.getSwiperList()
      // 获取分类导航数据的接口方法
      this.getNavList()
      // 获取首页楼层数据的方法
      this.getFloorList()
    },
    methods: {
      // 跳转搜索
      handleClick(){
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      },
      // 获取轮播图的接口方法
      async getSwiperList() {
        // console.log('轮播图')
        // 在uni-app里建议使用uni作为顶级对象使用
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          // 第一种
          // return uni.showToast({
          //      title,
          //      duration,
          //      icon: 'none',
          //    })
          // 第二种封装全局方法 直接调用
          return uni.$showMsg()
        }
        // 3.3 请求成功，为 data 中的数据赋值
        this.swiperList = res.message
      },
      // 获取分类导航数据的接口方法
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // 点击分类跳转页面
      navClickHandler(item) {
        // 跳转的是tabbar页面，所以使用uni.switchTab 去跳转
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取首页楼层数据的方法
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg()
        // 对跳转地址做一个处理
        res.message.forEach(floor=>{
          floor.product_list.forEach(prod=>{
            prod.url = '/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      }
    },

  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }
  .search-box{
    position: sticky;
    top: 0;
    z-index: 999;
  }
</style>
