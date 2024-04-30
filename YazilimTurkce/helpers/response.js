module.exports.TRUE = (check, token) => {
    return{
        status: true,
        desc:'',
        resolt: {
            user:check ,
            token:token,
        }
    };
}; 