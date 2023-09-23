<template>
  <div class="main">
    <div class="card">
      <form v-if="login" class="login" @submit="onSubmitLogin">
        <img src="/tallos-logo.png" alt="Logo Tallos" />
        <input
          id="email"
          type="text"
          v-model="login_form.email"
          placeholder="Email"
          required
        />
        <input
          id="senha"
          type="password"
          v-model="login_form.password"
          placeholder="Senha"
          minlength="8"
          required
        />
        <button type="submit">LOGIN</button>
        <span @click="switchForms()">Não tenho cadastro</span>
      </form>

      <form v-if="register" class="register" @submit="onSubmitRegister">
        <img src="/tallos-logo.png" alt="Logo Tallos" />
        <input
          id="name"
          type="text"
          v-model="register_form.name"
          placeholder="Nome"
          minlength="3"
          required
        />
        <input
          id="email"
          type="email"
          v-model="register_form.email"
          placeholder="Email"
          required
        />
        <input
          id="password"
          type="password"
          v-model="register_form.password"
          placeholder="Senha"
          minlength="8"
          required
        />
        <input
          id="repeat_password"
          type="password"
          v-model="register_form.repeat_password"
          placeholder="Repeat Password"
          minlength="8"
          required
        />
        <button type="submit">REGISTRAR-SE</button>
        <span @click="switchForms()">Fazer Login</span>
      </form>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import axios from "axios";

export default {
  data() {
    return {
      register: false,
      login: true,
      login_form: {
        email: "",
        password: "",
      },
      register_form: {
        name: "",
        email: "",
        password: "",
        repeat_password: "",
      },
    };
  },

  mounted() {},

  methods: {
    onSubmitLogin(event) {
      event.preventDefault();
    },

    onSubmitRegister(event) {
      event.preventDefault();
      const data = { ...this.register_form };
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(data.email)) {
        toast("O e-mail não possui um formato válido", {
          type: "info",
        });
        return;
      }
      if (data.password !== data.repeat_password) {
        toast("As senhas não coincidem", {
          type: "info",
        });
        return;
      } else {
        delete data.repeat_password;
      }

      axios
        .post("http://localhost:3000/users", data)
        .then(() => {
          toast("Cadastro realizado", {
            type: "success",
          });
          this.login_form.email = data.email;
          this.login_form.password = data.password;
          this.switchForms();
        })
        .catch((error) => {
          toast("Erro ao realizar cadastro: " + error.response.data.message, {
            type: "error",
          });
        });
    },

    clearFormLogin() {
      this.login_form.email = "";
      this.login_form.password = "";
    },
    clearFormRegister() {
      this.register_form.name = "";
      this.register_form.email = "";
      this.register_form.password = "";
      this.register_form.repeat_password = "";
    },

    switchForms() {
      this.register = !this.register;
      this.login = !this.login;

      if (this.login) {
        this.clearFormRegister();
      } else {
        this.clearFormLogin();
      }
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

  .card {
    transition: all 0.6s;

    .login,
    .register {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;

      img {
        height: 100px;
        width: 100px;
      }

      input {
        padding: 6px 20px;
        height: 55px;
        width: 400px;
        border-radius: 15px;
        border: 1px solid #d7d7d7;
        background-color: none;
        font-size: 17px;
        letter-spacing: 1px;
      }
      input:focus {
        outline-color: #009acc;
      }

      button {
        height: 40px;
        padding: 4px 18px;
        background-color: #009acc;
        color: #fff;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
      }

      span {
        color: #009acc;
        cursor: pointer;
      }
    }
  }
}
</style>
