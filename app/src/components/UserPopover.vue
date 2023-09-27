<template>
  <div class="dropdown">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ this.user.name }}
    </button>
    <ul class="dropdown-menu">
      <li>
        <div class="btn-logout" @click="logout()">
          <span>Sair</span>
          <v-icon class="icon-logout" name="hi-logout" />
        </div>
      </li>
    </ul>
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
.btn-secondary {
  background-color: #0099cc !important;
  border: none !important;
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
  gap: 10px;
  color: #0099cc;
  cursor: pointer;
  user-select: none;

  span {
    font-size: 18px;
    font-weight: 600;
  }
  .icon-logout {
    height: 20px;
    width: 20px;
  }
}
</style>
