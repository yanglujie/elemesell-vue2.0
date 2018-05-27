<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
            <div class="overview">
        	<div class="title">
          		<div class="text">{{seller.name}}</div>
          		<div class="star-wrapper">
            		<star :size="36" :score="seller.score"></star>
           		    <span class="rate-count">({{seller.ratingCount}})</span>
                    <span class="sell-count">月售{{seller.sellCount}}单</span>
          		</div>
          		<div class="collect" @click="togglecollect($event)">
           			 <span class="icon-favorite" :class="{'active':collectflag}"></span>
           			 <span class="text">{{collecttext}}</span>
          		</div>
        	</div>
             <div class="remark">
          		<div class="block">
            		<h2>起送价</h2>
            		<div class="content">
              		<span class="num">{{seller.minPrice}}</span>元
            		</div>
          		</div>
          		<div class="block">
           			 <h2>商家配送</h2>
           			 <div class="content">
              			<span class="num">{{seller.deliveryPrice}}</span>元
           			 </div>
          		</div>
          		<div class="block">
            		<h2>平均配送时间</h2>
           			<div class="content">
             			 <span class="num">{{seller.deliveryTime}}</span>分钟
            		</div>
          		</div>
       		 </div>
            </div>
            <split></split>
            <div class="bulletin">
             <h1 class="title">公告与活动</h1>
             <div class="content-wrapper">
              <p class="content">{{seller.bulletin}}</p>
             </div>
            </div>
             <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="item in seller.supports">
                <span class="icon" :class="iconClassMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <split></split>
            <div class="seller-imgs">
             <h1 class="title">商家实景</h1>
             <div class="pic-wrapper" ref="picWrapper">
              <ul class="pic-list" ref="picList">
                <li class="pic-item" v-for="pic in seller.pics">
                 <img :src="pic" width="120" height="90">
                </li>
              </ul>
             </div>
            </div>
            <split></split>
            <div class="seller-info">
        		<h1>商家信息</h1>
        		<ul class="info-list">
         			 <li class="info" v-for="info in seller.infos">{{info}}</li>
        		</ul>
      		</div>     
		</div>
	</div>
</template>
<script>
  import star from '../star/star';
  import split from '../split/split';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from '../../common/js/store';
	export default{
      props: {
      	seller: {
      		type: Object
      	}
      },
      data() {
      	return {
      	collectflag: (() => {
          return loadFromLocal(this.seller.id, 'collectflag', false);
        })()
      	};
      },
      computed: {
      	collecttext() {
      		return this.collectflag ? '已收藏' : '未收藏';
      	}
      },
      created() {
        this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      },
      mounted() {
      //	console.log(this.seller);
        this._initScroll();
        this._initPics();
      },
      watch: {
      	'seller'() {
      		this._initScroll();
      		this._initPics();
      	}
      },
      methods: {
      	_initScroll() {
      	 // console.log(121);
         this.$nextTick(() => {
       	 if (!this.scroll) {
       	   this.scroll = new BScroll(this.$refs.seller, {
           		click: true
           	});
        } else {
           this.scroll.refresh();
         }
      });
      	},
        _initPics() {
        // console.log(111);
        if (this.seller.pics) {
       	 let picWidth = 120;
       	 let margin = 6;
       	 let width = (picWidth + margin) * this.seller.pics.length - margin;
       	 this.$refs.picList.style.width = width + 'px';
       	 this.$nextTick(() => {
       	 	 if (!this.picScroll) {
       			this.picScroll = new BScroll(this.$refs.picWrapper, {
           			scrollX: true,
           			eventPassthrough: 'vertical'
           		});
       	  } else {
       		this.picScroll.refresh();
       	}
       });
        }
      },
      togglecollect(event) {
       if (!event._constructed) {
           	return;
           }
      	this.collectflag = !this.collectflag;
      	saveToLocal(this.seller.id, 'collectflag', this.collectflag);
      }
  },
      components: {
      	star,
      	split,
      	saveToLocal
      }
	};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
   @import '../../common/stylus/mixin.styl'
  .seller
   position: absolute
   top: 174px
   bottom: 0
   left: 0
   width: 100%
   overflow: hidden   
  .seller-content
    .overview
      padding 18px 0
      margin 0 18px
      .title
        padding-bottom 18px
        border-bottom 1px solid rgba(7,17,27,0.1)
        .text
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
        .star-wrapper
          padding-top 8px
          font-size 0
          .star
            display inline-block
            vertical-align top
          .rate-count,.sell-count
            display inline-block
            font-size 10px
            color rgb(77,85,93)
            line-height 18px
          .rate-count
            padding 0 12px 0 8px
        .collect
          position absolute
          top 18px
          right 11px
          width 50px
          text-align center
          .icon-favorite
            font-size 24px
            line-height 24px
            color #d4d6d9
            &.active
              color rgb(240,20,20)
          .text
            display block
            font-size 10px
            color rgb(77,85,93)
            line-height 10px
            padding-top 4px
      .remark
        display flex
        .block
          flex 1
          margin-top 18px
          text-align center
          border-right 1px solid rgba(7,17,27,0.1)
          &:last-child
            border none
          h2
            font-size 10px
            color rgb(147,153,159)
            line-height 10px
            margin-bottom 4px
          .content
            font-size 10px
            color rgb(7,17,27)
            line-height 24px
            font-weight 200
            .num
              position relative
              top 2px
              font-size 24px
    .bulletin
        padding-top 18px
        margin 0 18px
        border-bottom 1px solid rgba(7,17,27,0.1)
        h1
          font-size 14px
          color #07111b
          line-height 14px
        .content
          padding 8px 12px 16px 12px
          font-size 12px
          font-weight 200
          color rgb(240,20,20)
          line-height 24px
    .supports
      margin 0 18px
      .support-item
        padding 16px 12px
        border-bottom 1px solid rgba(7,17,27,0.1)
        font-size 0
        &:last-child
          border-bottom:none
        .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            margin-right 4px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
        .text
          font-size 12px
          font-weight 200
          color rgb(7,17,27)
          line-height 16px
    .seller-imgs
      margin 18px
      h1
        font-size 14px
        line-height 14px
        margin-bottom 12px
      .pic-wrapper
        width:100%
        overflow:hidden
        white-space nowrap
        .pic-list
          font-size:0
          .pic-item
            display:inline-block
            margin-right:6px
            width:120px
            height:90px
            &:last-child
             margin:0
    .seller-info
      h1
        margin 0 18px
        padding 18px 0 12px 0
        border-bottom 1px solid rgba(7,17,27,0.1)
      .info-list
        .info
          font-size 12px
          font-weight 200
          color rgb(7,17,27)
          line-height 16px
          padding 16px 12px
          border-bottom 1px solid rgba(7,17,27,0.1)
          &:last-child
            border none   
</style>