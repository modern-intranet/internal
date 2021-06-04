const INTRANET = "https://intranet.ved.com.vn";
const INTRANET_ORDER = `${INTRANET}/index.php/component/datcom/?view=food&layout=order`;
const INTRANET_LIST = `${INTRANET}/index.php/component/datcom/?view=food&layout=review`;
const INTRANET_USER_INFO = `${INTRANET}/index.php/component/comprofiler/userslist`;
const INTRANET_DOMAIN = "intranet.ved.com.vn";

const GOOGLE_DOMAIN = "accounts.google.com";
const GOOGLE_COOKIE_SMSV = "SMSV";
const GOOGLE_COOKIE_GAPS = "__Host-GAPS";

const DEPARTMENTS = [
  "LAPTRINH",
  "CYBERPAY",
  "CHAMSOCKHACHHANG",
  "DICHVUPHONGMAY",
  "HANHCHINHNHANSU",
  "KINHDOANHBANLE",
  "MARKETING",
  "TAICHINHKETOAN",
  "THUMUA",
  "THUONGMAIDIENTU",
  "VANHANHGAME",
];

const SOCKET_ACTION = {
  I_AM_INTRANET: "iAmIntranet",
  VALIDATE_COOKIE: "validateCookie",
  GET_DATA: "getData",
  SET_FOOD: "setFood",
  GET_LIST: "getList",
  GET_LIST_ALL: "getListAll",
  GET_USER_INFO: "getUserInfo",
};
const SOCKET_ADDRESS = 0 ? "http://localhost:8080" : "https://www.datcom.site";

module.exports = {
  INTRANET,
  INTRANET_ORDER,
  INTRANET_LIST,
  INTRANET_USER_INFO,
  INTRANET_DOMAIN,
  GOOGLE_DOMAIN,
  GOOGLE_COOKIE_SMSV,
  GOOGLE_COOKIE_GAPS,
  DEPARTMENTS,
  SOCKET_ACTION,
  SOCKET_ADDRESS,
};
