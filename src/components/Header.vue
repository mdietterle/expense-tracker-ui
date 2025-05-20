<template>
  <header>
    <img :src="user.profilePicture" alt="Foto de Perfil" class="profile-picture" v-if="user.profilePicture">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/expenses">Despesas</router-link></li>
        <li><router-link to="/profile">Perfil</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: 'exampleUser',
        email: 'user@example.com',
        profilePicture: 'https://via.placeholder.com/150' // Exemplo de URL de foto
      }
    };
  }
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

nav ul li {
  margin-left: 20px;
}

nav ul li a {
  color: white;
  text-decoration: none;
}
</style>