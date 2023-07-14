//Cliente
const socket = io();

let user; 
const chatbox = document.getElementById('chatBox');

Swal.fire({
   title: 'Hora de Identificarse',
   input: 'text',
   text: 'Ingresá tu nombre para unirte a la sala de chat',
   inputValidator: (value) =>{
      return !(value) && "Es requerido un nombre de usuario para ingresar a la sala."
   },
   allowOutsideClick: false,
   allowEscapeKey: false
}).then ( result =>{
   user = result.value;
   socket.emit('authenticated', user);
});

chatbox.addEventListener('keyup', evt =>{
   if (evt.key === 'Enter'){
      if(chatbox.value.trim().length > 0){
         socket.emit('message', {user, message: chatbox.value});
         chatbox.value = "";
      };
   };
});

socket.on('messageLogs', data =>{
   let log = document.getElementById('messageLogs');
   let messages = '';
   data.forEach (message =>{
      messages += `${message.user} dice: ${message.message} </br>`;
   });
   log.innerHTML = messages;
});

socket.on('newUserConnected', data =>{
   Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmationButton: false,
      timer: 3000,
      title: `${data} se ha unido al canal`,
      icon: 'success'
   });
});