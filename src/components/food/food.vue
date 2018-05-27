<template>
  <transition name="move">
	<div v-show="showFlag" class="food" ref="detailWrapper">
	  <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}</span>
            </div>
             <div class="price">
                 <span class="newPrice"><span class="unit">￥</span>{{food.price}}</span>
                 <span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
            </div>
           <div class="shopCart">
             <transition name="fade">
               <div class="text" @click.stop.prevent="addFirst($event)" v-show="!food.count || food.count===0">加入购物车</div>
              </transition>
           </div>
            <div class="cartcontrol-wrapper">
             <cartcontrol :food="food" class="cartcontrol"></cartcontrol>
            </div>   
          </div> 
          <split v-show="food.info"></split>
          <div class="desc" v-show="food.info">
            <div class="title">商品介绍</div>
            <div class="content">{{food.info}}</div>
         </div>
         <split></split>
         <div class="rating">
           <h1 class="title">商品评价</h1>
           <ratingselect :select-type="selectType" :give-content="giveContent" :desc="desc" :ratings="food.ratings" @select-change="onselectchange" @contentchange="oncontentchange"></ratingselect>
           <div class="rating-wrapper">
             <ul v-show="food.ratings && food.ratings.length">
               <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                <div class="userInfo">
                 <div class="time">{{rating.rateTime | formatDate}}</div>
                 <div class="user">
                   <span class="name">{{rating.username}}</span>
                   <img class="avatar" width="12" height="12" :src="rating.avatar">
                 </div>
                 </div>
                 <p class="contentrating">
                  <span class="icon" :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  <span class="text">{{rating.text}}</span>
                 </p>
               </li>
             </ul>
             <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
           </div>
         </div>     
	  </div>
	</div>
 </transition>
</template>
<script>
 import BScroll from 'better-scroll';
 import cartcontrol from '../cartcontrol/cartcontrol';
 import split from '../split/split';
 import {formatDate} from '../../common/js/date';
 import Vue from 'vue';
 import ratingselect from '../ratingselect/ratingselect';
   // const POSITIVE = 0;
   // const NEGATIVE = 1;
   const ALL = 2;
	export default{
	 props: {
	   food: {
	     type: Object
	   }
	 },
	 data() {
	 	return {
	 		showFlag: false,
	 		selectType: ALL,
      giveContent: {
        onlyContent: true
      },
	 		desc: {
	 			all: '全部',
	 			positive: '推荐',
	 			negative: '吐槽'
	 		}
	 	};
	 },
	 methods: {
	 	show() {
	 	 this.showFlag = true;
	 	 this.selectType = ALL;
	 	 this.giveContent.onlyContent = false;
	 	 this.$nextTick(() => {
           if (!this.scroll) {
           	this.scroll = new BScroll(this.$refs.detailWrapper, {
           		click: true
           	});
           } else {
           	this.scroll.refresh();
           }
	 	 });
	 	},
	 	hide() {
	 		this.showFlag = false;
	 	},
	 	addFirst(event) {
           if (!event._constructed) {
           	return;
           }
           this.$root.eventHub.$emit('cart.add', event.target);
           Vue.set(this.food, 'count', 1);
	 	},
	 	onselectchange(val) {
	 		 this.selectType = val;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
	 	},
    oncontentchange(val) {
       this.$nextTick(() => {
        this.scroll.refresh();
      });
     },
    needShow(type, text) {
      if (this.giveContent.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
	 },
   filters: {
    formatDate(time) {
      let date = new Date(time);
     return formatDate(date, 'yyyy-MM-dd hh:mm');
   }
   },
	 components: {
	 	cartcontrol,
	 	split,
	 	ratingselect
	 }
	};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.food
  position fixed
  left 0
  top 0
  right 0
  bottom 48px
  width 100%
  background white
  z-index 30
  &.move-enter-active,&.move-leave-active
   transition: all 0.2s linear
   transform:translate3d(0,0,0)
  &.move-enter,&.move-leave-active
   transform:translate3d(100%,0,0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display:block
        padding:10px
        color:white
   .content
    position relative
    box-sizing border-box
    width 100%
    padding 18px
    .title
      font-size 14px
      font-weight 700
      color rgb(7,17,27)
      line-height 14px
    .detail
      padding 0
      padding-top 8px
      font-size 10px
      color rgb(147,153,159)
      line-height 10px
      height 10px
      span:last-child
        padding-left 12px
    .price
      padding-top 18px
      font-size 14px
      font-weight 700
      color rgb(240,20,20)
      line-height 24px
      .unit
        font-size 10px
        font-weight normal
      .oldPrice
        padding-left 12px
        font-size 10px
        font-weight normal
        color rgb(147,153,159)
        line-height 24px
        text-decoration line-through
    .shopCart
      position absolute
      right 18px
      bottom 18px
      height 24px
      text-align center
      z-index 10
      .text
        box-sizing border-box
        height 100%
        line-height 24px
        color white
        font-size 10px
        padding 0 12px
        border-radius 12px
        background rgb(0,160,220)
        &.fade-enter-active,&.fade-leave-active{
          transition opacity .2s
        }
        &.fade-enter,&.fade-leave-active{
          opacity 0
        }
    .cartcontrol
      position absolute
      right 12px
      bottom 12px
  .desc
    padding 18px
    .title
      font-size 14px
      font-weight 500
      color #07111b
      margin-bottom 6px
    .content
      font-size 12px
      font-weight 200
      color rgb(77,85,93)
      line-height 24px
      padding 0 8px
  .rating
    padding 18px 0
    position relative
    .title
      margin-left 18px
      font-size: 14px
      font-weight 500
      color: #07111b
    .rating-wrapper
      margin 0 18px
      .rating-item
        padding 16px 0
        border-bottom 1px solid rgba(7,17,27,0.1)
        .userInfo
          display flex
          color rgb(147,153,159)
          font-size 10px
          line-height 12px
          margin-bottom 6px
          .time
            flex 1
          .user
            flex 1
            text-align right
            .avatar
                padding-left 6px
                border-radius 50%
                vertical-align:top
        .contentrating
          padding-top 6px
          .icon
            font-size 12px
            line-height 16px
            &.icon-thumb_up
              color rgb(0,160,220)
            &.icon-thumb_down
              color rgb(147,153,159)
          .text
            font-size 12px
            color rgb(7,17,27)
            line-height 16px
            padding-left 4px
      .no-rating
        padding 16px 0
        font-size 12px
        color rgb(147,153,159)
</style>