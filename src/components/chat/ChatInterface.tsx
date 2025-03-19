// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import SocketService from '@/lib/services/socketService';
// import { useAuth } from '@/lib/hooks/useAuth';

// interface Message {
//   id: string;
//   sender: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
// }

// export default function ChatInterface() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { user } = useAuth();
//   const socketService = SocketService.getInstance();

//   useEffect(() => {
//     if (user?.token) {
//       const socket = socketService.connect(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000', user.token);
      
//       socket.on('message', (message: Message) => {
//         setMessages(prev => [...prev, message]);
//       });
      
//       return () => {
//         socketService.disconnect();
//       };
//     }
//   }, [user]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = () => {
//     if (input.trim() === '') return;
    
//     const newMessage: Message = {
//       id: Date.now().toString(),
//       sender: 'user',
//       content: input,
//       timestamp: new Date(),
//     };
    
//     setMessages(prev => [...prev, newMessage]);
//     setInput('');
    
//     const socket = socketService.getSocket();
//     if (socket) {
//       socket.emit('message', { content: input });
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((message) => (
//           <div 
//             key={message.id} 
//             className={`mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
//           >
//             <div 
//               className={`p-3 rounded-lg ${
//                 message.sender === 'user' 
//                   ? 'bg-blue-500 text-white rounded-br-none' 
//                   : 'bg-gray-200 text-gray-800 rounded-bl-none'
//               }`}
//             >
//               {message.content}
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               {message.timestamp.toLocaleTimeString()}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
      
//       <div className="border-t p-4">
//         <div className="flex">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//             className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Ask about your data science courses..."
//           />
//           <button
//             onClick={handleSend}
//             className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }