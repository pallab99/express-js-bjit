const setTokenToCookie = (res, token) => {
    res.cookie(`${token.name}`, `${token.value}`, {
        maxAge: `${token.maxAge}`,
        httpOnly: true,
    });
};

module.exports = setTokenToCookie;
