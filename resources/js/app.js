import axios from 'axios'

const addToCart = document.querySelectorAll('.add_btn');

function updateCart(item){
        axios.post('/updated-cart',item).then(res =>{
          console.log(res)
        })
}


addToCart.forEach((btn) => {
  btn.addEventListener('click', (e)=>{
      let item=btn.dataset.atc_item
      updateCart(item)
  });
});