import { gql } from '@apollo/client';

export const GET_POST = gql`
    query amBlogPost($urlKey: String, $previewKey: String) {
        amBlogPost(urlKey: $urlKey, previewKey: $previewKey) {
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
            photography_author_id
            related_post_ids
            tag_ids
            categories
            is_featured
            comment_count
            next {
                post_id
                title
                url_key
            }
            previous {
                post_id
                title
                url_key
            }
            canonical_full_url
        }
    }
`;

export const GET_HREFLANGS = gql`
    query blogHreflangs($urlKey: String!, $pageType: String!, $entityId: Int) {
        blogHreflangs(urlKey: $urlKey, pageType: $pageType, entityId: $entityId) {
            url
            lang
        }
    }
`;
