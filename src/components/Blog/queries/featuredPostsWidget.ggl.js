import { gql } from '@apollo/client';

export const GET_FEATURED_POSTS = gql`
    query amBlogFeaturedPostsWidget($id: Int) {
        amBlogFeaturedPostsWidget(id: $id) {
            items {
                post_id
                title
                url_key
                post_thumbnail
                list_thumbnail
                post_thumbnail_alt
                list_thumbnail_alt
                is_featured
                categories
                published_at
            }
        }
    }
`;
