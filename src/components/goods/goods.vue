<template>
<div>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
		  <ul>
            <li v-for="(item,index) in goods" :class="index==currentIndex?'menu-item-selected':'menu-item'" @click="selectMenu(index,$event)">
               <span class="text border-1px" >
               <span v-show="item.type>0" class="icon" :class="iconClassMap[item.type]"></span>
               {{item.name}}
               </span>
            </li>
		  </ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
       <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
                <div class="icon">
                  <img :src="food.icon">
                </div>
                <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <p class="desc">{{food.description}}</p>
                    <div class="extra">
                       <span class="sellCount">月售{{food.sellCount}}份</span>
                       <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                       <span class="newPrice"><span class="unit">￥</span>{{food.price}}</span>
                       <span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                       <cartcontrol :food="food"></cartcontrol>
                    </div>
                </div>

              </li>
            </ul>
          </li>
       </ul>
    </div>
    <shopcart :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
	</div>
  <food :food="selectedFood" ref="food"></food>
</div>
</template>
<script>
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import food from '../food/food';
  const ERR_OK = 0;
  // const eventHub = new Vue(); // eslint-disable-line no-unused-vars
	export default{
      props: {
        seller: {
          type: Object
        }
      },
      data() {
      	return {
      		goods: [],
          listHeight: [],
          scrollY: 0,
          selectedFood: {}
      	};
      },
      computed: {
        currentIndex() {
          for (let i = 0; i < this.listHeight.length; i++) {
            let height1 = this.listHeight[i];
            let height2 = this.listHeight[i + 1];
            if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
               return i;
            }
          }
          return 0;
        },
        selectFoods() {
          let foods = [];
          this.goods.forEach((goods) => {
             goods.foods.forEach((food) => {
              if (food.count) {
                 foods.push(food);
              }
             });
          });
          return foods;
        }
      },
      created() {
      	this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      	let that = this;
        this.$http.get('/api/goods').then((response) => {
        if (response.data.errno === ERR_OK) {
         that.goods = response.data.data;
         this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
          // console.log(this.listHeight);
         });
        }
     });
        },
        methods: {
          selectMenu(index, event) {
            if (!event._constructed) {
              return;
            }
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let el = foodList[index];
            this.foodsScroll.scrollToElement(el, 300);
            // console.log(index);
        },
          _initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
              click: true
            });
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
              click: true,
              probeType: 3
            });

            this.foodsScroll.on('scroll', (pos) => {
              this.scrollY = Math.abs(Math.round(pos.y));
            });
          },
          _calculateHeight() {
             let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
             let height = 0;
             this.listHeight.push(height);
             for (let i = 0; i < foodList.length; i++) {
               let item = foodList[i];
               height += item.clientHeight;
               this.listHeight.push(height);
             }
          },
          selectFood(food, event) {
              if (!event._constructed) {
              return;
            }
            this.selectedFood = food;
            this.$refs.food.show();
          }
        },
        components: {
          shopcart,
          cartcontrol,
          food
        }
	};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin.styl"
.goods
  display:flex
  position:absolute
  width:100%
  top:174px
  bottom:46px
  overflow:hidden
  .menu-wrapper
    flex:0 0 80px
    width:80px
    background:#f3f5f7
   .menu-item-selected
      background white
      font-weight 700
      margin-top -1px
      .text
        border-none()
    .menu-item,.menu-item-selected
      position relative
      display table
      height 54px
      line-height 14px
      width 56px
      padding 0 12px
      &:last-child:after
          content none
    .menu-item:after
      position: absolute
      content: ''
      left: 12px
      width: 56px
      bottom: 0
      border-bottom: 1px solid rgba(7,17,27,0.1)
     .text
         display:table-cell
         width:56px
         font-size 12px
         vertical-align:middle
         border-1px(rgba(7,17,27,0.1))
      .icon
         display inline-block
         vertical-align top
         width 12px
         height 12px
         margin-right 2px
         background-size 12px 12px
         background-repeat no-repeat
         &.decrease
           bg-image('decrease_3')
         &.discount
           bg-image('discount_3')
         &.guarantee
           bg-image('guarantee_3')
         &.invoice
           bg-image('invoice_3')
         &.special
           bg-image('special_3')    
  .foods-wrapper
      flex 1
      margin-top: 2px;
      .food-list
        h1
          height 26px
          line-height 26px
          padding-left 12px
          font-size 12px
          color rgb(147,153,159)
          background #f3f5f7
          border-left 2px solid #d9dde1
      .food-item
        position relative
        display flex
        margin: 0 18px;
        padding: 18px 0;
        border-bottom 1px solid rgba(7,17,27,0.1)
        .icon
          flex:0 0 57px
          img
           width:100%
        &:last-child
          border-bottom none
        .content
          flex 1
          padding-left 10px
          h2
            margin 2px 0 8px 0
            font-size 14px
            line-height 14px
            height 14px
            font-weight 700
            color rgb(7,17,27)
          .extra,.desc
            font-size 10px
            color rgb(147,153,159)
            line-height 10px
            .sellCount
              margin-right 12px
          .desc
            font-size 10px
            margin-bottom 8px
            line-height: 12px
          .price
            font-size 10px
            font-weight 700
            line-height 24px
            .newPrice
              font-size 14px
              margin-right 8px
              color rgb(240,20,20)
              .unit
                font-size 10px
                font-weight normal
            .oldPrice
              text-decoration line-through
              color rgb(147,153,159)
              padding-left 4px
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom 12px
            z-index 20
</style>