<template>
  <div>
    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{comment.body}}</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
          }">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
          }">
          {{comment.author.username}}
        </nuxt-link>
        <span class="date-posted">{{comment.createAt | date('MMM DD')}}</span>
        <span class="mod-options" v-if="user" @click="onDelete(comment.id)">
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getComments, deleteComment } from '@/api/article'
export default {
  name: 'articleComment',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init () {
      const {data} = await getComments(this.article.slug)
      this.comments = data.comments 
    },
    async onDelete (id) {
      const { data } = await deleteComment(this.article.slug, id)
      this.init()
    }
  },
}
</script>