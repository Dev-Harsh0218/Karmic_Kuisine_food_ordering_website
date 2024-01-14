import axios from "axios";
import initAdmin from "./admin";
import moment from "moment";

const addToCart = document.querySelectorAll(".add_btn");
let cart_counter = document.getElementById("cart_act_count");
let cart_count_div = document.getElementById("cart_count");
var originalDisplay = cart_count_div.style.display || getComputedStyle(cart_count_div).display;

if (cart_counter.innerText == 0) {
  cart_count_div.style.display = "none";
}

function updateCart(item) {
  axios
    .post("/updated-cart", item, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      cart_counter.innerText = res.data.Total_qty;
      cart_count_div.style.display = originalDisplay;

      iziToast.show({
        icon: "remix-icon-success-item-to-cart",
        title: "YOO HOO!!",
        titleColor: "#20D813",
        position: "topRight",
        message: "Item Added To Cart...",
        messageColor: "#20D813",
        titleSize: "18px",
        layout: 1,
        backgroundColor: "#272525",
        progressBarColor: "hsl(116, 52%, 57%)",
      });
    })
    .catch((error) => {
      iziToast.show({
        icon: "remix-icon-error-item-to-cart",
        message: "Something went wrong...",
        messageColor: "hsl(0, 64%, 52%)",
        position: "topRight",
        titleSize: "16px",
        layout: 1,
        close: false,
        backgroundColor: "#272525",
        progressBarColor: "hsl(0, 64%, 52%)",
      });
      console.log("error updating cart", error);
    });
}
addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    let item = btn.dataset.atc_item;
    updateCart(item);
  });
});


//------------runtime order tracker ----------
//change order status
let trackers = document.querySelectorAll(".order-tracking");
let transfer_input = document.querySelector("#ordertransfer");
let order = transfer_input ? JSON.parse(transfer_input.value): null;

function updateOrderTracker(order) {
  let conditionFulfilled=false;
  trackers.forEach(track=>{
    let dataprop=track.dataset.status
    if (conditionFulfilled) {
      track.classList.remove('completed');
    } else {
      if (dataprop === order.status) {
        conditionFulfilled = true;
      }
      
      track.classList.add('completed');
    }
  })
  
}

updateOrderTracker(order);


//socket
let socket=io()
initAdmin(socket);
// join
if(order){
  socket.emit('join',`order_${order._id}`)
}


//check if you are at admin or not
let adminAreaPath=window.location.pathname
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom')
  }

socket.on('orderUpdated',(data)=>{
    const udpOrder={ ...order }
    udpOrder.updatedAt=moment().format('llll')
    udpOrder.status= data.status
    updateOrderTracker(data)
    iziToast.show({
      icon: "remix-icon-success-item-to-cart",
      title: "Update",
      titleColor: "#20D813",
      position: "topRight",
      message: `${data.status}`,
      messageColor: "#20D813",
      titleSize: "18px",
      layout: 1,
      backgroundColor: "#272525",
      progressBarColor: "hsl(116, 52%, 57%)",
    });
})

