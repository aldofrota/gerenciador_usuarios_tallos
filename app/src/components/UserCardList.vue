<template>
  <div class="main-user">
    <div class="user-name">{{ user.name }}</div>
    <div class="user-info">
      <span class="user-email">{{ user.email }}</span>
      <span class="user-role">
        {{ user.level.charAt(0).toUpperCase() + user.level.slice(1) }}
      </span>
      <v-icon
        class="icon-role"
        :name="
          user.level === 'admin' ? 'md-adminpanelsettings-outlined' : 'fa-user'
        "
      ></v-icon>

      <div
        v-if="this.myRole === 'admin' && user.email !== this.myEmail"
        class="dropdown"
      >
        <v-icon
          data-bs-toggle="dropdown"
          aria-expanded="false"
          class="icon-options"
          name="co-options"
        />

        <ul class="dropdown-menu">
          <li>
            <div class="itens-menu">
              <span>Excluir</span>
              <v-icon name="bi-trash-fill"></v-icon>
            </div>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <div
              class="itens-menu"
              data-bs-toggle="modal"
              :data-bs-target="'#' + user._id.replace(/[^a-zA-Z]/g, '')"
              @click="openModal(user)"
            >
              <span>Mudar Permissão</span>
              <v-icon name="la-user-edit-solid"></v-icon>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    :id="user._id.replace(/[^a-zA-Z]/g, '')"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            Alterar Permissão
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3 row">
            <label for="staticUsuario" class="col-sm-2 col-form-label"
              >Usuário</label
            >
            <div class="col-sm-10">
              <input
                type="text"
                readonly
                class="form-control-plaintext"
                id="staticUsuario"
                :value="user_editing.name"
              />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="inputRole" class="col-sm-2 col-form-label"
              >Permissão</label
            >
            <div class="col-sm-10">
              <select
                id="inputRole"
                class="form-select"
                v-model="user_editing.level"
              >
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
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
          <button type="button" class="btn btn-primary" @click="save()">
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      user_editing: {
        _id: "",
        name: "",
        email: "",
        level: "",
      },
    };
  },
  props: {
    user: {
      required: true,
    },
  },
  methods: {
    openModal(user) {
      this.user_editing = { ...user };
    },

    save() {
      const data = { ...this.user_editing };
      delete data.name;
      delete data.__v;
      delete data.password;
      axios
        .put(`http://192.168.0.103:3000/users/${data._id}`, data, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(() => {
          toast("Permissão do usuário atualizada", {
            type: "success",
          });
          this.closeModal();
        })
        .catch((error) => {
          toast("Erro ao mudar a permissão do usuário: " + error.message, {
            type: "error",
          });
        });
    },

    closeModal() {
      this.$refs.cancelBtn.click();

      this.user_editing.id = "";
      this.user_editing.name = "";
      this.user_editing.email = "";
      this.user_editing.level = "";
    },
  },
  computed: {
    myRole() {
      return this.$store.getters.getUserData.level;
    },
    myEmail() {
      return this.$store.getters.getUserData.email;
    },
  },
};
</script>

<style scoped lang="scss">
.main-user {
  height: 70px;
  width: calc(100% - 20px) !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 10px;
  background: #009acc;
  color: #fff;
  border-radius: 10px;
  cursor: default;

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;

    .user-role {
      font-size: 25px;
    }

    .icon-role {
      height: 30px;
      width: 30px;
    }

    .icon-options {
      height: 30px;
      width: 30px;
      cursor: pointer;
      transition: all 0.5s;
    }
    .icon-options:hover {
      transform: scale(1.2);
    }

    .itens-menu {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      font-size: 16px;
      transition: all 0.5s;
      color: #009acc;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
