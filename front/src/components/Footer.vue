<template>
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-links">
            <div class="footer-logo">
          <img src="../assets/BesideLogo.png" alt="Logo" width="100">
        </div>
          <div class="footer-column">
            <h4>About Us</h4>
            <ul>
              <li><a href="#">Company Overview</a></li>
              <li><a href="#">Our Mission & Values</a></li>
              <li><a href="#">Destinations</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press Releases</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Live Chat</a></li>
              <li><a href="#">Feedback & Suggestions</a></li>
              <li><a href="#">Accessibillity</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><a href="#">Special Offers</a></li>
              <li><a href="#">Last-Minute Deals</a></li>
              <li><a href="#">Travel Guides</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Blog & Travel Tips</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Support & Membership</h4>
            <ul>
              <li><a href="#">Loyalty Program</a></li>
              <li><a href="#">Rewards & Benefits</a></li>
              <li><a href="#">Unlock Exclusive Offers</a></li>
              <li><a href="#">Booking Policies</a></li>
              <li><a href="#">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
  
      <!-- Liseré blanc -->
      <div class="footer-divider"></div>
  
      <!-- Réseaux sociaux et copyright -->
      <div class="footer-bottom">
        <p>© 2024 Ascenda. All rights reserved.</p>
        <div class="social-icons">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  </script>
  
<style scoped>
.footer {
  background-color: #181818;
  color: white;
  padding: 40px 20px;
  width: 100%;
  bottom: 0;
  left: 0;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  margin-right: 20px; /* Décale le logo un peu à gauche */
}

/* Organisation des colonnes */
.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-grow: 1;
  width: 100%;
  align-items: center; /* Centre verticalement */
  gap: 40px; /* Espacement entre le logo et les colonnes */
}

/* Gestion des colonnes */
.footer-column {
  flex: 1;
  min-width: 180px;
  margin: 0 10px;
}

.footer-column h4 {
  font-size: 18px;
  margin-bottom: 10px;
  border-bottom: 2px solid white;
  display: inline-block;
  padding-bottom: 5px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin: 5px 0;
}

.footer-column ul li a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column ul li a:hover {
  color: gray;
}

/* Liseré blanc */
.footer-divider {
  width: 100%;
  height: 2px;
  background-color: white;
  margin: 20px 0;
}

/* Partie bas du footer */
.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 0;
}

/* Réseaux sociaux */
.social-icons {
  display: flex;
  gap: 15px;
}

.social-icons a {
  color: white;
  font-size: 20px;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #00ADEF;
}

/* 🟢 Responsive Design */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
  }

  .footer-column {
    margin-bottom: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>

  