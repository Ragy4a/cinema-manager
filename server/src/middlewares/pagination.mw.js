const { PAGINATION_SCHEMA } = require('../utils/validationSchemas');

module.exports.paginateData = async (req, res, next) => {
    let { page = 1, result = 5 } = req.query;

    page = parseInt(page);
    result = parseInt(result);

    const defaultPagination = {
        limit: 5,
        offset: 0,
    };

    const pagination = {
        limit: Number.isInteger(result) && result > 0 ? result : 5,
        offset: Number.isInteger(page) && page > 0 ? (page - 1) * result : 0,
    };

    try {
        if (await PAGINATION_SCHEMA.isValid(pagination)) {
            req.pagination = pagination;
        } else {
            req.pagination = defaultPagination;
        }
        next();
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};