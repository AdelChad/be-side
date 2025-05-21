<template>
  <div class="header">
    <img src="https://images.unsplash.com/photo-1707912079134-becf5a3598e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D" class="avatar" />
    <div>
      <div class="name">David Moore</div>
      <div class="status">last seen 5 mins ago</div>
    </div>
  </div>
</template>

<style scoped>
.header {
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.name {
  font-weight: bold;
  color:black;
}

.status {
  font-size: 12px;
  color: gray;
}
</style>