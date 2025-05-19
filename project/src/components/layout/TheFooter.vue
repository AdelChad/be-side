<script setup lang="ts">
    import { ref } from 'vue'
    import { useRoute } from 'vue-router'
    const route = useRoute()

    const currentYear = ref(new Date().getFullYear())
</script>

<template>
    <footer v-if="!route.meta.hideFooter">
        <div class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                </div>
            
                <div class="footer-links">
                    <div class="footer-section">
                        <h5 class="footer-heading">About Us</h5>
                        <ul class="footer-list">
                        <li><a href="#">Company Overview</a></li>
                        <li><a href="#">Our Mission & Values</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Press Releases</a></li>
                        </ul>
                    </div>
                
                    <div class="footer-section">
                        <h5 class="footer-heading">Customer Service</h5>
                        <ul class="footer-list">
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Live Chat</a></li>
                        <li><a href="#">Cancellation Policy</a></li>
                        <li><a href="#">Booking Policies</a></li>
                        </ul>
                    </div>
                
                    <div class="footer-section">
                        <h5 class="footer-heading">Explore</h5>
                        <ul class="footer-list">
                        <li><a href="#">Destinations</a></li>
                        <li><a href="#">Special Offers</a></li>
                        <li><a href="#">Last Minute Deals</a></li>
                        <li><a href="#">Travel Guides</a></li>
                        <li><a href="#">Blog & Travel Tips</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h5 class="footer-heading">Support</h5>
                        <ul class="footer-list">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Accessibility</a></li>
                        <li><a href="#">Feedback & Suggestions</a></li>
                        <li><a href="#">Sitemap</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h5 class="footer-heading">Membership</h5>
                        <ul class="footer-list">
                        <li><a href="#">Loyalty Program</a></li>
                        <li><a href="#">Member Exclusive Offers</a></li>
                        <li><a href="#">Rewards & Benefits</a></li>
                        <li><a href="#">Feedback & Suggestions</a></li>
                        <li><a href="#">Sitemap</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        
            <div class="footer-bottom">
                <p class="copyright">© {{ currentYear }} BeSide. All rights reserved.</p>
            </div>
        </div>
        </div>
    </footer>
</template>

<style scoped>
    .footer {
        background-color: var(--color-primary);
        padding: var(--space-5) 0 var(--space-3);
        margin-top: var(--space-6);
    }

    .footer-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-4);
        margin-bottom: var(--space-5);
    }

    .footer-logo-img {
        height: 2.5rem;
        margin-bottom: var(--space-3);
    }

    .footer-links {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-4);
    }

    .footer-heading {
        font-weight: 600;
        margin-bottom: var(--space-3);
        color: var(--color-secondary);
        font-size: 1rem;
    }

    .footer-list {
        list-style: none;
    }

    .footer-list li {
        margin-bottom: var(--space-2);
    }

    .footer-list a {
        color: var(--color-neutral-400);
        transition: color var(--transition-fast);
        font-size: 0.875rem;
    }

    .footer-list a:hover {
        color: var(--color-secondary);
    }

    .footer-bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: var(--space-3);
        border-top: 1px solid var(--color-neutral-800);
        gap: var(--space-3);
    }

    .copyright {
        color: var(--color-neutral-500);
        font-size: 0.875rem;
    }

    .social-icons {
        display: flex;
        gap: var(--space-3);
    }

    .social-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: var(--color-neutral-800);
        transition: background-color var(--transition-fast);
    }

    .social-icon:hover {
        background-color: var(--color-neutral-700);
    }

    .social-icon img {
        width: 1rem;
        height: 1rem;
    }

    @media (min-width: 768px) {
        .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
        }
    }
</style>