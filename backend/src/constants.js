export const ChatEventEnum = {
    // When a user joins a specific chat room
    JOIN_CHAT_EVENT: 'join_chat_event',
  
    // When a user starts typing in the chat
    TYPING_EVENT: 'typing_event',
  
    // When a user stops typing
    STOP_TYPING_EVENT: 'stop_typing_event',
  
    // When a user sends a message to the chat
    MESSAGE_SENT_EVENT: 'message_sent_event',
  
    // When a user receives a message in the chat
    MESSAGE_RECEIVED_EVENT: 'message_received_event',
  
    // When a user leaves the chat
    LEAVE_CHAT_EVENT: 'leave_chat_event',
  
    // When the user connects to the chat
    CONNECTED_EVENT: 'connected_event',
  
    // When there's an error in socket communication
    SOCKET_ERROR_EVENT: 'socket_error_event',
  
    // When a user starts a call in the chat
    START_CALL_EVENT: 'start_call_event',
  
    // When a call is answered by the other user
    ANSWER_CALL_EVENT: 'answer_call_event',
  
    // When a call is ended
    END_CALL_EVENT: 'end_call_event',
  
    // When a user is disconnected
    DISCONNECT_EVENT: 'disconnect_event',
  
    // When a user is typing a message
    TYPING_INDICATOR_EVENT: 'typing_indicator_event',
  };
  