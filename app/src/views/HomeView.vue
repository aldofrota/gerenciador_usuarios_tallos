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
      <div class="users">
        <div class="title">
          <v-icon class="icon-user" name="hi-solid-users" />
          <span>Usuários</span>
        </div>
        <div class="user-card" v-for="user in users_online">
          <UserCard :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import UserCard from "../components/UserCard.vue";
import UserPopover from "../components/UserPopover.vue";
import Notifications from "../components/Notifications.vue";

export default {
  components: {
    UserCard,
    UserPopover,
    Notifications,
  },

  data() {
    return {
      users_online: [],
      socket: io("http://192.168.0.103:3000", {
        query: {
          user: JSON.stringify(this.$store.getters.getUserData),
        },
      }),
    };
  },

  mounted() {
    this.socket.on("connected", (users) => {
      this.users_online.splice(0);
      this.users_online.push(...users);
    });

    this.socket.on("desconnected", (users) => {
      this.users_online.splice(0);
      this.users_online.push(...users);
    });

    const userData = this.$store.getters.getUserData;
    if (!userData || !userData.name || !userData.email || !userData.token) {
      this.$router.push("/login");
    }
  },

  methods: {
    sendMessage(message) {
      this.socket.emit("message", message);
    },
    logout() {
      this.$store.dispatch("logout");
      this.socket.disconnect();
      this.$router.push("/login");
    },
  },

  computed: {
    user() {
      return {
        name: this.$store.getters.getUserData.name,
        email: this.$store.getters.getUserData.email,
        level: this.$store.getters.getUserData.level,
      };
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
  gap: 30px;
  padding: 10px;

  .sidebar {
    height: 80px;
    width: 100%;
    padding: 5px 10px;
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
    height: 100%;
    width: 100%;
    display: flex;

    .users {
      height: 90%;
      width: 20%;
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
  }
}
</style>
