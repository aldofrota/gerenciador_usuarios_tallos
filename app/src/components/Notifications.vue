<template>
  <div class="popover">
    <div class="toggle" @click="abrirMenu">
      <input type="checkbox" v-model="open" />
      <span class="button"></span>
      <span class="label"
        ><v-icon
          class="icon-notifications"
          name="oi-bell-fill"
          :animation="notifications.length > 0 && !open ? 'ring' : null"
        />
      </span>
      <span
        v-if="notifications.length > 0 && !open"
        class="bag animate__animated animate__fadeIn"
        >{{ notifications.length }}</span
      >
    </div>

    <div v-if="open" class="animate__animated animate__fadeIn popover-painel">
      <div class="title-notifications">Notificações</div>
      <div class="notifications">
        <div
          v-if="notifications.length > 0"
          class="card"
          v-for="notification in notifications"
        >
          <div class="textBox">
            <div class="textContent">
              <p class="h1">{{ notification.title }}</p>
              <span class="span">{{
                calcularTempoRelativo(notification.time)
              }}</span>
            </div>
            <p class="p">{{ notification.message }}</p>
            <div></div>
          </div>
          <div
            @click="closeNotification(notification)"
            class="close-notification"
          >
            x
          </div>
        </div>
        <div class="img-no-notifications" v-if="notifications.length === 0">
          <img src="/sem-notificacao.jpg" alt="Imagem de sem notificações" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      notifications: [],
      open: false,
    };
  },
  props: {
    socket: {
      required: true,
    },
  },

  mounted() {
    this.socket.on("new-user", (user) => {
      this.notifications.push(user);
    });

    this.socket.on("deleted-user", (user) => {
      this.notifications.push(user);
    });
  },

  methods: {
    callGetUser() {
      this.getUsers();
    },
    abrirMenu() {
      this.open = !this.open;
    },

    calcularTempoRelativo(tempo) {
      const agora = moment();
      const tempoPassado = moment(tempo);
      const diferenca = agora.diff(tempoPassado, "seconds");

      if (diferenca < 60) {
        return `Há ${diferenca} segundos`;
      } else if (diferenca < 3600) {
        const minutos = Math.floor(diferenca / 60);
        return `Há ${minutos} minutos`;
      } else {
        const horas = Math.floor(diferenca / 3600);
        return `Há ${horas} horas`;
      }
    },

    closeNotification(notification) {
      this.notifications = this.notifications.filter(
        (notif) => notif !== notification
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle {
  display: inline-block;
}

.toggle {
  display: flex;
  align-items: center;
  position: relative;
  height: 50px;
  min-width: 50px;
}

.toggle:before {
  box-shadow: 0;
  border-radius: 10px;
  background: #fff;
  position: absolute;
  opacity: 0.2;
  height: 52px;
  min-width: 50px;
}

.toggle .bag {
  background-color: red;
  position: absolute;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #fff;
  font-size: 0.8rem;
}

.toggle .button {
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 20px -4px rgba(0, 0, 0, 0.5),
    inset 0 -3px 4px -1px rgba(0, 0, 0, 0.2),
    0 -10px 10px -1px rgba(255, 255, 255, 0.6),
    inset 0 3px 4px -1px rgba(255, 255, 255, 0.2),
    inset 0 0 5px 1px rgba(255, 255, 255, 0.8),
    inset 0 20px 10px 0 rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: absolute;
  background: #eaeaea;
  display: block;
  height: 52px;
  width: 50px;
}

.toggle .label {
  transition: color 300ms ease-out;
  line-height: 101px;
  text-align: center;
  position: absolute;
  font-weight: 700;
  font-size: 28px;
  display: block;
  opacity: 0.9;
  height: 100%;
  width: 100%;
  color: #009acc;
  top: -52%;

  .icon-notifications {
    height: 25px;
    width: 25px;
  }
}

.toggle input {
  opacity: 0;
  position: absolute;
  cursor: pointer;
  z-index: 1;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.toggle input:active ~ .button {
  filter: blur(0.5px);
  box-shadow: 0 12px 25px -4px rgba(0, 0, 0, 0.4),
    inset 0 -8px 30px 1px rgba(255, 255, 255, 0.9),
    0 -10px 15px -1px rgba(255, 255, 255, 0.6),
    inset 0 8px 25px 0 rgba(0, 0, 0, 0.4),
    inset 0 0 10px 1px rgba(255, 255, 255, 0.6);
}

.toggle input:active ~ .label {
  font-size: 26px;
  color: #0099cc;
}

.toggle input:checked ~ .button {
  filter: blur(0.5px);
  box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.4),
    inset 0 -8px 25px -1px rgba(255, 255, 255, 0.9),
    0 -10px 15px -1px rgba(255, 255, 255, 0.6),
    inset 0 8px 20px 0 rgba(0, 0, 0, 0.2),
    inset 0 0 5px 1px rgba(255, 255, 255, 0.6);
}

.toggle input:checked ~ .label {
  color: #0099ccd2;
}

.popover {
  position: relative;
  z-index: 0;

  .popover-painel {
    width: 300px;
    background: #ffffff;
    position: absolute;
    border-radius: 10px 0 10px 10px;
    box-shadow: 0 0 3px 1px #ccc;
    top: 70px;
    right: 15px;

    .title-notifications {
      color: #009acc;
      font-size: 20px;
      letter-spacing: 1px;
      font-weight: 600;
      padding: 5px 20px;
      border-radius: 10px 0 0 0;
      background: #f0eeee;
      box-shadow: 0 1px 2px 2px #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
      user-select: none;
    }

    .notifications {
      padding: 10px 5px;

      .img-no-notifications {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 190px;
        }
      }

      .card {
        width: 100%;
        max-width: 290px;
        height: 70px;
        background: #0099cc;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: left;
        backdrop-filter: blur(10px);
        transition: 0.5s ease-in-out;
        margin-top: 5px;
        position: relative;
        cursor: default;
        user-select: none;
      }

      .close-notification {
        position: absolute;
        top: -5px;
        right: 0px;
        height: 22px;
        width: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 600;
        color: #fff;
        text-align: center;
        background-color: red;
        cursor: pointer;
      }

      .card:hover {
        transform: scale(1.02);
      }

      .close-notification:hover {
        transform: scale(1.05);
      }

      .textBox {
        width: 100%;
        padding: 10px;
        color: white;
        font-family: "Poppins" sans-serif;
      }

      .textContent {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .span {
        font-size: 10px;
      }

      .h1 {
        font-size: 16px;
        font-weight: bold;
      }

      .p {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}
</style>
