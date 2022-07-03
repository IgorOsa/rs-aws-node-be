interface ResponseInterface {
    statusCode: number
    headers: Object,
    body: Object
}

const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
};

const errorResponse = (err: Error, statusCode: number = 500, headers = defaultHeaders): ResponseInterface => {
    console.error(`Error: ${err.message}`);

    return {
        statusCode,
        headers,
        body: JSON.stringify({ message: err.message || 'Internal server error' })
    }
}

const successResponse = (body: Object | any, statusCode: number = 200, headers = defaultHeaders): ResponseInterface => {
    console.log(`Lambda executed and finished`);

    return {
        statusCode,
        headers,
        body: JSON.stringify(body)
    }
}

export { errorResponse, successResponse, ResponseInterface };