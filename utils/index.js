const requestBodyValidator = (Schema)=> async (req, res, next)=>{
    try{
    await Schema.validateAsync(req.body);
    return next();
    }catch (error) {
        const errors = error.details.map((detail) => detail.mmessage);
        return res.status(400).json({message: "something went wrong", error: error});
    }
    };

    const requestQueryValidator = (Schema)=> async (req, res, next)=>{
        try{
        await Schema.validateAsync(req.query);
        return next();
        }catch (error) {
            const errors = error.details.map((detail) => detail.mmessage);
            return res.status(400).json({message: "something went wrong", error: error});
        }
        };


        module.exports ={
            requestBodyValidator,
            requestQueryValidator,
        };