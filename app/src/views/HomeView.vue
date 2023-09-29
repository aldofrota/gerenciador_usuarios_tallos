<template>
  <div class="main" v-if="user.name">
    <div class="sidebar">
      <div class="logo">
        <img src="/tallos-logo.png" alt="Logo Tallos" />
        <span>Tallos Users</span>
      </div>
      <div class="user-data">
        <Notifications :socket="socket" />
        <UserPopover :logout="logout" :user="user" />
      </div>
    </div>
    <div class="content">
      <div class="users">
        <div class="title">
          <v-icon class="icon-user" name="hi-status-online" />
          <span>Online</span>
        </div>

        <div class="user-card" v-for="user in users_online">
          <UserCard :user="user" />
        </div>
      </div>
      <div class="users-list">
        <div class="title">
          <div class="icon-title">
            <v-icon class="icon-user" name="hi-solid-users" />
            <span>Usuários</span>
          </div>
          <button
            class="btn-add-user"
            :disabled="!user.permissions.register"
            data-bs-toggle="modal"
            data-bs-target="#new_user"
          >
            <v-icon class="icon-add-user" name="fa-user-plus" />
          </button>
        </div>
        <div class="cards">
          <div class="user-card" v-for="user in users_list">
            <UserCardList :user="user" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="new_user" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            Cadastrar Usuário
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal()"
          ></button>
        </div>
        <div class="modal-body">
          <form class="register" @submit="onSubmitRegister">
            <div>
              <label for="name" class="form-label">Nome</label>
              <input
                id="name"
                class="form-control"
                type="text"
                v-model="register_form.name"
                placeholder="Nome"
                minlength="3"
                required
              />
            </div>
            <div>
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                type="email"
                class="form-control"
                v-model="register_form.email"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label class="form-label" for="password">Senha</label>
              <input
                id="password"
                class="form-control"
                type="password"
                v-model="register_form.password"
                placeholder="Senha"
                minlength="8"
                required
              />
            </div>
            <div>
              <label class="form-label" for="repeat_password">
                Repetir Senha
              </label>
              <input
                id="repeat_password"
                class="form-control"
                type="password"
                v-model="register_form.repeat_password"
                placeholder="Repetir Senha"
                minlength="8"
                required
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            id="close-modal"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            ref="cancelBtn"
            @click="closeModal()"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="onSubmitRegister($event)"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import UserCard from "../components/UserCard.vue";
import UserCardList from "../components/UserCardList.vue";
import UserPopover from "../components/UserPopover.vue";
import Notifications from "../components/Notifications.vue";

import { toast } from "vue3-toastify";
import axios from "axios";
import env from "../config/env.js";

