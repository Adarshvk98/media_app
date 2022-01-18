$(function () {
  $('#open-chat').click(function () {
    $('#chat-menu').toggleClass('fa-chevron-down fa-chevron-up');
    $(this).closest('.chatbox').toggleClass('chatbox-min');
  });
});

// socket.io real time chat script

var socket = io.connect();

socket.on('chat', function (data) {
  $('#message-box-holder').append(`
  <div class="message-box-holder">
        <div class="message-sender">
              ${data.nick}  <time>${data.time}</time>
        </div>
        <div class="message-box message-partner">
              ${data.message}
        </div>
    </div>
  `
  )
});

socket.on('userlist', (data) => {
  let total = data.length;
  let onlineUser = total < 1 ? `No online user's found` : `${total} online`
  document.getElementById('online-users').innerHTML = onlineUser
  
})

// Handle UI
$(function () {
  // Set nickname
  $('#click-name').on('click', function () {
    socket.emit('nick', $('#nick-name').val());
  });
  // Send chat message
  $('#chat').on('click', function () {
    var message = $('#chatText').val()
    if(message.length > 0 ){
      socket.emit('chat', {
        message: $('#chatText').val()
      });
    }
  });
});