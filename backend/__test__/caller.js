import io from 'socket.io-client';

const socket = io('http://localhost:8080'); // Connect to your server

socket.on('connect', () => {
  console.log('Caller connected');
  
  // Send a "start call" event to the server
  socket.emit('start_call', { target: 'receiver', data: { sdp: 'offer-sdp-data' } });
});

socket.on('call_response', (data) => {
  console.log('Call Response:', data);
});

socket.on('offer_received', (data) => {
  console.log('Offer received:', data);
  // Respond with an answer
  socket.emit('create_answer', { target: 'caller', data: { sdp: 'answer-sdp-data' } });
});

socket.on('answer_received', (data) => {
  console.log('Answer received:', data);
  // Now the call is established
});
