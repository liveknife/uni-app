<template>
  <view class="my-search-container" :style="{backgroundColor: bgcolor}">
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}"
     @click="searchBoxHandler"
    >
      <!-- uni-ui提供的图标组件 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'my-search',
    props:{
      bgcolor:{
        type:String,
        default: '#c00000'
      },
      radius:{
        type:Number,
        default: 18
      }
    },
    data() {
      return {
        
      };
    },
    methods:{
      searchBoxHandler(){
        console.log('xxx')
        this.$emit('myclick')
      }
    }
  }
</script>

<style lang="scss">
.my-search-container {
  // background-color: #c00000;
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
}

.my-search-box {
  height: 36px;
  background-color: #ffffff;
  // border-radius: 15px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder {
    font-size: 15px;
    margin-left: 5px;
  }
}
</style>
