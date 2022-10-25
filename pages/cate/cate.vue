<template>
  <view>
    <!-- 自定义搜索组件 -->
    <my-search @myclick="handleClick"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" style="height: 300px;" :style="{height: wh + 'px'}">
        <block  v-for="(item,i) in cateList" :key="i">
          <view :class="['left-scroll-view-item',i === active ? 'active' : '']" @click="activeChanged(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view :scroll-top="scrollTop" :style="{height: wh + 'px'}" class="right-scroll-view" scroll-y="true" style="height: 300px;">
         <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
           <!-- 标题 -->
            <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
            <view class="cate-lv3-list">
                <view class="cate-lv3-item" v-for="(item3,index) in item2.children" :key="index" @click="gotoGoodsList(item3)">
                  <img :src="item3.cat_icon" alt="">
                  <text>{{item3.cat_name}}</text>
                </view>
            </view>
          </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh: 0, // 窗口可用高度 = 屏幕高度 - tabbar和顶部导航的高度
        cateList: [], // 分类列表的数组
        active: 0,
        cateLevel2: [], // 二级分类数据
        scrollTop: 0,
      };
    },
    onLoad() {
      // 页面初始化的时候获取屏幕可用高度
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight - 50
      this.getCateList()
    },
    methods:{
      // 跳转搜索
      handleClick(){
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      },
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // 因为页面打开后默认展示的是第一个一级分类,所以子节点显示默认也是第一个一级分类的子节点,所以这里给他赋值
        this.cateLevel2 = res.message[0].children
      },
      // 一级节点 点击切换对应二级分类和激活样式的实时更新，每次点击需要上右侧一直保持在顶部
      activeChanged(i){
        this.active = i
        // 点击那个一级分类,右侧子分类显示的就是对应一级分类的子级
        this.cateLevel2 = this.cateList[i].children
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 三级分类点击跳转商品列表页
      gotoGoodsList(item){
        console.log(item.cat_id)
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid='+item.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;

        // 激活项的样式
        &.active {
          background-color: #ffffff;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
  
    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
  
      image {
        width: 60px;
        height: 60px;
      }
  
      text {
        font-size: 12px;
      }
    }
  }
</style>
