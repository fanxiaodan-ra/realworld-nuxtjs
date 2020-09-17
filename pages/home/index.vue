<template>
  <div class="home-page">

  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">

      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item" v-if="user">
              <nuxt-link :class="['nav-link', {active: tab === 'your_feed'}]" exact :to="{
                path: '/',
                query: {
                  tab: 'your_feed'
                },
              }">Your Feed</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link :class="['nav-link', {active: tab === 'global_feed'}]" exact :to="{
                path: '/'
              }">Global Feed</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link :class="['nav-link', {active: tab === 'tag'}]" :to="{
                path: '/',
                query: {
                  tab,
                  tag
                }
              }" exact v-if="tag">{{`# ${tag}`}}</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="article-preview" v-for="article in articles" :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{
              name: 'profile',
              params: article.author.username
            }">
              <img :src="article.author.image" />
            </nuxt-link>
            <div class="info">
              <nuxt-link class="author" :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                {{article.author.username}}
              </nuxt-link>
              <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
            </div>
            <button :class="['btn', 'btn-outline-primary', 'btn-sm', 'pull-xs-right', {'active': article.favorited}]" :disabled="article.favoriteDisabled" @click="onFavorite(article)">
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
        <nav>
          <ul class="pagination">
            <li :class="['page-item', {'active': item === page}]" v-for="item in articleTotal" :key="item">
              <nuxt-link :class="['page-link']" 
              :to="{
                name: 'home',
                query: {
                  page: item,
                  tag,
                  tab
                }
              }">{{item}}</nuxt-link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="col-md-3">
        <div class="sidebar">
          <p>Popular Tags</p>

          <div class="tag-list" >
            <nuxt-link 
              :to="{
                name: 'home',
                query: {
                  tag: item,
                  tab: 'tag',
                }
              }" 
              class="tag-pill tag-default"
              v-for="(item, index) in tags"
              :key="index"> {{ item }} </nuxt-link>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
</template>
<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name:'HomeIndex',
  async asyncData({query}) {
    const limit = 10
    const page = Number.parseInt(query.page) || 1
    const tab = query.tab || 'global_feed'
    const tag = query.tag
    const getArticleApi = tab === 'your_feed' ? getFeedArticles : getArticles
    const [articleRes, tagRes] = await Promise.all([
      getArticleApi({
      limit,
      tag,
      offset: (page - 1) * limit
      }), 
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data
    articles.forEach((item) => {
      item.favoriteDisabled = false
    })

    return {
      articles,
      articlesCount,
      page,
      limit,
      tags,
      tab,
      tag
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    articleTotal () {
      return Number.parseInt(this.articlesCount / this.limit)
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
    }
  },
}
</script>