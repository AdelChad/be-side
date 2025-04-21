<template>
<nav class="navbar">
  <div class="left">
    <a href="#">Lien 1</a>
    <a href="#">Lien 2</a>
    <a href="#">Lien 3</a>
  </div>
  <div id="logo">
            <a href="">
                <img src="../assets/images/beside blanc.png" alt="">
            </a>
        </div>
  <div class="right">
   <a class="btn" href="">Se connecter</a>
   <a class="btn" href="">Créer un compte</a>
  </div>
</nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 10em ;

}

.btn {
    border: 2px solid white;
    color: white;
    margin: 0 5px 0 5px;
    padding:10px 15px 10px 15px;
    border-radius: 5%;
    font-weight: 600;
}


.left, .right {
  display: flex;
}

.left {
    text-transform: uppercase;
}

.left a, .right button {
  margin: 0 10px;
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.left a:hover, .right button:hover {
  color: #f39c12;
}

#logo {
  flex-grow: 1;
  text-align: center;
}


#logo img {
    height:100px;
}
</style> 