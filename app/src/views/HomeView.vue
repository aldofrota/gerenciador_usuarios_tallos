<template>
  <div class="main" v-if="this.usuario.nome">
    <div class="mensages">
      <span v-for="message in messages">{{ message }}</span>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      messages: [],
      socket: io("http://localhost:3000", {
        query: {
          user: JSON.stringify({
            id: 1,
            usuario: "Aldo Frota",
          }),
        },
      }),
      usuario: {
        nome: "Aldo",
        perfil: "",
      },
    };
  },

  mounted() {
    this.socket.on("message", (message) => {
      console.log(message);
      this.messages.push(message);
    });
    // if (!localStorage.nome) {
    //   this.$router.push("/login");
    // }
    // if (localStorage.nome) {
    //   this.usuario.nome = localStorage.nome;
    // }
    // if (localStorage.perfil) {
    //   this.usuario.perfil = localStorage.perfil;
    // }
  },

  methods: {
    sendMessage(message) {
      this.socket.emit("message", message);
    },
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .mensages {
    display: flex;
    flex-direction: column;
  }
}
</style>
