import axios from 'axios'

const addToCart = document.querySelectorAll('.add_btn');
let cart_counter= document.getElementById("cart_act_count");
let cart_count_div= document.getElementById("cart_count");
var originalDisplay = cart_count_div.style.display || getComputedStyle(cart_count_div).display;
if(cart_counter.innerText==0)
{
            cart_count_div.style.display='none';
}

function updateCart(item){
        axios.post('/updated-cart',item,{
          headers: { 'Content-Type': 'application/json' }}).then(res =>{
          console.log(res);
          cart_counter.innerText=res.data.Total_qty;
          cart_count_div.style.display = originalDisplay;
          iziToast.show({
            icon:'remix-icon-success-item-to-cart',
            title: 'YOO HOO!!',
            titleColor: '#20D813',
            position: 'topRight',
            message:'Item Added To Cart...',
            messageColor: '#20D813',
            titleSize: '18px',
            layout:1,
            backgroundColor: '#272525',
            progressBarColor: 'hsl(116, 52%, 57%)',
          });
        }).catch(error =>{
          iziToast.show({
            icon:'remix-icon-error-item-to-cart',
            message: 'Something went wrong...',
            messageColor: 'hsl(0, 64%, 52%)',
            position: 'topRight',
            titleSize: '16px',
            layout:1,
            close:false,
            backgroundColor: '#272525',
            progressBarColor: 'hsl(0, 64%, 52%)',
          });
          console.log('error updating cart',error)
        })
}
addToCart.forEach((btn) => {
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
      let item=btn.dataset.atc_item
      updateCart(item)
  });
});