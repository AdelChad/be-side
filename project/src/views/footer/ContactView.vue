<template>
  <main class="static-page">
    <div class="content">
      <h1>Contact</h1>
      <p>Une question, une remarque ou une idée ? Nous serions ravis d’échanger avec vous.</p>
      
      <p><strong>Email : </strong>
        <a class="email-link" href="mailto:contact@beside.app">contact@beside.app</a>
      </p>
      
      <p><strong>Équipe :</strong> Claudio, Adel & Kyllian</p>
      <p>Ce site est un projet étudiant réalisé à <strong>ENSITECH</strong>.</p>
    </div>
  </main>
</template>

<style scoped>
@import '../../assets/styles/StaticPageStyle.css';

.email-link {
  color: var(--color-accent);
  text-decoration: underline;
  font-weight: 500;
}

.email-link:hover {
  color: var(--color-primary);
}
</style>
