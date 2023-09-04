const CustomAPIError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
    // console.log(requestUser);
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);
    // if the role is admin go ahead
    if(requestUser.role === 'admin') return;
    // if it is the user, that want to access his own ID, go head
    if(requestUser.userId === resourceUserId.toString()) return 
    // else
    throw new CustomAPIError.UnauthorizedError('Not authorized to access this route')

}

module.exports = checkPermissions