import { gql } from '@apollo/client';

export const GET_POSTS = gql`
    query amBlogPosts($page: Int, $type: AmBlogPageType, $entityId: Int) {
        amBlogPosts(page: $page, type: $type, entityId: $entityId) {
            all_post_size
            total_divided_by_visible
            canonical_url
            last_post {
                post_id
                title
                status
                url_key
                short_content
                published_at
                user_define_publish
                notify_on_enable
                display_short_content
                post_thumbnail
                list_thumbnail
                grid_class
                canonical_url
                post_thumbnail_alt
                list_thumbnail_alt
                tag_ids
                categories
                is_featured
            }
            items {
                post_id
                title
                status
                url_key
                short_content
                full_content
                meta_title
                meta_tags
                meta_description
                created_at
                updated_at
                published_at
                user_define_publish
                notify_on_enable
                display_short_content
                comments_enabled
                views
                post_thumbnail
                list_thumbnail
                grid_class
                canonical_url
                post_thumbnail_alt
                list_thumbnail_alt
                author_id
                related_post_ids
                tag_ids
                categories
                is_featured
                comment_count
            }
        }
    }
`;
