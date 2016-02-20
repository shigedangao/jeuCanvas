(function() {
  document.addEventListener('DOMContentLoaded', initBo, false);
})();

function initBo(){
  console.log('fired');

  var bo = io();
  bo.emit("sendToken", {tokenSave : localStorage.getItem('token')});
}
