const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const PHONE_REGEX = /^(?:\+88|88)?(01[3-9]\d{8}|(02|8[0-9])\d{7})$/;
module.exports = { EMAIL_REGEX, PHONE_REGEX };
