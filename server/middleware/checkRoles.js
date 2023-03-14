const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.role.map(userRole => rolesArray.includes(userRole)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}


module.exports = checkRoles;