export default {
  components: {
    UserCard,
    UserPopover,
    Notifications,
    UserCardList,
  },

  data() {
    return {
      users_online: [],
      users_list: [],
      socket: io(env.API_URL, {
        query: {
          user: JSON.stringify(this.$store.getters.getUserData),
        },
      }),
      register_form: {
        name: "",
        email: "",
        password: "",
        repeat_password: "",
      },
    };
  },

  mounted() {
    this.socket.on("connected", (users) => {
      this.users_online.splice(0);
      this.users_online.push(...users);
      if (this.isLoged) {
        this.getUsers();
      }
    });

    this.socket.on("desconnected", (users) => {
      this.users_online.splice(0);
      this.users_online.push(...users);
    });

    this.socket.on("update-role-user-on", (new_status) => {
      let newState = { ...this.user };
      newState.role = new_status.role;
      newState.permissions = new_status.permissions;
      this.$store.dispatch("login", newState);
      if (this.isLoged) {
        this.getUsers();
      }
    });

    this.socket.on("update-role", (users) => {
      this.users_online.splice(0);
      this.users_online.push(...users);
      if (this.isLoged) {
        this.getUsers();
      }
    });

    this.socket.on("new-user", (user) => {
      if (this.isLoged) {
        this.getUsers();
      }
    });

    this.socket.on("deleted-user-on", (data) => {
      toast("Seu cadastro foi Excluido da Plataforma", {
        type: "warning",
      });
      this.logout();
    });

    this.socket.on("deleted-user", (data) => {
      if (this.isLoged) {
        this.getUsers();
      }
    });

    const userData = this.$store.getters.getUserData;
    if (!userData || !userData.name || !userData.email || !userData.token) {
      this.$router.push("/login");
    } else {
      this.getUsers();
    }
  },

  methods: {
    sendMessage(message) {
      this.socket.emit("message", message);
    },
    logout() {
      this.socket.disconnect();
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },

    getUsers() {
      const token = this.$store.getters.getUserData.token;
      axios
        .get(`${env.API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          this.users_list.splice(0);
          this.users_list.push(...res.data);
        })
        .catch((error) => {
          toast("Erro ao buscar usuários: " + error.response.data.message, {
            type: "error",
          });
        });
    },

    onSubmitRegister(event) {
      event.preventDefault();
      const data = { ...this.register_form };
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(data.email)) {
        toast("O e-mail não possui um formato válido", {
          type: "warning",
        });
        return;
      }
      if (data.password !== data.repeat_password) {
        toast("As senhas não coincidem", {
          type: "warning",
        });
        return;
      } else {
        delete data.repeat_password;
      }

      axios
        .post(`${env.API_URL}/users`, data)
        .then(() => {
          toast("Cadastro realizado", {
            type: "success",
          });
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
          toast("Erro ao realizar cadastro: " + error.response.data.message, {
            type: "error",
          });
        });
    },

    closeModal() {
      this.$refs.cancelBtn.click();

      this.register_form.name = "";
      this.register_form.email = "";
      this.register_form.password = "";
      this.register_form.repeat_password = "";
    },
  },

  computed: {
    user() {
      return {
        name: this.$store.getters.getUserData.name,
        email: this.$store.getters.getUserData.email,
        role: this.$store.getters.getUserData.role,
        token: this.$store.getters.getUserData.token,
        permissions: this.$store.getters.getUserData.permissions,
      };
    },
    isLoged() {
      const userData = this.$store.getters.getUserData;
      if (userData.name && userData.email && userData.token) {
        return true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .sidebar {
    height: 80px;
    width: 100%;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;

      img {
        height: 60px;
      }
      span {
        color: #009acc;
        font-size: 2rem;
        font-weight: 600;
      }
    }

    .user-data {
      display: flex;
      align-items: center;
      gap: 20px;

      .icon-notifications {
        height: 40px;
        width: 40px;
        color: #009acc;
        cursor: pointer;
      }
    }
  }

  .content {
    height: calc(100% - 80px);
    width: 100%;
    display: flex;
    padding: 20px 10px;

    .users {
      height: 100%;
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 20px;
      background: #e0e0e0;
      box-shadow: 14px 14px 30px #acacac, -14px -14px 30px #ffffff;
      margin-left: 20px;
      overflow: auto;

      .title {
        height: 10%;
        width: 100%;
        background-color: #d8d5d5;
        border-radius: 20px 20px 0 0;
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;
        padding: 10px;
        color: #009acc;

        .icon-user {
          height: 35px;
          width: 35px;
        }
        span {
          font-size: 1.6rem;
          margin-left: 15px;
        }
      }

      .user-card {
        width: calc(100%);
        display: flex;
        justify-content: center;
      }
    }

    .users-list {
      height: 100%;
      width: 75%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 20px;
      background: #e0e0e0;
      box-shadow: 14px 14px 30px #acacac, -14px -14px 30px #ffffff;
      margin-left: 20px;

      .title {
        height: 10%;
        width: 100%;
        background-color: #d8d5d5;
        border-radius: 20px 20px 0 0;
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        color: #009acc;

        .icon-user {
          height: 35px;
          width: 35px;
        }
        span {
          font-size: 1.6rem;
          margin-left: 15px;
        }

        .btn-add-user {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          color: #009acc;
          .icon-add-user {
            height: 35px;
            width: 35px;
          }
        }

        .btn-add-user:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      }

      .cards {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        overflow: auto;
        padding: 5px 10px;

        .user-card {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
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
</style>
