<template>
  <div class="article-meta">
    <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }">
        <img :src="article.author.image"/>
      </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }"
        class="author">
        {{article.author.username}}
      </nuxt-link>
      <span class="date">{{article.createAt | date('MMM DD, YYYY')}}</span>
    </div>
    <template v-if="article.author.username === user.username">
      <nuxt-link class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug
          }
        }">
        <i class="ion-edit"></i>
         Edit Article
      </nuxt-link>
      <button class="btn btn-outline-danger btn-sm" @click="onDelete">
        <i class="ion-trash-a"></i>
        &nbsp;
         Delete Article
      </button>
    </template>
    <template v-else>
      <button :class="['btn', 'btn-sm', 'btn-outline-secondary', {'active': article.author.following}]" :disabled="following" @click="onFollow">
        <i class="ion-plus-round"></i>
        &nbsp;
        Follow Eric Simons
      </button>
      &nbsp;&nbsp;
      <button :class="['btn', 'btn-sm', 'btn-outline-primary', {'active': article.favorited}]" :disabled="favoriting" @click="onFavorite">
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
    
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { deleteArticle, addFavorite, deleteFavorite } from '@/api/article'
import { followUser, unfollowUser } from '@/api/profile'

export default {
  name: 'articleMeta',
  props: {
    article: {
      type: Object, 
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      following: false,
      favoriting: false
    }
  },
  methods: {
    async onDelete() {
      const { data } = await deleteArticle(this.article.slug)
      this.$router.push({
        name: 'home'
      })
    },
    async onFollow() {
      this.following = true
      if (this.article.author.following) {
        await unfollowUser(this.article.author.username)
        this.$emit('changeFollow', false)
      } else {
        await followUser(this.article.author.username)
        this.$emit('changeFollow', true)
      }
      this.following = false
    },
    async onFavorite() {
      this.favoriting = true
      if(this.article.favorited) {
        await deleteFavorite(this.article.slug)
        this.$emit('changeFavorite', false)
      } else {
        await addFavorite(this.article.slug)
        this.$emit('changeFavorite', true)        
      }
      this.favoriting = false
    },
  }
}
</script>