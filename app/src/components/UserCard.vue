<template>
  <div class="main-user animate__animated animate__fadeIn">
    <div class="name-role">
      <span>{{ user.name }}</span>
      <span>
        {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
        <v-icon
          :name="
            user.role === 'admin' ? 'md-adminpanelsettings-outlined' : 'fa-user'
          "
        ></v-icon>
      </span>
    </div>
    <div class="user-email">{{ user.email }}</div>
  </div>
</template>

<script setup>
import "animate.css";
const { user } = defineProps(["user"]);
</script>

<style scoped lang="scss">
.main-user {
  height: 70px;
  width: calc(100% - 20px) !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px 0;
  background: #d8d5d5;
  border-radius: 10px;
  cursor: default;

  .name-role {
    height: 60%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 22px;
    letter-spacing: 1px;
    font-weight: 600;
    padding: 0 10px;
    background-color: #ccc;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 1px 2px -1px black;
  }

  .name-role span:nth-child(2) {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .user-email {
    display: flex;
    align-items: center;
    height: 40%;
    padding: 0 10px;
    font-size: 12px;
  }
}
</style>
