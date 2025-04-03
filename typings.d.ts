type Comment = {
    created_at: string
    id: number
    post_id: number
    text: String
    username: String
  }

  type Vote = {
    created_at: string
    id: number
    post_id: number
    upvote: Boolean
    username: String
  }
  type Subreddit = {
    created_at: string
    id: number
    topic: string
  }
  type Post = {
    body: string
    created_at: string
    id: number
    image: string
    subreddit_id: number
    title: string
    username: string
    votes: Vote[]
    comments: Comments[]
    subreddit: subreddit[]
  }