<template>
  <div class="popover">
    <div class="toggle" @click="abrirMenu">
      <input type="checkbox" v-model="open" />
      <span class="button"></span>
      <span class="label">{{ this.user.name }}</span>
    </div>

    <div v-if="open" class="animate__animated animate__fadeIn popover-painel">
      <div class="email-user">{{ this.user.email }}</div>
      <div class="btn-logout" @click="logout()">
        <span>Sair</span>
        <v-icon class="icon-logout" name="hi-logout" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
    };
  },
  props: {
    logout: {
      type: Function,
      required: true,
    },
    user: {
      required: true,
    },
  },
  methods: {
    chamarLogout() {
      this.logout();
    },

    abrirMenu() {
      this.open = !this.open;
    },
  },
};
</script>

<style lang="scss">
.toggle {
  display: inline-block;
}

.toggle {
  display: flex;
  align-items: center;
  position: relative;
  height: 50px;
  min-width: 170px;
}

.toggle:before {
  box-shadow: 0;
  border-radius: 10px;
  background: #fff;
  position: absolute;
  opacity: 0.2;
  height: 52px;
  min-width: 170px;
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
  height: 72px;
  width: 168.8px;
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
  top: -50%;
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
  .popover-painel {
    min-width: 250px;
    background: #ffffff;
    position: absolute;
    border-radius: 10px 0 10px 10px;
    box-shadow: 0 0 3px 1px #ccc;
    top: 70px;
    right: 15px;

    .email-user {
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

    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
      gap: 10px;
      color: #0099cc;
      cursor: pointer;
      user-select: none;

      span {
        font-size: 21px;
        font-weight: 600;
      }
      .icon-logout {
        height: 30px;
        width: 30px;
      }
    }
  }
}
</style>
