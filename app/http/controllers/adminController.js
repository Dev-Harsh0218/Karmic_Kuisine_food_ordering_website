const order=require('../../models/orderStore')
function adminControl(){
    return{
       async orders(req,res){
            try {
                const orders = await order.find({ status: { $ne: 'completed' } })
                    .sort({ createdAt: -1 })
                    .populate('customerId', '-password')
                    .exec();
                    if(req.xhr){
                        res.json(orders)
                    }
                    else{
                        res.render('admin/adminorders', { orders: orders });
                    }

            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports=adminControl