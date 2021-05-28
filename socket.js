const api = require("./utils/api");
const { getCookie } = require("./utils/cookie");
const { SOCKET_ACTION, SOCKET_ADDRESS, DEPARTMENTS } = require("./constant");

let prevSocket;
const defaultDepartment = DEPARTMENTS[0];

function log(action, data) {
  if (data.statusCode === 200) {
    console.log(`${action} succeed ✓`);
  } else {
    console.log(`${action} failed ⚠`);
    console.log(`- ${data.data}`);
  }
}

/* Connect to external server */
function setupSocket(io) {
  console.log("Inititalize socket.io");

  if (prevSocket) {
    prevSocket.emit("forceDisconnect");
    prevSocket = null;
  }

  const socket = io.connect(SOCKET_ADDRESS, {
    reconnect: true,
  });
  prevSocket = socket;

  socket.on("connect", () => {
    socket.emit(SOCKET_ACTION.I_AM_INTRANET);
    console.log("Socket connected ✓");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected ✓");
  });

  /* Validate cookie action */
  socket.on(SOCKET_ACTION.VALIDATE_COOKIE, async (payload, ack) => {
    const department = payload ? payload.department : defaultDepartment;
    const isSucceed = await getCookie(department);
    ack &&
      ack({
        statusCode: isSucceed ? 200 : -1,
        data: isSucceed,
      });
    console.log(
      `Validate cookie of ${department} ${isSucceed ? "succeed ✓" : "failed ⚠"}`
    );
  });

  /* Get menu data action */
  socket.on(SOCKET_ACTION.GET_DATA, async (payload, ack) => {
    const department = payload ? payload.department : defaultDepartment;
    const data = await api.getData(department);
    ack && ack(data);
    log(`Get data of ${department}`, data);

    /* Update cookie if 403 error */
    if (data.statusCode === 403) await getCookie(department);
  });

  /* Order food action */
  socket.on(SOCKET_ACTION.SET_FOOD, async (payload, ack) => {
    const department = payload ? payload.department : defaultDepartment;
    const data = await api.setFood(payload, department);
    ack && ack(data);
    log(`Set food of ${department}`, data);

    /* Update cookie if 403 error */
    if (data.statusCode === 403) await getCookie(department);
  });

  /* Get list of ordered action */
  socket.on(SOCKET_ACTION.GET_LIST, async (payload, ack) => {
    const department = payload ? payload.department : defaultDepartment;
    const data = await api.getList(payload, department);
    ack && ack(data);
    log(`Get list of ${department}`, data);

    /* Update cookie if 403 error */
    if (data.statusCode === 403) await getCookie(department);
  });

  socket.on(SOCKET_ACTION.GET_LIST_ALL, async (payload, ack) => {
    const department = payload ? payload.department : defaultDepartment;
    const data = await api.getListAll(payload, department);
    ack && ack(data);
    log(`Get list all of ${department}`, data);

    /* Update cookie if 403 error */
    if (data.statusCode === 403) await getCookie(department);
  });
}

module.exports = setupSocket;
