const index_get = async (req, res, next)=>{
    try{
     return res.status(200).json({message:"working fine"});
    } catch (error){
     next(error);
    }
 
 };
 
 
 module.exports={
     index_get,
    
 };