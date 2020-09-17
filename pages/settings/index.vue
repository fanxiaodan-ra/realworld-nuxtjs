<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
                <fieldset class="form-group">
                  <input class="form-control" type="text" placeholder="URL of profile picture" v-model="user.image">
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.username" >
                </fieldset>
                <fieldset class="form-group">
                  <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" v-model="user.bio"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="user.email">
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="password" placeholder="Password" v-model="user.password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right" :disabled="buttonDisable" @click="onSetting">
                  Update Settings
                </button>

            </fieldset>
          </form>
          <hr/>
          <button class="btn btn-outline-danger" @click="onLogout">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { getUser, updateUser } from '@/api/user'
import { mapMutations } from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  async asyncData() {
    const { data } = await getUser()
    return {
      user: data.user
    }
  },
  data() {
    return {
      user: {
        username: '',
        email: '',
        image: '',
        bio: '',
        password: ''
      },
      buttonDisable: false
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    async onSetting () {
      this.buttonDisable = true
      const {data} = await updateUser({user: this.user})
      this.buttonDisable = false
      Cookie.set('user', data.user)
      this.setUser(data.user)
      this.$router.push({
        name: 'profile',
        params: {
          username: data.user.username
        }
      })
    },
    onLogout () {
      Cookie.remove('user')
      this.$router.push({
        name: 'home'
      })
    }
  },
}
</script>