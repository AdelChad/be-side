<script setup>
import Header from './Header.vue'
import { ref } from 'vue'



const newMessage = ref('')

function sendMessage() {
  if (newMessage.value.trim() === '') return
  console.log('Message envoyé :', newMessage.value)
  newMessage.value = ''
}
</script>


<template>
  <div class="chat-window">
    <Header />
    <div class="chat-content">
      <div class="chat-messages">
        <div class="message received">
          <span>OMG 😏 do you remember what you did last night at the work night out?</span>
          <div class="timestamp">18:12 ❤️</div>
        </div>
        <div class="message sent">
          <span>no haha</span>
          <div class="timestamp">18:16</div>
        </div>
        <div class="message sent">
          <span>i don't remember anything 😅</span>
          <div class="timestamp">18:16</div>
        </div>
      </div>
            <div class="chat-input">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Écris un message..."
          @keyup.enter="sendMessage"
        />
        <button class="send-button" @click="sendMessage">Envoyer</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-image: url('../../assets/background beside jaune.png');
  background-size: cover;
  background-position: center;
}
/* Nouvelle structure pour isoler messages + input */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 60%;
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.message.received { 
  background-color: white;
  color: black;
  align-self: flex-start;
}

.message.sent {
  background-color: #e99415;
  align-self: flex-end;
}

.timestamp {
  font-size: 12px;
  text-align: right;
  margin-top: 4px;
  color: gray;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 12px;
  border-top: 1px solid #ccc;
  background-color: #fff;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.send-button {
  margin-left: 8px;
  padding: 8px 12px;
  background-color: #e99415;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
}

.send-button:hover {
  background-color: #a27f4a;
}

</style>
