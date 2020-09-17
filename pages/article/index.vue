<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{article.title}}</h1>

        <ArticleMeta :article="article" @changeFollow="changeFollow" @changeFavorite="changeFavorite"></ArticleMeta>

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body">
        </div>
        <ul class="tag-list">
          <li v-for="(tag, index) in article.tagList" :key="index" class="tag-default tag-pill tag-outline">
            {{tag}}
          </li>
        </ul>
      </div>

      <hr />

      <div class="article-actions">
        <ArticleMeta :article="article" @changeFollow="changeFollow" @changeFavorite="changeFavorite"></ArticleMeta>
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <form class="card comment-form" v-if="user">
            <div class="card-block">
              <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="comment"></textarea>
            </div>
            <div class="card-footer">
              <img :src="article.author.image" class="comment-author-img" />
              <button class="btn btn-sm btn-primary" @click="onComment">
              Post Comment
              </button>
            </div>
          </form>
          
          <ArticleComment :article="article"/>
          
        </div>

      </div>

    </div>

  </div>
</template>
<script>
import { getArticle, deployComment } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
import ArticleComment from './components/article-comment'
import { mapState } from 'vuex'
export default {
  name: 'ArticleIndex',
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article
    }
  },
  components: { ArticleMeta, ArticleComment },
  data () {
    return {
      comment: ''
    }
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: `${this.article.title} - RealWorld - ${this.article.author.username}`,
          name: this.article.title,
          content: this.article.description
        }
      ]
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onComment () {
      const {data} = await deployComment(this.$route.params.slug, {
        comment: {
          body: this.comment
        }
      })
    },
    changeFollow (value) {
      this.article.author.following = value
    },
    changeFavorite (value) {
      this.article.favorited = value
      if (value) {
        this.article.favoritesCount += 1
      } else {
        this.article.favoritesCount += -1
      }
    }
  },
}
</script>