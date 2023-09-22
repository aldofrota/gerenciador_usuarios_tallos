<template>
  <div class="main" v-if="this.usuario.nome">
    <!-- <div>
      <NavMenu />
    </div>
    <div class="colaborador" v-if="usuario.perfil === 'colaborador'">
      <TelaColaborador />
    </div>
    <b-tabs
      class="tabs mt-2"
      content-class="mt-3"
      small
      pills
      justified
      v-if="usuario.perfil === 'coordenador'"
    >
      <b-tab active>
        <template class="aba" #title>
          <b-icon class="icone" icon="clipboard-data" /><span class="nome"
            >Painel</span
          >
        </template>
        <Painel />
      </b-tab>
      <b-tab>
        <template #title>
          <b-icon class="icone" icon="file-earmark" /><span class="nome"
            >Ordens</span
          >
        </template>
        <Ordens />
      </b-tab>
      <b-tab>
        <template #title>
          <b-icon class="icone" icon="building" /><span class="nome"
            >Clientes</span
          >
        </template>
        <Clientes />
      </b-tab>
      <b-tab>
        <template #title>
          <b-icon class="icone" icon="person" /><span class="nome"
            >Colaboradores</span
          >
        </template>
        <Colaboradores />
      </b-tab>
    </b-tabs> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuario: {
        nome: "",
        perfil: "",
      },
    };
  },

  mounted() {
    if (!localStorage.nome) {
      this.$router.push("/login");
    }
    if (localStorage.nome) {
      this.usuario.nome = localStorage.nome;
    }
    if (localStorage.perfil) {
      this.usuario.perfil = localStorage.perfil;
    }
  },

  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
  -webkit-touch-callout: none; /* iPhone OS, Safari */
  -webkit-user-select: none; /* Chrome, Safari 3 */
  -khtml-user-select: none; /* Safari 2 */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  user-select: none; /* Possível implementação no futuro */
  cursor: default;
}

.tabs {
  width: 100%;
}
.icone {
  margin-right: 5px;
}
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  color: #252525;
  background-color: #f5f5f5;
}
a {
  color: #252525;
}
a:hover {
  color: #555555;
}

@media only screen and (max-width: 580px) {
  .nome {
    display: none;
  }
}
</style>
