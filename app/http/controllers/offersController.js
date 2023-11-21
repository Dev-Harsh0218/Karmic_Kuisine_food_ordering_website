const Offer=require('../../models/offer')
function offersController(){
    return{
        async offers(req,res){
         var cate_item_assoc = {};
         const category_query_res = await Offer.distinct("i_category");
         // Array to store all promises  
         const promises = category_query_res.map(item =>
             Offer.find({ i_category: item }, { i_name: 1, i_price: 1, i_category: 1 })
         );
 
         // Wait for all promises to resolve
         await Promise.all(promises).then(results => {
             results.forEach((result, index) => {
                 cate_item_assoc[category_query_res[index]] = result;
             });
         // Now, the associative array should be fully populated
         });
         // console.log(cate_item_assoc[category_query_res[0]]);
         return res.render('offers/offers',{category:category_query_res,items_assoc:cate_item_assoc})
         }
     }
}
module.exports = offersController
// return{
//     offers(req,res){
//         res.render('offers/offers')
//     }
// }