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
        
        update(req,res){
            if(!req.session.cart){
                req.session.cart ={
                    items:{},
                    total_qty:0,
                    total_price:0
                }
            }
            let cart= req.session.cart
            console.log(JSON.stringify(`${req.body}`));
            // adding if the item is already present there
            return res.json({data:"update successful"})
        }
    }
}
module.exports=menuControl

