import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClashDto } from 'src/clash/dto/create-clash.dto';
import { VoteDto } from 'src/clash/dto/create-vote.dto';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:5173'/*, 'http://127.0.0.1:5500'*/],
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
    ) { }

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
    async handleJoinChannel(@MessageBody() data: { channelId: number }, @ConnectedSocket() client: Socket) {
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
    async handleGetMessages(@MessageBody() data: { channelId: number }, @ConnectedSocket() client: Socket) {
        const messages = await this.chatService.getMessages(data.channelId);
        client.emit('channelMessages', messages);
    }

    @SubscribeMessage('getPlanning')
    async handleGetPlanning(@MessageBody() data: { channelId: number }, @ConnectedSocket() client: Socket) {
        const planning = await this.chatService.getPlanningByChannel(data.channelId);
        client.emit('channelPlanning', planning);
    }

    @SubscribeMessage('getClashes')
    async handleGetClashes(@MessageBody() data: { channelId: number, userId: number }, @ConnectedSocket() client: Socket) {
        const user = (client as any).user;

        if (!user) {
            client.emit('error', 'Unauthorized');
            return;
        }

        const clashes = await this.chatService.getClashsByChannel(data.channelId, data.userId);

        this.server.to(`channel_${data.channelId}`).emit('channelClashes', clashes);
        client.emit('channelClashes', clashes);
    }


    @SubscribeMessage('get_all_activities')
    async handleGetAllActivities(
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const activities = await this.chatService.getAllActivities();
            client.emit('all_activities', activities);
        } catch (error) {
            client.emit('error', { message: 'Erreur lors de la récupération des activités.' });
        }
    }

    @SubscribeMessage('get_all_restaurants')
    async handleGetAllRestaurants(
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const restaurants = await this.chatService.getAllRestaurants();
            client.emit('all_restaurants', restaurants);
        } catch (error) {
            client.emit('error', { message: 'Erreur lors de la récupération des restaurants.' });
        }
    }

    @SubscribeMessage('createClash')
    async handleCreateClash(@MessageBody() data: { createClashDto: CreateClashDto }, @ConnectedSocket() client: Socket) {
        const user = (client as any).user;

        if (!user) {
            client.emit('error', 'Unauthorized');
            return;
        }

        const clash = await this.chatService.createClash(data.createClashDto, user);

        const fullClash = await this.chatService.getClashsByChannel(data.createClashDto.channelId, user.id);
        const emittedClash = fullClash.find(c => c.id === clash.id);

        this.server.to(`channel_${data.createClashDto.channelId}`).emit('newClash', emittedClash);
        client.emit('clashSent', emittedClash);
    }


    @SubscribeMessage('submitVote')
    async handleVoteClash(
        @MessageBody() data: { voteDto: VoteDto },
        @ConnectedSocket() client: Socket,
    ) {
        const user = (client as any).user;
        if (!user) {
            client.emit('error', 'Unauthorized');
            return;
        }

        try {
            const vote = await this.chatService.submitVote(data.voteDto, user);

            const updatedClash = await this.chatService.getClashWithVotes(data.voteDto.clashId, user.id);

            const channelId = vote.clash.channel.id;
            this.server.to(`channel_${channelId}`).emit('clashUpdate', updatedClash);

            client.emit('voteSent', updatedClash);
        } catch (error) {
            client.emit('error', 'Vote error');
        }
    }
}