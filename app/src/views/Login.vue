<template>
  <div class="main">
    <div class="left">
      <img src="@/static/interLogo.png" alt="logo" />
    </div>
    <div class="right">
      <b-form class="formulario" @submit="onSubmit">
        <b-form-group label="Email" label-for="email">
          <b-form-input
            id="email"
            type="text"
            v-model="form.email"
            placeholder="Email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Senha" label-for="senha">
          <b-form-input
            id="senha"
            type="password"
            v-model="form.senha"
            placeholder="Senha"
            required
          ></b-form-input>
        </b-form-group>
        <b-button type="submit">Entrar</b-button>
      </b-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        email: "",
        senha: "",
      },

      usuario: {
        nome: "",
        perfil: "",
      },
    };
  },

  mounted() {
    if (localStorage.nome) {
      this.usuario.nome = localStorage.nome;
    }
    if (localStorage.perfil) {
      this.usuario.perfil = localStorage.perfil;
    }
  },

  methods: {
    async onSubmit(event) {
      event.preventDefault();

      const response = await this.$axios
        .post("login", this.form)
        .then((response) => {
          localStorage.nome = response.data.nome;
          localStorage.perfil = response.data.perfil;

          this.$router.push("/");
        })
        .catch((erro) => {
          this.limparForm();

          this.$bvToast.toast("Usuário ou senha inválidos", {
            title: "Erro",
            variant: "warning",
            autoHideDelay: 2000,
            solid: true,
          });
        });
    },

    limparForm() {
      this.form.email = "";
      this.form.senha = "";
    },
  },
};
</script>

<style scoped>
.main {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}
.left {
  height: 300px;
  width: 300px;
  margin-right: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.left img {
  height: 300px;
  border-radius: 50%;
  background: #f5f5f5;
  box-shadow: 20px 20px 60px #d0d0d0, -20px -20px 60px #ffffff;
}

.right {
  height: 350px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  background: linear-gradient(145deg, #ffffff, #dddddd);
  box-shadow: 20px 20px 60px #d0d0d0, -20px -20px 60px #ffffff;
}

@media only screen and (max-width: 700px) {
  .main {
    flex-direction: column;
  }
  .left {
    margin-right: 0;
    margin-bottom: 15%;
  }
  .left img {
    height: 200px;
    width: 200px;
  }
}
</style>
