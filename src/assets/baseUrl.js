// let netUrl = 'http://101.37.103.127:8080/';
console.log(process.env.NODE_ENV);
// let netUrl = 'https://i.xiaoyatong.com:8080/';
let netUrl = 'https://api.xiaoyatong.com/';
let netSocketUrl = 'http://socket.xiaoyatong.com/'
let baseUrl = netUrl;
let socketUrl = netSocketUrl;
let localUrl = 'http://192.168.70.250:3000/';
let localSocketUrl = 'http://192.168.70.250:9090/';
let localAddrStart = ['localhost', '192'];
let demoUrl = 'https://demo.xiaoyatong.com:30005/';
let demoAddrStart = ['demo'];
let localFlag = localAddrStart.some(n => {
  return window.location.host.startsWith(n);
})
if (localFlag) {
  baseUrl = localUrl;
  socketUrl = localSocketUrl;
}
let demoFlag = demoAddrStart.some(n => {
  return window.location.host.startsWith(n);
})
if (demoFlag) {
  baseUrl = demoUrl;
}
export {
  baseUrl,
  socketUrl
};
export let imgUrl = `${baseUrl}noLogin/operLogin/generateVerifyImage`;
