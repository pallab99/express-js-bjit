const setTokenToCookie = (res, token) => {
    res.cookie(`${token.name}`, `${token.value}`, {
        maxAge: `${token.maxAge}`,
        httpOnly: true,
    });
};

//3.154e10

module.exports = setTokenToCookie;
