import io from 'socket.io-client';

const socket = io('http://localhost:8080'); // Connect to your server

socket.on('connect', () => {
  console.log('Receiver connected');
});

socket.on('start_call', (data) => {
  console.log('Start call received:', data);
  // Respond with a "user is ready" message
  socket.emit('call_response', { type: 'call_response', data: 'User is ready for call' });
  
  // Respond to the offer with an offer-received event
  socket.emit('create_offer', { target: 'caller', data: { sdp: 'offer-sdp-data' } });
});

socket.on('offer_received', (data) => {
  console.log('Offer received:', data);
  // Send back an answer
  socket.emit('create_answer', { target: 'caller', data: { sdp: 'answer-sdp-data' } });
});

socket.on('answer_received', (data) => {
  console.log('Answer received:', data);
  // Now the call is established
});
