$(function () {
  $('.fa-minus').click(function () {
    $(this).closest('.chatbox').toggleClass('chatbox-min');
  });
});

// socket.io real time chat script

var socket = io.connect();

socket.on('chat', function (data) {
  console.log("chat recived " + data)
  var msg = data.nick + ':' + data.time + ':' + data.message;
  $('#message-box-holder').append(`
  <div class="message-box-holder">
                <div class="message-sender">
                    ${data.nick}
                </div>
                <div class="message-box message-partner">
                    ${data.message}
                </div>
            </div>
  `
  )
  // $('textarea').val($('textarea').val() + msg + '\n');
});

socket.on('userlist', (data) => {
  let total = data.length;
  let onlineUser = total < 1 ? 'No online user found' : `${total} Number of user are online`
  document.getElementById('online-users').innerHTML = onlineUser
  // $('b').val(total);
})

// Handle UI
$(function () {
  // Set nickname
  $('#click-name').on('click', function () {
    socket.emit('nick', $('#nick-name').val());
  });
  // Send chat message
  $('#chat').on('click', function () {
    socket.emit('chat', {
      message: $('#chatText').val()
    });
  });
});

var uiusers = sessionStorage.getItem('users');
console.log(uiusers)
