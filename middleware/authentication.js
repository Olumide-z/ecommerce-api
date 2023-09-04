const CustomApiError = require('../errors');
const { isTokenValid } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if(!token){
        throw new CustomApiError.UnauthenticatedError(('Authentication Invalid'))
    }

    try{
        const { name, userId, role } = isTokenValid({ token });
        req.user = { name, userId, role }

        next()
    }catch(error){
        throw new CustomApiError.UnauthenticatedError(('Authentication Invalid'))
    }
   
};

// authorize permission
const authorizePermissions = (...roles) =>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new CustomApiError.UnauthorizedError('Unauthorized to accrss this route')
        };
        next();
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions
}