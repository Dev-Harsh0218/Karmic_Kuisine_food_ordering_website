const moment = require("moment");
const axios = require("axios");
const iziToast=require('izitoast')

function initAdmin(socket) {
  let total_amount = 0;
  const orderTableBody = document.querySelector("#order-table-body");
  let orders = [];
  let markup;

  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      orders = res.data;
      markup = generatedMarkup(orders);
      markup += `
      <tr>
        <td colspan="4" class="total-row">Total</td>
        <td class="total-row">₹${total_amount}</td>
        <td class="total-row"></td> <!-- Assuming the last column is empty in the total row -->
      </tr>
    `;
      orderTableBody.innerHTML = markup;
    })
    .catch((err) => {
      console.log(err);
    });

  function render_items(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        return `<p>${menuItem.item.i_name} - ${menuItem.qty} pcs </p>`;
      })
      .join("");
  }

  function cal_amount(items) {
    let sum = 0;
    let parsedItems = Object.values(items);
    parsedItems.map((menuItem) => {
      sum = sum + menuItem.item.i_price;
    });
    total_amount += sum;
    return `<p>₹${sum}</p>`;
  }

  function generatedMarkup(order) {
    //logic
    return orders
      .map((order) => {
        return `
                <tr>
                    <td class="order-table-ele">
                        <h6>${order._id}</h6>
                        <div id="all-orders">
                            ${render_items(order.items)}
                        </div>
                    </td>
                    <td class="order-table-ele">${order.customerId.fname}</td>
                    <td class="order-table-ele order-table-address">${order.address}</td>
                    <td class="order-table-ele">
                        <form method="POST" action="/admin/orders/status">
                            <input type="hidden" name="orderId" value="${order._id}">
                            <select name="status" onchange="this.form.submit()" class="order-status">
                                <option value="order_placed" ${order.status === "order_placed" ? "selected" : ""}>Placed</option>
                                <option value="confirmed" ${order.status === "confirmed" ? "selected" : ""}>Confirmed</option>
                                <option value="prepared" ${order.status === "prepared" ? "selected" : ""}>Prepared</option>
                                <option value="outForDelievery" ${order.status === "outForDelievery" ? "selected" : ""}>On Route</option>
                                <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
                                <option value="completed" ${order.status === "completed" ? "selected" : ""}>Completed</option>
                            </select>
                        </form>
                    </td>
                    <td class="order-table-ele">${cal_amount(order.items)}</td>
                    <td class="order-table-ele">${moment(order.createdAt).format("llll")}</td>
                    </tr>
                `;}).join("");
  }
  socket.on('orderPlaced',(result)=>{
    iziToast.show({
      icon: "remix-icon-success-item-to-cart",
      title: "New!!!",
      titleColor: "#20D813",
      position: "topRight",
      message: `new Order Added`,
      messageColor: "#20D813",
      titleSize: "18px",
      layout: 1,
      backgroundColor: "#272525",
      progressBarColor: "hsl(116, 52%, 57%)",
    });
    orders.unshift(result)
    orderTableBody.innerHTML ='';
    markup = generatedMarkup(orders);
      markup += `
      <tr>
        <td colspan="4" class="total-row">Total</td>
        <td class="total-row">₹${total_amount}</td>
        <td class="total-row"></td> <!-- Assuming the last column is empty in the total row -->
      </tr>
    `;
      orderTableBody.innerHTML = markup;
  })
}

module.exports = initAdmin;
