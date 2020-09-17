<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <ul class="error-messages">
          <template v-for="(messages, field) in errors">
            <li v-for="(message, index) in messages" :key="index">
              {{field}} {{message}}
            </li>
          </template>
          
        </ul>
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input type="text" class="form-control form-control-lg" placeholder="Article Title" v-model="title">
              </fieldset>
              <fieldset class="form-group">
                  <input type="text" class="form-control" placeholder="What's this article about?" v-model="description">
              </fieldset>
              <fieldset class="form-group">
                  <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)" v-model="body"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input type="text" class="form-control" v-model="tag" placeholder="Enter tags" @keyup.enter="addTag"><div class="tag-list">
                    <span class="tag-default tag-pill" v-for="(tag, index) in tagList" :key="index">
                      <i class="ion-close-round" @click="deleteTag(index)"></i>
                      {{tag}}
                    </span>
                  </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="onSubmit">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { deployArticle, getArticle } from '@/api/article'
export default {
  middleware: 'authenticated',
  name: 'EditIndex',
  data () {
    return {
      tagList: [],
      tag: '',
      title: '',
      description: '',
      body: '',
      errors: []
    }
  },
  async mounted() {
    if (this.$route.params.slug) {
      const { data } = await getArticle(this.$route.params.slug)
      this.tagList = data.article.tagList
      this.title = data.article.title
      this.description = data.article.description
      this.body = data.article.body
    }
  },
  methods: {
    addTag() {
      if (this.tag !== '') {
        this.tagList.push(this.tag)
        this.tag = ''
      }
    },
    deleteTag(index) {
      this.tagList.splice(index)
    },
    async onSubmit() {
      try {
        let article = {
          title: this.title,
          description: this.description,
          body: this.body,
          tagList: this.tagList
        }
        const { data } = await deployArticle({article})
        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug
          }
        })
      }  catch (err) {
        this.errors = err.response.data.errors
      }
    }
  },
}
</script>