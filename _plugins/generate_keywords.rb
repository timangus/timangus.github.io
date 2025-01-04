Jekyll::Hooks.register :site, :post_read do |site|
    all_tags = site.posts.docs.flat_map { |post| post.data['tags'] }.uniq
    site.config['keywords'] = all_tags.join(', ')
end

