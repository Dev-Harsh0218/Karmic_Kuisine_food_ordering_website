const Menu= require('../../models/menu')
function menuControl(){
    return{
       async menu(req,res){ 
        var cate_item_assoc = {};
        const category_query_res = await Menu.distinct("i_category");
        // Array to store all promises  
        const promises = category_query_res.map(item =>
            Menu.find({ i_category: item }, { i_name: 1, i_price: 1, i_category: 1 })
        );
        // Wait for all promises to resolve
        await Promise.all(promises).then(results => {
            results.forEach((result, index) => {
                cate_item_assoc[category_query_res[index]] = result;
            });
        // Now, the associative array should be fully populated
        });
        // console.log(cate_item_assoc[category_query_res[0]]);
        return res.render('menu/menu',{category:category_query_res,items_assoc:cate_item_assoc})
        },


        // //cart variable for moving data here and there
        //  let cart={
        //     items:{
        //         itemID:{item: dataObject, qty:0}
        //     }
        //     total_qty:0,
        //     total_price:0,
        //  }

        update(req,res){
            if(!req.session.cart) {
                req.session.cart = {
                    items: {},
                    total_qty: 0,
                    total_price: 0
                }
            }
        
            let cart = req.session.cart;
            // Assuming req.body contains information about the item to be added
            if(!cart.items[req.body._id]){
                cart.items[req.body._id]={
                    item:req.body,
                    qty:1
                }
                cart.total_qty=cart.total_qty+1,
                cart.total_price=cart.total_price+req.body.i_price;
            }
            else{
                cart.items[req.body._id].qty+=1;
                cart.total_qty=cart.total_qty+1,
                cart.total_price=cart.total_price+req.body.i_price;
            }
            

            return res.json({Total_qty:req.session.cart.total_qty,Total_price:req.session.cart.total_price});
        },
        deleteItem(req,res)
        {
                const cart = req.session.cart;
                // Assuming req.body contains the item ID to delete
                const itemIdToDelete = req.body.item._id;

                if (cart && cart.items && cart.items[itemIdToDelete]) {
                    // Get the details of the item to be deleted
                    const deletedItem = cart.items[itemIdToDelete];
                    const deletedQty = deletedItem.qty;
                    const deletedPrice = deletedItem.item.i_price * deletedQty;

                    // Deduct the deleted item's quantity and price from the total
                    cart.total_qty -= deletedQty;
                    cart.total_price -= deletedPrice;

                    // Delete the item from the cart
                    delete cart.items[itemIdToDelete];

                    // Update the session
                    req.session.cart = cart;

                    // Send a response or redirect as needed
                    req.session.save((err) => {
                        if (err) {
                          console.error('Error saving session:', err);
                          res.status(500).json({ success: false, message: 'Error saving session' });
                        } else {
                          // Send a response or redirect as needed
                          res.json({ success: true, message: 'Item deleted from cart' });
                        }
                      });
                } else {
                    res.status(404).json({ success: false, message: 'Item not found in cart' });
                }
        }
    }
}
module.exports=menuControl

