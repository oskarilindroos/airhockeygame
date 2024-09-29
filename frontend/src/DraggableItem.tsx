import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './DraggableItem.css';

const DraggableItem: React.FC = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [serverMessage, setServerMessage] = useState<string>(''); // Single message state

    // Initialize WebSocket connection when the component mounts
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        setSocket(ws);

        ws.onopen = () => {
            console.log('WebSocket connection opened.');
            setServerMessage('Connected to WebSocket server.');
        };

        ws.onmessage = (event) => {
            console.log('Received message: ' + event.data);
            setServerMessage(`Server: ${event.data}`); // Update the server message
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setServerMessage('Error occurred.');
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed.');
            setServerMessage('Connection closed.');
        };

        return () => {
            ws.close();
        };
    }, []);

    // Handle the dragging of the item
    const handleDrag = (event: any, ui: any) => {
        const x = ui.x;
        const y = ui.y;
        console.log(`x: ${x}, y: ${y}`);

        // Send the x and y coordinates to the WebSocket server
        if (socket) {
            const message = JSON.stringify({ x, y });
            socket.send(message);
            console.log(`Sent to server: ${message}`);
        }
    };

    return (
        <>
            <div className='content'>
                <div style={{ marginBottom: '10px' }}>
                    <p>{serverMessage}</p>
                </div>
                <div className='PlayArea'>
                    <Draggable onDrag={handleDrag} bounds="parent">
                        <div className='Ball'></div>
                    </Draggable>
                </div>
            </div>
        </>
    );
};

export default DraggableItem;
