import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5500'],
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token;

            if (!token) {
                console.warn('Connexion refusée : token manquant');
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token);
            
            const user = await this.userRepository.findOne({
                where: { id: payload.id },
            });

            if (!user) {
                console.warn('Connexion refusée : utilisateur introuvable');
                client.disconnect();
                return;
            }
            
            (client as any).user = user;

            console.log(`✅ ${user.firstName} connecté via WebSocket`);
        } catch (err) {
            console.error('Erreur de connexion WebSocket:', err.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const user = (client as any).user;
        if (user) {
            console.log(`❌ ${user.username} s'est déconnecté`);
        } else {
            console.log('❌ Un client anonyme s\'est déconnecté');
        }
    }

    @SubscribeMessage('joinChannel')
    async handleJoinChannel(
        @MessageBody() data: { channelId: number },
        @ConnectedSocket() client: Socket
    ) {
        const user = (client as any).user;
        if (!user) {
            client.emit('error', 'Unauthorized');
            return;
        }

        const roomName = `channel_${data.channelId}`;
        await client.join(roomName);
        console.log(`✅ ${user.firstName} joined ${roomName}`);

        const messages = await this.chatService.getMessages(data.channelId);
        client.emit('channelMessages', messages);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() data: { channelId: number; content: string }, @ConnectedSocket() client: Socket) {
        const user = (client as any).user;

        if (!user) {
            client.emit('error', 'Unauthorized');
            return;
        }

        const message = await this.chatService.saveMessage(
            data.channelId,
            data.content,
            user,
        );

        this.server.to(`channel_${data.channelId}`).emit('newMessage', message);

        client.emit('messageSent', message);
    }

    @SubscribeMessage('getMessages')
    async handleGetMessages(
        @MessageBody() data: { channelId: number },
        @ConnectedSocket() client: Socket
    ) {
        const messages = await this.chatService.getMessages(data.channelId);
        client.emit('channelMessages', messages);
    }

    @SubscribeMessage('getPlanning')
    async handleGetPlanning(
        @MessageBody() data: { channelId: number },
        @ConnectedSocket() client: Socket
    ) {
        const planning = await this.chatService.getPlanningByChannel(data.channelId);
        client.emit('channelPlanning', planning);
    }
}