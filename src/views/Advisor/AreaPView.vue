<template>

  <div>
    <div>
      <TextCustom 
        customColor="black1"
        customFontSize='page_title'>
        Dados do orientador
      </TextCustom>
    </div>
    <div class="divLine">
      <LineCustom width="90%"/>
    </div>
    <div style="margin-left: 20px;">
      <p>Siape : {{this.profileAdvisor['siape']}}</p>
      <p>Perfis : {{this.user['profile_acronyms']}}</p>
      <p>Nome : {{this.user['user_name']}}</p>
      <p>Telefone : {{this.user['phone']}}</p>
      <p>Email institucional : {{this.user['institutional_email']}}</p>
      <p>Email secundário : {{this.user['secondary_email']}}</p>
    </div>

    <div class="divLine">
      <LineCustom width="90%"/>
    </div>

    <div style="margin-left: 20px;">
      <p>Usuários permitidos: {{ $route.meta.allowedUsers }}</p>
    </div>
  </div>

</template>

<script>

import LineCustom from '../../components/LineCustom.vue'
import TextCustom from '../../components/TextCustom.vue'
import Utils from '../../js/utils.js'

export default {

  name: 'AreaPView',

  components: {
    LineCustom,
    TextCustom
  },

  data(){
    return {
      profileAdvisor: null
    }
  },

  created(){
    this.$root.pageName = 'Area de teste do orientador';
    this.user = this.$root.userLoggedData;
    this.profileAdvisor = Utils.getUserProfile(this.$root.userLoggedData, 'ADV');
  },
}
</script>

<!-- style applies only to this component -->
<style scoped>

.divLine{
  margin: 20px 0px;
}

</style>