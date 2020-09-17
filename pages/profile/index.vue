<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{profile.username}}</h4>
            <p>
              {{profile.bio}}
            </p>
            <template v-if="user && user.username === $route.username">
              <nuxt-link class="btn btn-sm btn-outline-secondary action-btn" :to="{
                name: 'settings'
                }">
                <i class="ion-gear-a"></i>
                Edit Profile Settings
              </nuxt-link>
            </template>
            <template v-else>
              <button class="btn btn-sm btn-outline-secondary action-btn"
                :class="{'active': profile.following}"
                :disabled="following" @click="onFollow">
                <i class="ion-plus-round"></i>
                &nbsp;
                Follow Eric Simons 
              </button>
            </template>
            
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a :class="['nav-link', {'active': currentTab === 'my_articles'}]" @click="changeTab('my_articles')">My Articles</a>
              </li>
              <li class="nav-item">
                <a :class="['nav-link', {'active': currentTab === 'favorited_articles'}]" @click="changeTab('favorited_articles')">Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                path: 'profile',
                params: { username: article.author.username}
              }">
                <img :src="article.author.image"/>
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{
                path: 'profile',
                params: { username: article.author.username}
                }"
                class="author">
                  {{article.author.username}}
                </nuxt-link>
                <span class="date">{{ article.createAt | date('MMM, DD YYYY')}}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{'active': article.favorited}"
                :disabled="article.favoriteDisabled"
                @click="onFavorite(article)">
                <i class="ion-heart"></i> {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link class="preview-link" :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }">
              <h1>{{article.title}}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
<script>
import { getProfile, followUser, unfollowUser } from '@/api/profile'
import { getArticles, addFavorite, deleteFavorite } from '@/api/article'
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name: 'PofileIndex',
  async asyncData({params}) {
    const [articleRes, favoritedArticleRes, profileRes] = await Promise.all([
      getArticles({
        author: params.username
      }),
      getArticles({
        favorited: params.username
      }),
      getProfile(params.username)
    ])
    
    const { articles: myArticles } = articleRes.data
    const { articles: favoritedArticles } = favoritedArticleRes.data
    myArticles.forEach((item) => {
      item.favoriteDisabled = false
    })
    favoritedArticles.forEach((item) => {
      item.favoriteDisabled = false
    })
    const { profile } = profileRes.data 
    console.log(favoritedArticles)
    return {
      myArticles,
      favoritedArticles,
      profile,
      currentTab: 'my_articles'
    }
  },
  data () {
    return {
      following: false
    }
  },
  computed: {
    ...mapState(['user']),
    articles() {
      return this.currentTab === 'my_articles' ? this.myArticles : this.favoritedArticles
    }
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true
      if(article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    changeTab(name) {
      this.currentTab = name
    },
    async onFollow() {
      this.following = true
      if (this.profile.following) {
        await unfollowUser(this.profile.username)
        this.profile.following = false
      } else {
        await followUser(this.profile.username)
        this.profile.following = true
      }
      this.following = false
    }
  },
}
</script>