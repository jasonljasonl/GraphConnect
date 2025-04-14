import numpy as np
import faiss

from CreatePosts.models import Post

queryset = Post.objects.all()

posts = []

for post in queryset:
    posts.append(post)

print(posts)