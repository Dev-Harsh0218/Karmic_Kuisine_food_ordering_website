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
        },

        orderStatusUpdate(req,res){ 
            order.updateOne({_id: req.body.orderId},{status:req.body.status}).then(result =>{
                const eventEmitter=req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdate', {id:req.body.orderId,status:req.body.status})
                res.redirect('/admin/orders');
            }).catch(err =>{
                console.log("500 internal server error");
                res.status(500).send('Internal server error');
            })
        }
    }
}

module.exports=adminControl