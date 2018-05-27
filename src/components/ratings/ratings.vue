<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
          <div class="overview">
            <div class="overview-left">
              <h1 class="score">{{seller.score}}</h1>
              <div class="title">综合评分</div>
              <div class="rank">高于周边商家{{seller.rankRate}}%</div>
            </div>
            <div class="overview-right">
              <div class="score-wrapper">
                <span class="title">服务态度</span>
                <star :size="36" :score="seller.serviceScore"></star>
                <span class="score">{{seller.serviceScore}}</span>
              </div>
              <div class="score-wrapper">
                <span class="title">商品评分</span>
                <star :size="36" :score="seller.foodScore"></star>
                <span class="score">{{seller.foodScore}}</span>
              </div>
              <div class="deliveryTime">
                <span class="title">送达时间</span>
                <span class="time">{{seller.deliveryTime}}分钟</span>
              </div>
            </div>            
          </div>
          <split></split>
           <ratingselect :select-type="selectType" :give-content="giveContent" :ratings="ratings" @select-change="onselectchange" @contentchange="oncontentchange"></ratingselect>
         <div class="evel-list">
          <ul>
            <li v-show="needShow(rating.rateType,rating.text)" class="evel" v-for="rating in ratings">
              <div class="avatar">
                <img :src="rating.avatar" width="28" height="28">
              </div>
              <div class="content">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <span class="rateTime">{{rating.rateTime | formatDate1}}</span>
                </div>
                <div class="star-wrapper">
                  <star :size="24" :score="rating.score"></star>
                  <span v-show="rating.deliveryTime" class="deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                </div>
                <div class="text">
                  {{rating.text}}
                </div>
                <div class="recommend">
                  <span class="icon icon-thumb_up" v-show="rating.recommend.length"></span>
                  <span class="dish" v-for="dish in rating.recommend">{{dish}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
		</div>
	</div>
</template>
<script>
  import star from '../star/star';
  import ratingselect from '../ratingselect/ratingselect';
  import split from '../split/split';
  import {formatDate} from '../../common/js/date';
  import BScroll from 'better-scroll';
  const ALL = 2;
  const ERR_OK = 0;
	export default{
     props: {
       seller: {
         type: Object
       }
     },
     data() {
      return {
       ratings: [],
       selectType: ALL,
       giveContent: {
        onlyContent: true
       }
      };
     },
     created() {
      let that = this;
      this.$http.get('/api/ratings').then((response) => {
         if (response.data.errno === ERR_OK) {
         that.ratings = response.data.data;
          this.$nextTick(() => {
           if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            });
           } else {
            this.scroll.refresh();
           }
         });
        }
      });
     },
     filters: {
      formatDate1(time) {
       let date = new Date(time);
       return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
     },
     components: {
     	star,
     	ratingselect,
     	split,
      formatDate
     },
  methods: {
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
    }
	};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ratings
   position: absolute
   top: 174px
   bottom: 0
   left: 0
   width: 100%
   overflow: hidden
   .overview
     display:flex
     padding:18px 0
     .overview-left
       flex:0 0 137px
       width:137px
       border-right 1px solid rgba(7,17,27,0.1)
       text-align center
       @media only screen and (max-width: 320px)
        flex: 0 0 120px
        width:120px;
       .score
        font-size 24px
        color rgb(255,153,0)
        line-height 28px
       .title
        padding 6px 0 8px 0
        font-size 12px
        color rgb(7,17,27)
        line-height 12px
       .rank
        font-size 10px
        color rgb(147,153,159)
        line-height 10px
        margin-bottom 6px      
     .overview-right
       flex:1
       padding:6px 0 6px 24px
       @media only screen and (max-width: 320px)
         padding-left:6px;
      .score-wrapper,.deliveryTime
        display flex
        margin-bottom 8px
        .title
          font-size 12px
          color rgb(7,17,27)
          line-height 18px
          margin-right 12px
        .score
          font-size 12px
          line-height 18px
          color rgb(255,153,0)
          padding-left 12px
      .deliveryTime
        margin-bottom 0
        .time
          font-size 12px
          color rgb(147,153,159)
          line-height 18px       
   .evel-list
    .evel
      display flex
      padding 18px 0
      margin 0 18px
      border-bottom 1px solid rgba(7,17,27,0.1)
      .avatar
        flex 0 0 28px
        margin-right 12px
        img
          border-radius 50%
      .content
        flex 1
        .user
          font-size 10px
          color rgb(7,17,27)
          line-height 12px
          .rateTime
            position absolute
            font-weight 200
            right 18px
            color rgb(147,153,159)
        .star-wrapper
          font-size 0
          padding-top 4px
          margin-bottom 6px
          .star
            display inline-block
          .deliveryTime
            font-size 10px
            padding-left 6px
            font-weight 200
            color rgb(147,153,159)
        .text
          font-size 12px
          color rgb(7,17,27)
          line-height 18px
        .recommend
          padding-top 4px
          .icon
            font-size 12px
            color rgb(0,160,220)
            line-height 16px
          .dish
            display inline-block
            font-size 9px
            color rgb(147,153,159)
            line-height 16px
            border 1px solid rgba(7,17,27,0.1)
            padding 2px 6px
            margin-right 8px
            white-space normal
            margin-top 4px
</style>