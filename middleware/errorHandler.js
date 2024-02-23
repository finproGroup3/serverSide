function errorHandler(err, req, res, next) {
    const errorResponse = {
        error: err.name
    }
    if (err.message.length !== 0) {
        errorResponse.message = err.message
    }
    if (err.name === "not_found") {
        res.status(404).json(errorResponse);
    }
    else if (err.name === "failed_upload") {
        res.status(400).json(errorResponse);
    }
    res.status(500).json({ message: "internal server error" })
}

module.exports = errorHandler